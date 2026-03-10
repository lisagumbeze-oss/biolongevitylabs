import React from 'react';
import {
    Html,
    Body,
    Head,
    Heading,
    Container,
    Preview,
    Section,
    Text,
    Tailwind,
    Row,
    Column,
    Hr
} from '@react-email/components';

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
    const previewText = `New Order Received: ${orderId} - $${total.toFixed(2)}`;

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Tailwind>
                <Body className="bg-slate-50 my-auto mx-auto font-sans px-2">
                    <Container className="border border-solid border-slate-200 rounded-xl my-[40px] mx-auto p-[30px] w-[600px] bg-white">
                        <Text className="text-emerald-600 text-[14px] font-bold tracking-widest uppercase m-0">
                            New Order Received
                        </Text>

                        <Heading className="text-slate-900 text-[24px] font-bold p-0 my-[16px] mx-0">
                            Order {orderId}
                        </Heading>

                        <Section className="bg-slate-50 border border-solid border-slate-200 rounded-lg p-6 my-6">
                            <Row>
                                <Column className="w-[50%]">
                                    <Text className="text-slate-500 text-[12px] uppercase font-bold m-0 mb-1">Customer</Text>
                                    <Text className="text-slate-900 text-[14px] m-0 font-medium">{customerName}</Text>
                                    <Text className="text-[#137fec] text-[14px] m-0">{customerEmail}</Text>
                                </Column>
                                <Column className="w-[50%]">
                                    <Text className="text-slate-500 text-[12px] uppercase font-bold m-0 mb-1">Payment Method</Text>
                                    <Text className="text-slate-900 text-[14px] m-0 font-medium">{paymentMethod}</Text>
                                </Column>
                            </Row>
                        </Section>

                        <Section className="my-6">
                            <Heading as="h3" className="text-slate-900 text-[16px] font-bold mt-0 mb-4 border-b border-solid border-slate-200 pb-2">
                                Order Items
                            </Heading>

                            {items.map((item, index) => (
                                <Row key={index} className="mb-4">
                                    <Column className="w-[70%]">
                                        <Text className="text-slate-900 text-[14px] font-medium m-0">
                                            {item.name}
                                        </Text>
                                        {item.variationString && (
                                            <Text className="text-slate-500 text-[12px] m-0">
                                                {item.variationString}
                                            </Text>
                                        )}
                                    </Column>
                                    <Column className="w-[10%] text-center">
                                        <Text className="text-slate-700 text-[14px] m-0">x{item.quantity}</Text>
                                    </Column>
                                    <Column className="w-[20%] text-right">
                                        <Text className="text-slate-900 text-[14px] m-0 text-right">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </Text>
                                    </Column>
                                </Row>
                            ))}

                            <Hr className="border border-solid border-slate-200 my-4 mx-0 w-full" />

                            <Row>
                                <Column className="w-[80%]">
                                    <Text className="text-slate-900 text-[16px] font-bold m-0">Total</Text>
                                </Column>
                                <Column className="w-[20%] text-right">
                                    <Text className="text-slate-900 text-[16px] font-medium m-0 text-right">
                                        ${total.toFixed(2)}
                                    </Text>
                                </Column>
                            </Row>
                        </Section>

                        <Section className="bg-slate-50 border border-solid border-slate-200 rounded-lg p-6 my-6">
                            <Heading as="h3" className="text-slate-900 text-[16px] font-bold mt-0 mb-2">
                                Shipping Details
                            </Heading>
                            <Text className="text-slate-700 text-[14px] m-0">
                                {customerName}<br />
                                {shippingAddress.addressLine1}
                                {shippingAddress.addressLine2 && <><br />{shippingAddress.addressLine2}</>}
                                <br />
                                {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}
                                <br />
                                {shippingAddress.country}
                            </Text>
                        </Section>

                        <Text className="text-slate-500 text-[12px] text-center mt-[40px]">
                            This is an automated notification from BioLongevity Labs.
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default AdminOrderNotificationEmail;
