import React from 'react';
import EmailLayout, { EMAIL_SUPPORT } from './shared/EmailLayout';
import { DetailList, EmailActions, EmailHeading, EmailParagraph } from './shared/EmailComponents';

interface OrderShippedEmailProps {
    orderId: string;
    customerName: string;
    trackingNumber?: string;
    trackingUrl?: string;
}

export const OrderShippedEmail = ({
    orderId = '#ORD-123456',
    customerName = 'Jane Doe',
    trackingNumber = '1Z999AA10123456784',
    trackingUrl = 'https://www.ups.com'
}: OrderShippedEmailProps) => {
    const rows = [
        { label: 'Order', value: orderId },
        ...(trackingNumber ? [{ label: 'Tracking number', value: trackingNumber }] : []),
    ];

    return (
        <EmailLayout previewText={`Order ${orderId} has shipped`}>
            <EmailHeading
                eyebrow="Shipped"
                title="Your order is on the way"
                subtitle={`Hi ${customerName}, order ${orderId} has left our facility.`}
            />
            <EmailParagraph>
                Store lyophilized materials as directed on the product page once they arrive. If a seal looks damaged, email support before opening the package.
            </EmailParagraph>
            <DetailList rows={rows} />
            <EmailActions
                primary={trackingUrl ? { href: trackingUrl, label: 'Track shipment' } : { href: `mailto:${EMAIL_SUPPORT}?subject=${encodeURIComponent(`Shipment ${orderId}`)}`, label: 'Contact support' }}
                secondary={{ href: `mailto:${EMAIL_SUPPORT}`, label: 'Email support' }}
            />
        </EmailLayout>
    );
};

export default OrderShippedEmail;
