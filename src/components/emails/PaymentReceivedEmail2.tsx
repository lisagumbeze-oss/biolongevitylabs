import React from 'react';
import { Text, Section, Link } from '@react-email/components';
import EmailLayout from './shared/EmailLayout';
import { HeroHeader, InfoBlock } from './shared/EmailComponents';

export const PaymentReceivedEmail2 = () => {
    // Mock data for reminder preview
    const orderId = '#ORD-1234';
    
    return (
        <EmailLayout previewText={`Reminder: Payment Pending for Order ${orderId}`}>
            <Section className="text-center mb-8">
                <div style={{ 
                    width: '80px', 
                    height: '80px', 
                    backgroundColor: '#fffbeb', 
                    borderRadius: '50%', 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    margin: '0 auto 20px auto'
                }}>
                    <div style={{ color: '#d97706', fontSize: '40px' }}>⏳</div>
                </div>
                <HeroHeader 
                    title="Payment Still Pending" 
                    subtitle={`We're holding your order ${orderId}, but we haven't received your payment yet.`}
                />
            </Section>

            <Section className="bg-amber-50 border border-amber-200 border-solid rounded-2xl p-8 mb-8">
                <Text className="text-amber-900 text-[14px] leading-[22px] m-0">
                    Your order is currently reserved, but requires payment to proceed to shipping. If you have already sent the payment, please reply to this email with a screenshot of your receipt so we can expedite the verification.
                </Text>
            </Section>

            <InfoBlock title="Payment Instructions" iconColor="#d97706">
                <div style={{ padding: '16px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #fcd34d' }}>
                    <Text className="m-0 text-[13px]"><span className="text-slate-500">Zelle Email:</span> <strong>payments@biolongevitylabss.com</strong></Text>
                    <Text className="m-0 mt-1 text-[13px]"><span className="text-slate-500">Account Name:</span> <strong>BioLongevity Labs</strong></Text>
                    <Text className="m-0 mt-1 text-[13px]"><span className="text-slate-500">Required Memo:</span> <strong>Order ID {orderId}</strong></Text>
                </div>
            </InfoBlock>

            <Section className="text-center mt-10">
                <Text className="text-slate-500 text-[14px] mb-6">
                    Need help with your payment? Our team is here to assist you.
                </Text>
                <Link 
                    href="mailto:support@biolongevitylabss.com"
                    className="bg-primary text-white font-bold py-3 px-8 rounded-xl"
                    style={{ display: 'inline-block', textDecoration: 'none' }}
                >
                    Contact Support
                </Link>
            </Section>
        </EmailLayout>
    );
};

export default PaymentReceivedEmail2;
