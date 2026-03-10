import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import fs from 'fs';
import path from 'path';
import { supabase } from '@/lib/supabase';
import { Resend } from 'resend';
import OrderReceiptEmail from '@/components/emails/OrderReceiptEmail';
import AdminOrderNotificationEmail from '@/components/emails/AdminOrderNotificationEmail';

const ORDERS_JSON = path.join(process.cwd(), 'src/data/orders.json');

function readOrdersLocal() {
    if (!fs.existsSync(ORDERS_JSON)) return [];
    const content = fs.readFileSync(ORDERS_JSON, 'utf-8');
    return JSON.parse(content);
}

function writeOrdersLocal(orders: unknown[]) {
    fs.writeFileSync(ORDERS_JSON, JSON.stringify(orders, null, 4));
}

interface OrderRow {
    id: string;
    order_number: string;
    created_at: string;
    customer_name: string;
    customer_email: string;
    total_amount: number;
    status: string;
    shipping_address: Record<string, unknown>;
    payment_method: string;
    payment_status: string;
    order_items?: OrderItemRow[];
}

interface OrderItemRow {
    id?: string;
    order_id?: string;
    product_id: string;
    variation_id?: string;
    product_name: string;
    quantity: number;
    price: number;
}

export async function GET() {
    try {
        if (supabase) {
            const { data, error } = await supabase
                .from('orders')
                .select('*, order_items(*)');

            if (error) throw error;

            // Map Supabase schema back to frontend expected format
            const orders = (data as unknown as OrderRow[]).map((o: OrderRow) => ({
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
    } catch (error: unknown) {
        console.error('API Error (GET Orders):', error instanceof Error ? error.message : String(error));
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}

async function sendOrderEmails(orderData: any) {
    if (!process.env.RESEND_API_KEY) {
        console.warn('RESEND_API_KEY is not set. Skipping emails.');
        return;
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
        const totalNum = parseFloat(orderData.total.replace('$', ''));
        const items = (orderData.full_items || orderData.items || []).map((item: any) => ({
            id: item.product_id || item.id,
            name: item.name || item.product_name || 'Product',
            price: item.price || 0,
            quantity: item.quantity || 1,
            variationString: item.variationString || item.variation_name || ''
        }));

        // Send to Customer
        await resend.emails.send({
            from: 'BioLongevity Labs <orders@biolongevitylabs.com>',
            to: [orderData.email],
            subject: `Order Confirmation ${orderData.id}`,
            react: OrderReceiptEmail({
                orderId: orderData.id,
                customerName: orderData.customer,
                customerEmail: orderData.email,
                items,
                total: totalNum,
                paymentMethod: orderData.payment_method || 'Manual Transfer'
            })
        });

        // Send to Admin
        await resend.emails.send({
            from: 'BioLongevity Labs <orders@biolongevitylabs.com>',
            to: ['support@biolongevitylabss.com'],
            subject: `New Order Received ${orderData.id}`,
            react: AdminOrderNotificationEmail({
                orderId: orderData.id,
                customerName: orderData.customer,
                customerEmail: orderData.email,
                items,
                total: totalNum,
                paymentMethod: orderData.payment_method || 'Manual Transfer',
                shippingAddress: {
                    addressLine1: orderData.shipping_address?.address || '',
                    city: orderData.shipping_address?.city || '',
                    state: orderData.shipping_address?.state || '',
                    zipCode: orderData.shipping_address?.zipCode || '',
                    country: orderData.shipping_address?.country || 'USA'
                }
            })
        });
        console.log(`Order emails sent successfully for ${orderData.id}`);
    } catch (emailError) {
        console.error('Failed to send order emails:', emailError);
    }
}

export async function POST(request: Request) {
    try {
        const orderData = await request.json();

        if (supabase) {
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
                        order_id: (order as unknown as OrderRow).id,
                        product_id: item.product_id || item.id,
                        variation_id: item.variation_id,
                        product_name: item.product_name || item.name,
                        quantity: item.quantity,
                        price: item.price
                    }))
                );
                if (itemsError) throw itemsError;
            }

            // 3. Send Emails asynchronously (don't block the response)
            sendOrderEmails(orderData);

            return NextResponse.json(order, { status: 201 });
        } else {
            const orders = readOrdersLocal();
            orders.push(orderData);
            writeOrdersLocal(orders);

            // 3. Send Emails asynchronously
            sendOrderEmails(orderData);

            return NextResponse.json(orderData, { status: 201 });
        }
    } catch (error: unknown) {
        console.error('API Error (POST Order):', error instanceof Error ? error.message : String(error));
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }
}
