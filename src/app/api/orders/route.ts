import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabase } from '@/lib/supabase';

const ORDERS_JSON = path.join(process.cwd(), 'src/data/orders.json');
const IS_SUPABASE_CONFIGURED = !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function readOrdersLocal() {
    if (!fs.existsSync(ORDERS_JSON)) return [];
    const content = fs.readFileSync(ORDERS_JSON, 'utf-8');
    return JSON.parse(content);
}

function writeOrdersLocal(orders: any[]) {
    fs.writeFileSync(ORDERS_JSON, JSON.stringify(orders, null, 4));
}

export async function GET() {
    try {
        if (IS_SUPABASE_CONFIGURED) {
            const { data, error } = await supabase
                .from('orders')
                .select('*, order_items(*)');

            if (error) throw error;

            // Map Supabase schema back to frontend expected format
            const orders = data.map(o => ({
                id: o.order_number,
                db_id: o.id, // Internal UUID
                date: new Date(o.created_at).toISOString().split('T')[0],
                customer: o.customer_name,
                email: o.customer_email,
                total: `$${o.total_amount.toFixed(2)}`,
                status: o.status.charAt(0).toUpperCase() + o.status.slice(1).toLowerCase(),
                items: o.order_items?.length || 0,
                full_items: o.order_items,
                shipping_address: o.shipping_address,
                payment_method: o.payment_method,
                payment_status: o.payment_status
            }));

            return NextResponse.json(orders);
        } else {
            const orders = readOrdersLocal();
            return NextResponse.json(orders);
        }
    } catch (error: any) {
        console.error('API Error (GET Orders):', error.message);
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const orderData = await request.json();

        if (IS_SUPABASE_CONFIGURED) {
            // 1. Insert order
            const { data: order, error: oError } = await supabase
                .from('orders')
                .insert({
                    order_number: orderData.id,
                    customer_name: orderData.customer,
                    customer_email: orderData.email,
                    total_amount: parseFloat(orderData.total.replace('$', '')),
                    status: orderData.status.toUpperCase(),
                    shipping_address: orderData.shipping_address || {},
                    payment_method: orderData.payment_method || 'Transfer',
                    payment_status: orderData.payment_status || 'PENDING'
                })
                .select()
                .single();

            if (oError) throw oError;

            // 2. Insert order items if provided
            if (orderData.full_items?.length) {
                const { error: itemsError } = await supabase.from('order_items').insert(
                    orderData.full_items.map((item: any) => ({
                        order_id: order.id,
                        product_id: item.product_id,
                        variation_id: item.variation_id,
                        product_name: item.product_name,
                        quantity: item.quantity,
                        price: item.price
                    }))
                );
                if (itemsError) throw itemsError;
            }

            return NextResponse.json(order, { status: 201 });
        } else {
            const orders = readOrdersLocal();
            orders.push(orderData);
            writeOrdersLocal(orders);
            return NextResponse.json(orderData, { status: 201 });
        }
    } catch (error: any) {
        console.error('API Error (POST Order):', error.message);
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }
}
