import React from 'react';
import EmailLayout from './shared/EmailLayout';
import { DetailList, EmailHeading, EmailParagraph, OrderTable } from './shared/EmailComponents';

export const GuestOrderConfirmationEmail = () => {
    const orderId = '#ORD-987654321';
    const total = 303.98;
    const items = [
        { id: '1', name: 'Premium Wireless Headphones', price: 199.00, quantity: 1, variationString: 'Black Edition' },
        { id: '2', name: 'Ergonomic Mouse', price: 44.99, quantity: 2, variationString: 'Wireless' },
        { id: '3', name: 'Standard Shipping', price: 15.00, quantity: 1 }
    ];

    return (
        <EmailLayout previewText={`Order ${orderId} received`}>
            <EmailHeading
                eyebrow="Preview only"
                title="Order received"
                subtitle="This preview is not sent to customers. Live orders use the order receipt template."
            />
            <OrderTable items={items} total={total} />
            <DetailList
                rows={[
                    { label: 'Order', value: orderId },
                    { label: 'Payment', value: 'Manual transfer' },
                ]}
            />
            <EmailParagraph>Reference the order number when you send payment.</EmailParagraph>
        </EmailLayout>
    );
};

export default GuestOrderConfirmationEmail;
