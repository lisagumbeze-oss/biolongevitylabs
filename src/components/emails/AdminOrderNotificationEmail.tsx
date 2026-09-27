import React from 'react';
import EmailLayout, { EMAIL_SUPPORT } from './shared/EmailLayout';
import { CryptoWalletList, DetailList, EmailActions, EmailHeading, EmailParagraph, OrderTable } from './shared/EmailComponents';
import { SITE_URL } from '@/lib/site';
import type { CryptoQuote } from '@/lib/crypto-quotes';

interface AdminOrderNotificationEmailProps {
    orderId: string;
    customerName: string;
    customerEmail: string;
    items: Array<{
        id: string;
        name: string;
        price: number;
        quantity: number;
        variationString?: string;
    }>;
    total: number;
    paymentMethod: string;
    paymentWalletAddress?: string;
    paymentType?: string;
    cryptoQuotes?: CryptoQuote[];
    shippingAddress: {
        addressLine1: string;
        addressLine2?: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
}

export const AdminOrderNotificationEmail = ({
    orderId = '#ORD-123456',
    customerName = 'Jane Doe',
    customerEmail = 'jane@example.com',
    items = [
        { id: '1', name: 'BPC-157', price: 59.99, quantity: 2, variationString: '5mg Vial' }
    ],
    total = 119.98,
    paymentMethod = 'Venmo',
    paymentType,
    cryptoQuotes,
    shippingAddress = {
        addressLine1: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zipCode: '12345',
        country: 'USA'
    }
}: AdminOrderNotificationEmailProps) => {
    const orderPath = orderId.replace('#', '');
    const address = [
        shippingAddress.addressLine1,
        shippingAddress.addressLine2,
        `${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipCode}`,
        shippingAddress.country,
    ].filter(Boolean).join('\n');

    return (
        <EmailLayout previewText={`New order ${orderId} · $${total.toFixed(2)} from ${customerName}`}>
            <EmailHeading
                eyebrow="New order"
                title={orderId}
                subtitle="A customer placed an order. Confirm the payment, then update the order status."
            />
            <DetailList
                rows={[
                    { label: 'Customer', value: customerName },
                    { label: 'Email', value: customerEmail },
                    { label: 'Payment', value: paymentMethod },
                    { label: 'Total due', value: `$${total.toFixed(2)}` },
                    { label: 'Ship to', value: address },
                ]}
            />
            <OrderTable items={items} total={total} />
            {paymentType === 'crypto' && <CryptoWalletList quotes={cryptoQuotes} total={total} />}
            <EmailActions
                primary={{ href: `${SITE_URL}/admin/orders/${orderPath}`, label: 'Open order' }}
                secondary={{ href: `mailto:${customerEmail}`, label: 'Email customer' }}
            />
            <EmailParagraph>
                Replies to this message can also go to {EMAIL_SUPPORT}.
            </EmailParagraph>
        </EmailLayout>
    );
};

export default AdminOrderNotificationEmail;
