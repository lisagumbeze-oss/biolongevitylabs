import React from 'react';
import { Text, Heading, Section, Row, Column } from '@react-email/components';
import EmailLayout from './shared/EmailLayout';
import { OrderTable, InfoBlock } from './shared/EmailComponents';

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
    shippingAddress = {
        addressLine1: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zipCode: '12345',
        country: 'USA'
    }
}: AdminOrderNotificationEmailProps) => {
    return (
        <EmailLayout previewText={`New Order Received: ${orderId} - $${total.toFixed(2)}`}>
            <Section className="mb-8 border-b-2 border-slate-100 border-solid pb-6">
                <Text className="text-emerald-600 text-[12px] font-black uppercase tracking-widest m-0 mb-2">
                    Action Required
                </Text>
                <Heading className="text-slate-900 text-[28px] font-black leading-[36px] m-0">
                    Order {orderId}
                </Heading>
            </Section>

            <Section className="mb-10 p-6 bg-slate-50 border border-slate-200 border-solid rounded-2xl">
                <Row>
                    <Column className="w-[50%]">
                        <Text className="text-slate-500 text-[11px] font-black uppercase tracking-widest m-0 mb-1">Customer</Text>
                        <Text className="text-slate-900 text-[15px] font-bold m-0">{customerName}</Text>
                        <Text className="text-primary text-[14px] m-0">{customerEmail}</Text>
                    </Column>
                    <Column className="w-[50%]">
                        <Text className="text-slate-500 text-[11px] font-black uppercase tracking-widest m-0 mb-1">Payment Method</Text>
                        <Text className="text-slate-900 text-[15px] font-bold m-0">{paymentMethod}</Text>
                    </Column>
                </Row>
            </Section>

            <OrderTable items={items} total={total} />

            <InfoBlock title="Shipping Address">
                <strong>{customerName}</strong><br />
                {shippingAddress.addressLine1}
                {shippingAddress.addressLine2 && <><br />{shippingAddress.addressLine2}</>}
                <br />
                {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}
                <br />
                {shippingAddress.country}
            </InfoBlock>

            <Text className="text-slate-400 text-[12px] text-center mt-12">
                This is an automated notification from BioLongevity Labs Store Backend.
            </Text>
        </EmailLayout>
    );
};

export default AdminOrderNotificationEmail;
