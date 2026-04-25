import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

const ORDERS_JSON = path.join(process.cwd(), 'src/data/orders.json');

export async function GET() {
    try {
        let orders: any[] = [];

        // 1. Fetch from Supabase if available
        if (supabase) {
            const { data, error } = await supabase.from('orders').select('*');
            if (!error && data) orders = data;
        }

        // 2. Fallback to local JSON if no Supabase data or in dev
        if (orders.length === 0 && fs.existsSync(ORDERS_JSON)) {
            const content = fs.readFileSync(ORDERS_JSON, 'utf-8');
            orders = JSON.parse(content);
        }

        // 3. Aggregate unique customers
        const customerMap = new Map();

        orders.forEach(order => {
            const email = order.email;
            const totalStr = typeof order.total === 'string' ? order.total.replace('$', '') : order.total;
            const total = parseFloat(totalStr);

            if (!customerMap.has(email)) {
                customerMap.set(email, {
                    name: order.customer,
                    email: email,
                    totalSpent: 0,
                    orderCount: 0,
                    lastOrderDate: order.date,
                    orders: []
                });
            }

            const customer = customerMap.get(email);
            customer.totalSpent += total;
            customer.orderCount += 1;
            customer.orders.push(order);
            
            // Update latest order date if this one is newer
            if (new Date(order.date) > new Date(customer.lastOrderDate)) {
                customer.lastOrderDate = order.date;
            }
        });

        const customers = Array.from(customerMap.values()).sort((a, b) => b.totalSpent - a.totalSpent);

        return NextResponse.json(customers);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
