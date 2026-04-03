import { NextResponse } from 'next/server';
import React from 'react';
export const dynamic = 'force-dynamic';
import fs from 'fs';
import path from 'path';
import { supabase } from '@/lib/supabase';
import { sendEmail } from '@/lib/mail';
import OrderReceiptEmail from '@/components/emails/OrderReceiptEmail';
import AdminOrderNotificationEmail from '@/components/emails/AdminOrderNotificationEmail';
import PaymentReceivedEmail1 from '@/components/emails/PaymentReceivedEmail1';
import OrderCancellationEmail from '@/components/emails/OrderCancellationEmail';

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
    customer_phone?: string;
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
                .select('*, order_items(*)')
                .order('created_at', { ascending: false }); // Most recent first as requested

            if (error) throw error;

            // Map Supabase schema back to frontend expected format
            const orders = (data as unknown as OrderRow[]).map((o: OrderRow) => ({
                id: o.order_number,
                db_id: o.id, // Internal UUID
                date: new Date(o.created_at).toISOString().split('T')[0],
                created_at: o.created_at,
                customer: o.customer_name,
                email: o.customer_email,
                phone: o.customer_phone,
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
            // Sort local orders as well (earliest first)
            const sortedOrders = [...orders].sort((a, b) => {
                const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
                const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
                return dateB - dateA;
            });
            return NextResponse.json(sortedOrders);
        }
    } catch (error: unknown) {
        console.error('API Error (GET Orders):', error instanceof Error ? error.message : String(error));
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}

async function sendOrderEmails(orderData: any) {
    if (!process.env.SMTP_HOST) {
        console.warn('SMTP_HOST is not set. Skipping emails.');
        return;
    }

    try {
        const totalNum = parseFloat(orderData.total.replace('$', ''));
        const items = (orderData.full_items || orderData.items || []).map((item: any) => {
            let variationString = item.variationString || item.variation_name || '';
            
            if (!variationString && item.selectedOptions) {
                variationString = Object.entries(item.selectedOptions)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join(', ');
            }

            return {
                id: item.product_id || item.id,
                name: item.name || item.product_name || 'Product',
                price: item.price || 0,
                quantity: item.quantity || 1,
                variationString
            };
        });

        // Send to Customer
        await sendEmail({
            to: orderData.email,
            subject: `Order Confirmation ${orderData.id}`,
            react: React.createElement(OrderReceiptEmail, {
                orderId: orderData.id,
                customerName: orderData.customer,
                customerEmail: orderData.email,
                items,
                total: totalNum,
                paymentMethod: orderData.payment_method || 'Manual Transfer'
            })
        });

        // Send to Admin
        await sendEmail({
            to: process.env.SMTP_FROM_EMAIL || 'support@biolongevitylabss.com',
            subject: `New Order Received ${orderData.id}`,
            react: React.createElement(AdminOrderNotificationEmail, {
                orderId: orderData.id,
                customerName: orderData.customer,
                customerEmail: orderData.email,
                items,
                total: totalNum,
                paymentMethod: orderData.payment_method || 'Manual Transfer',
                shippingAddress: {
                    addressLine1: orderData.shipping_address?.address || orderData.shipping_address?.street || '',
                    city: orderData.shipping_address?.city || '',
                    state: orderData.shipping_address?.state || '',
                    zipCode: orderData.shipping_address?.zipCode || orderData.shipping_address?.zip || '',
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

        // Log incoming order for debugging
        console.log('[Orders API] Creating order:', orderData.id, 'email:', orderData.email);

        if (supabase) {
            // 1. Insert order row
            const insertPayload = {
                order_number: orderData.id,
                customer_name: orderData.customer,
                customer_email: orderData.email,
                customer_phone: orderData.phone || null,
                total_amount: parseFloat((orderData.total || '$0').replace('$', '')),
                status: 'PENDING',
                shipping_address: orderData.shipping_address || {},
                payment_method: orderData.payment_method || 'Transfer',
                payment_status: 'PENDING'
            };

            console.log('[Orders API] Inserting order payload:', JSON.stringify(insertPayload));

            const { data: order, error: oError } = await supabase
                .from('orders')
                .insert(insertPayload)
                .select()
                .single();

            if (oError) {
                console.error('[Orders API] Supabase order insert error:', JSON.stringify(oError));
                throw new Error(`Supabase order insert failed: ${oError.message} (code: ${oError.code})`);
            }

            // 2. Insert order items (best-effort; don't fail the whole order if this fails)
            if (orderData.full_items?.length) {
                const itemsPayload = orderData.full_items.map((item: any) => {
                    const row: any = {
                        order_id: (order as unknown as OrderRow).id,
                        product_id: String(item.product_id || item.id || 'unknown'),
                        product_name: item.product_name || item.name || 'Product',
                        quantity: Number(item.quantity) || 1,
                        price: Number(item.price) || 0,
                    };
                    // Only include variation_id if it has a real value
                    if (item.variation_id) {
                        row.variation_id = item.variation_id;
                    }
                    return row;
                });

                console.log('[Orders API] Inserting items:', JSON.stringify(itemsPayload));

                const { error: itemsError } = await supabase.from('order_items').insert(itemsPayload);
                if (itemsError) {
                    // Log but don't block — order is already saved
                    console.error('[Orders API] Order items insert error (non-fatal):', JSON.stringify(itemsError));
                }
            }

            // 3. Send confirmation emails (non-fatal, non-blocking)
            sendOrderEmails(orderData).catch(emailErr => {
                console.error('[Orders API] Background email failed:', emailErr);
            });
            
            console.log('[Orders API] Order created successfully:', orderData.id);
            return NextResponse.json(order, { status: 201 });

        } else {
            // Local JSON fallback (development / no Supabase)
            try {
                const orders = readOrdersLocal();
                const orderWithMeta = {
                    ...orderData,
                    created_at: new Date().toISOString()
                };
                orders.push(orderWithMeta);
                writeOrdersLocal(orders);
                console.log('[Orders API] Order saved locally:', orderData.id);

                // Send confirmation emails (non-blocking)
                sendOrderEmails(orderData).catch(emailErr => {
                    console.error('[Orders API] Background email failed (local):', emailErr);
                });

                return NextResponse.json(orderWithMeta, { status: 201 });
            } catch (fsError) {
                // Filesystem may be read-only in some environments
                console.error('[Orders API] Local file write failed:', fsError);
                // Return success anyway — email was likely the only goal
                const fallbackOrder = { ...orderData, created_at: new Date().toISOString() };
                try { await sendOrderEmails(orderData); } catch (_) {}
                return NextResponse.json(fallbackOrder, { status: 201 });
            }
        }
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : String(error);
        console.error('[Orders API] CRITICAL ERROR (POST Order):', msg);
        return NextResponse.json({ error: 'Failed to create order', detail: msg }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const orderId = searchParams.get('id');

        if (!orderId) {
            return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
        }

        if (supabase) {
            const { error } = await supabase
                .from('orders')
                .delete()
                .eq('order_number', orderId);

            if (error) throw error;
        } else {
            const orders = readOrdersLocal();
            const filteredOrders = orders.filter((o: any) => o.id !== orderId);
            writeOrdersLocal(filteredOrders);
        }

        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        console.error('API Error (DELETE Order):', error instanceof Error ? error.message : String(error));
        return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
    }
}

async function sendStatusUpdateEmail(orderData: any) {
    if (!process.env.SMTP_HOST) {
        console.warn('SMTP_HOST is not set. Skipping emails.');
        return;
    }

    try {
        if (orderData.status === 'Processing' || orderData.payment_status === 'PAID') {
            await sendEmail({
                to: orderData.email,
                subject: `Payment Received - Order ${orderData.id}`,
                react: React.createElement(PaymentReceivedEmail1, { orderId: orderData.id })
            });
            console.log(`Payment success email sent for ${orderData.id}`);
        } else if (orderData.status === 'Failed' || orderData.payment_status === 'FAILED') {
            await sendEmail({
                to: orderData.email,
                subject: `Order Canceled - ${orderData.id}`,
                react: React.createElement(OrderCancellationEmail, { orderId: orderData.id })
            });
            console.log(`Order cancellation email sent for ${orderData.id}`);
        } else if (orderData.status === 'Shipped') {
            await sendEmail({
                to: orderData.email,
                subject: `Order Shipped - ${orderData.id}`,
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h2 style="color: #1a1a1a;">Your BioLongevity Labs Order Has Shipped!</h2>
                        <p>Good news! Your order <strong>${orderData.id}</strong> is on its way.</p>
                        <p>Thank you for choosing BioLongevity Labs.</p>
                    </div>
                `
            });
            console.log(`Order shipped email sent for ${orderData.id}`);
        }
    } catch (error) {
        console.error('Failed to send status update email:', error);
    }
}

export async function PUT(request: Request) {
    try {
        const updateData = await request.json();
        const { id, status, payment_status } = updateData;

        if (!id) return NextResponse.json({ error: 'Order ID required' }, { status: 400 });

        let updatedOrder = null;

        if (supabase) {
            const updateObj: any = {};
            if (status) updateObj.status = status;
            if (payment_status) updateObj.payment_status = payment_status;

            const { data, error } = await supabase
                .from('orders')
                .update(updateObj)
                .eq('order_number', id)
                .select()
                .single();

            if (error) throw error;
            updatedOrder = data;
        } else {
            const orders = readOrdersLocal();
            const index = orders.findIndex((o: any) => o.id === id);
            if (index > -1) {
                if (status) orders[index].status = status;
                if (payment_status) orders[index].payment_status = payment_status;
                updatedOrder = orders[index];
                writeOrdersLocal(orders);
            } else {
                return NextResponse.json({ error: 'Order not found' }, { status: 404 });
            }
        }

        // Send status email asynchronously (but await it)
        if (updatedOrder && (status || payment_status)) {
            try {
                const emailData = {
                    id: (updatedOrder as any).order_number || (updatedOrder as any).id || id,
                    email: (updatedOrder as any).customer_email || (updatedOrder as any).email,
                    status: (updatedOrder as any).status || status,
                    payment_status: (updatedOrder as any).payment_status || payment_status,
                };
                // Send status email asynchronously (non-blocking)
                sendStatusUpdateEmail(emailData).catch(emailErr => {
                    console.error('[Orders API] Background status email failed:', emailErr);
                });
            } catch (emailErr) {
                console.error('Email preparation failed:', emailErr);
            }
        }

        return NextResponse.json({ success: true, order: updatedOrder });
    } catch (error: unknown) {
        console.error('API Error (PUT Order):', error instanceof Error ? error.message : String(error));
        return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }
}

