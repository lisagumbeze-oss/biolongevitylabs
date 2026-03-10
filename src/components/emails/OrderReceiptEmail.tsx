import React from 'react';
import {
    Html,
    Body,
    Head,
    Heading,
    Hr,
    Container,
    Preview,
    Section,
    Text,
    Tailwind,
    Link,
    Row,
    Column
} from '@react-email/components';

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
    const previewText = `Your BioLongevity Labs Order ${orderId}`;

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Tailwind>
                <Body className="bg-slate-50 my-auto mx-auto font-sans px-2">
                    <Container className="border border-solid border-slate-200 rounded-xl my-[40px] mx-auto p-[30px] w-[600px] bg-white">
                        <Text className="text-primary text-2xl font-black text-center m-0">
                            BioLongevity Labs
                        </Text>

                        <Heading className="text-slate-900 text-[24px] font-bold text-center p-0 my-[30px] mx-0">
                            Thank you for your order!
                        </Heading>

                        <Text className="text-slate-700 text-[16px] leading-[24px]">
                            Hi {customerName},
                        </Text>
                        <Text className="text-slate-700 text-[16px] leading-[24px]">
                            We have received your order <strong>{orderId}</strong> and it is now pending payment confirmation.
                            Please review your order details below.
                        </Text>

                        <Section className="bg-slate-50 border border-solid border-slate-200 rounded-lg p-6 my-6">
                            <Heading as="h3" className="text-slate-900 text-[18px] font-bold mt-0 mb-4">
                                Order Summary
                            </Heading>

                            {items.map((item, index) => (
                                <Row key={index} className="mb-4">
                                    <Column className="w-[70%]">
                                        <Text className="text-slate-900 text-[14px] font-bold m-0">
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
                                        <Text className="text-slate-900 text-[14px] font-bold m-0 text-right">
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
                                    <Text className="text-[#137fec] text-[18px] font-black m-0 text-right">
                                        ${total.toFixed(2)}
                                    </Text>
                                </Column>
                            </Row>
                        </Section>

                        <Section className="bg-[#f0f7ff] border border-solid border-[#137fec] rounded-lg p-6 my-6 text-center">
                            <Heading as="h3" className="text-[#137fec] text-[18px] font-bold mt-0 mb-2">
                                Payment Instructions
                            </Heading>
                            <Text className="text-slate-700 text-[14px] leading-[22px] m-0">
                                You selected <strong>{paymentMethod}</strong> as your payment method.
                            </Text>
                            <Text className="text-slate-700 text-[14px] leading-[22px] mt-2 mb-0">
                                Please follow the manual payment instructions provided on the checkout confirmation page.
                                Once we receive and verify your payment, we will process your order for shipping.
                            </Text>
                        </Section>

                        <Text className="text-slate-500 text-[12px] leading-[20px] text-center mt-[40px]">
                            BioLongevity Labs Headquarters<br />
                            F2 Nutrition Inc. 405 Rothrock Rd #106 Akron, OH 44321
                        </Text>
                        <Text className="text-slate-500 text-[12px] leading-[20px] text-center">
                            If you have any questions, reply to this email or contact us at <Link href="mailto:support@biolongevitylabss.com" className="text-[#137fec]">support@biolongevitylabss.com</Link>
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default OrderReceiptEmail;
