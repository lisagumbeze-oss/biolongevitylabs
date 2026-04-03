import React from 'react';
import { Text } from '@react-email/components';
import EmailLayout from './shared/EmailLayout';
import { OrderTable, InfoBlock, HeroHeader } from './shared/EmailComponents';

interface OrderReceiptEmailProps {
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
}

export const OrderReceiptEmail = ({
    orderId = '#ORD-123456',
    customerName = 'Jane Doe',
    customerEmail = 'jane@example.com',
    items = [
        { id: '1', name: 'BPC-157', price: 59.99, quantity: 2, variationString: '5mg Vial' }
    ],
    total = 119.98,
    paymentMethod = 'Zelle'
}: OrderReceiptEmailProps) => {
    return (
        <EmailLayout previewText={`Your BioLongevity Labs Order ${orderId}`}>
            <HeroHeader 
                title="Thank you for your order!" 
                subtitle={`Hi ${customerName}, we've received your order and it's now pending payment confirmation.`}
            />

            <OrderTable items={items} total={total} />

            <InfoBlock title="Payment Instructions">
                You selected <strong>{paymentMethod}</strong> as your payment method.
                Please follow the manual payment instructions provided on the checkout confirmation page.
                Once we receive and verify your payment, we will process your order for shipping.
            </InfoBlock>

            <Text className="text-slate-500 text-[14px] leading-[24px] text-center italic">
                Order ID: {orderId} • Customer: {customerEmail}
            </Text>
        </EmailLayout>
    );
};

export default OrderReceiptEmail;
