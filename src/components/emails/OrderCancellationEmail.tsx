import React from 'react';
import EmailLayout, { EMAIL_SUPPORT } from './shared/EmailLayout';
import { EmailActions, EmailHeading, EmailParagraph } from './shared/EmailComponents';
import { SITE_URL } from '@/lib/site';

interface OrderCancellationProps {
    orderId: string;
}

export const OrderCancellationEmail = ({ orderId = '1234' }: OrderCancellationProps) => {
    const displayOrderId = orderId.startsWith('#') ? orderId : `#${orderId}`;

    return (
        <EmailLayout previewText={`Order ${displayOrderId} was canceled`}>
            <EmailHeading
                eyebrow="Order canceled"
                title="This order was canceled"
                subtitle={`Order ${displayOrderId} will not be shipped.`}
            />
            <EmailParagraph>
                Payment was not confirmed in time, so the items were released back to inventory. If you already sent a transfer, reply to this email with the receipt and we will review it.
            </EmailParagraph>
            <EmailActions
                primary={{ href: `${SITE_URL}/shop`, label: 'Return to the shop' }}
                secondary={{ href: `mailto:${EMAIL_SUPPORT}?subject=${encodeURIComponent(`Canceled order ${displayOrderId}`)}`, label: 'Contact support' }}
            />
        </EmailLayout>
    );
};

export default OrderCancellationEmail;
