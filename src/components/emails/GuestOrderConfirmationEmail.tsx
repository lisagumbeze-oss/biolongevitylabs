import React from 'react';
import { Text, Section } from '@react-email/components';
import EmailLayout from './shared/EmailLayout';
import { OrderTable, InfoBlock, HeroHeader } from './shared/EmailComponents';

export const GuestOrderConfirmationEmail = () => {
    // Mock data for the static preview
    const orderId = '#ORD-987654321';
    const total = 303.98;
    const items = [
        { id: '1', name: 'Premium Wireless Headphones', price: 199.00, quantity: 1, variationString: 'Black Edition' },
        { id: '2', name: 'Ergonomic Mouse', price: 44.99, quantity: 2, variationString: 'Wireless' },
        { id: '3', name: 'Standard Shipping', price: 15.00, quantity: 1 }
    ];

    return (
        <EmailLayout previewText="Thank you for your order! - BioLongevity Labs">
            <HeroHeader 
                title="Your order is confirmed!" 
                subtitle="We've received your order. Please find your details and payment instructions below."
            />

            <Section className="bg-primary/5 border border-primary/20 border-solid rounded-2xl p-6 text-center mb-8">
                <Text className="text-slate-500 text-[12px] font-black uppercase tracking-wider m-0 mb-1">
                    Order ID
                </Text>
                <Text className="text-primary text-[32px] font-black m-0 tracking-tight">
                    {orderId}
                </Text>
            </Section>

            <OrderTable items={items} total={total} />

            <InfoBlock title="Payment Instructions">
                <Text className="font-bold text-slate-900 mb-2">Manual Bank Transfer / Zelle</Text>
                Please transfer the total amount of <strong>${total.toFixed(2)}</strong> to the following account. 
                Your order will be shipped once payment is confirmed.
                <div style={{ marginTop: '16px', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <Text className="m-0 text-[13px]"><span className="text-slate-500">Zelle:</span> <strong>payments@biolongevitylabss.com</strong></Text>
                    <Text className="m-0 mt-1 text-[13px]"><span className="text-slate-500">Account:</span> <strong>BioLongevity Labs</strong></Text>
                    <Text className="m-0 mt-1 text-[13px]"><span className="text-slate-500">Memo:</span> <strong>Order ID {orderId}</strong></Text>
                </div>
            </InfoBlock>

            <Text className="text-slate-500 text-[14px] leading-[24px] text-center italic">
                Thank you for choosing BioLongevity Labs for your research needs.
            </Text>
        </EmailLayout>
    );
};

export default GuestOrderConfirmationEmail;
