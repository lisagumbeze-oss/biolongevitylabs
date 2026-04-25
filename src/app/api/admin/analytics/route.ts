import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

const ORDERS_JSON = path.join(process.cwd(), 'src/data/orders.json');

function readOrdersLocal() {
    if (!fs.existsSync(ORDERS_JSON)) return [];
    const content = fs.readFileSync(ORDERS_JSON, 'utf-8');
    return JSON.parse(content);
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const period = searchParams.get('period') || '30'; // default 30 days
        const days = parseInt(period, 10);
        
        const now = new Date();
        const startDate = new Date();
        startDate.setDate(now.getDate() - days);
        
        const prevStartDate = new Date();
        prevStartDate.setDate(now.getDate() - (days * 2));
        const prevEndDate = new Date(startDate);

        let allOrders: any[] = [];

        if (supabase) {
            const { data, error } = await supabase
                .from('orders')
                .select('*, order_items(*)');
            if (error) throw error;
            allOrders = data || [];
        } else {
            allOrders = readOrdersLocal();
        }

        // Standardize orders for calculation
        const formattedOrders = allOrders.map(o => ({
            id: o.order_number || o.id,
            date: new Date(o.created_at || o.date),
            total: typeof o.total_amount === 'number' ? o.total_amount : parseFloat((o.total || '$0').replace('$', '')),
            status: (o.status || '').toUpperCase(),
            items: o.order_items || o.full_items || []
        }));

        // Filter for current period and previous period
        const currentOrders = formattedOrders.filter(o => o.date >= startDate && o.date <= now);
        const previousOrders = formattedOrders.filter(o => o.date >= prevStartDate && o.date < prevEndDate);

        // KPI Calculations
        const calculateKPIs = (orders: any[]) => {
            const completedOrders = orders.filter(o => ['COMPLETED', 'SHIPPED', 'PAID', 'PROCESSING'].includes(o.status));
            const revenue = completedOrders.reduce((acc, o) => acc + o.total, 0);
            const count = completedOrders.length;
            const aov = count > 0 ? revenue / count : 0;
            return { revenue, count, aov };
        };

        const currentKPIs = calculateKPIs(currentOrders);
        const previousKPIs = calculateKPIs(previousOrders);

        const getGrowth = (current: number, previous: number) => {
            if (previous === 0) return current > 0 ? 100 : 0;
            return ((current - previous) / previous) * 100;
        };

        // Chart Data (Revenue by day)
        const revenueByDay: Record<string, { date: string, revenue: number, orders: number }> = {};
        
        // Initialize days
        for (let i = 0; i <= days; i++) {
            const d = new Date(startDate);
            d.setDate(d.getDate() + i);
            const key = d.toISOString().split('T')[0];
            revenueByDay[key] = { date: key, revenue: 0, orders: 0 };
        }

        currentOrders.forEach(o => {
            if (['COMPLETED', 'SHIPPED', 'PAID', 'PROCESSING'].includes(o.status)) {
                const key = o.date.toISOString().split('T')[0];
                if (revenueByDay[key]) {
                    revenueByDay[key].revenue += o.total;
                    revenueByDay[key].orders += 1;
                }
            }
        });

        const chartData = Object.values(revenueByDay).sort((a, b) => a.date.localeCompare(b.date));

        // Top Products
        const productSales: Record<string, { name: string, units: number, revenue: number }> = {};
        currentOrders.forEach(o => {
            if (['COMPLETED', 'SHIPPED', 'PAID', 'PROCESSING'].includes(o.status)) {
                o.items.forEach((item: any) => {
                    const name = item.product_name || item.name;
                    if (!productSales[name]) {
                        productSales[name] = { name, units: 0, revenue: 0 };
                    }
                    productSales[name].units += (item.quantity || 1);
                    productSales[name].revenue += (item.price * (item.quantity || 1));
                });
            }
        });

        const topProducts = Object.values(productSales)
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);

        return NextResponse.json({
            kpis: {
                revenue: {
                    value: currentKPIs.revenue,
                    growth: getGrowth(currentKPIs.revenue, previousKPIs.revenue)
                },
                orders: {
                    value: currentKPIs.count,
                    growth: getGrowth(currentKPIs.count, previousKPIs.count)
                },
                aov: {
                    value: currentKPIs.aov,
                    growth: getGrowth(currentKPIs.aov, previousKPIs.aov)
                }
            },
            chartData,
            topProducts
        });

    } catch (error: any) {
        console.error('Analytics API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }
}
