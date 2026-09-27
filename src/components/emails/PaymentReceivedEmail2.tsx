import React from 'react';
import EmailLayout, { EMAIL_SUPPORT } from './shared/EmailLayout';
import { DetailList, EmailActions, EmailHeading, EmailParagraph } from './shared/EmailComponents';

export const PaymentReceivedEmail2 = () => {
    const orderId = '#ORD-1234';

    return (
        <EmailLayout previewText={`Payment still needed for order ${orderId}`}>
            <EmailHeading
                eyebrow="Preview only"
                title="Payment still needed"
                subtitle={`Order ${orderId} is on hold until the transfer is confirmed. This preview is not sent automatically.`}
            />
            <EmailParagraph>
                If you already paid, reply with the receipt so we can match it to the order.
            </EmailParagraph>
            <DetailList
                rows={[
                    { label: 'Order', value: orderId },
                    { label: 'Reference', value: orderId.replace('#', '') },
                ]}
            />
            <EmailActions primary={{ href: `mailto:${EMAIL_SUPPORT}?subject=${encodeURIComponent(`Payment receipt ${orderId}`)}`, label: 'Send payment receipt' }} />
        </EmailLayout>
    );
};

export default PaymentReceivedEmail2;
