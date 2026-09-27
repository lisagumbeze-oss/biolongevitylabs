import React from 'react';
import EmailLayout, { EMAIL_SUPPORT } from './shared/EmailLayout';
import { EmailActions, EmailHeading, EmailParagraph } from './shared/EmailComponents';
import { SITE_URL } from '@/lib/site';

interface PaymentReceivedProps {
    orderId: string;
}

export const PaymentReceivedEmail1 = ({ orderId = '1234' }: PaymentReceivedProps) => {
    const displayOrderId = orderId.startsWith('#') ? orderId : `#${orderId}`;

    return (
        <EmailLayout previewText={`Payment received for order ${displayOrderId}`}>
            <EmailHeading
                eyebrow="Payment confirmed"
                title="Your payment was received"
                subtitle={`Order ${displayOrderId} is now being prepared for shipment.`}
            />
            <EmailParagraph>
                We matched the transfer to this order. You will receive tracking details when the package leaves the facility, usually within one to two business days.
            </EmailParagraph>
            <EmailActions
                primary={{ href: SITE_URL, label: 'Visit BioLongevity Labs' }}
                secondary={{ href: `mailto:${EMAIL_SUPPORT}?subject=${encodeURIComponent(`Order ${displayOrderId}`)}`, label: 'Contact support' }}
            />
        </EmailLayout>
    );
};

export default PaymentReceivedEmail1;
