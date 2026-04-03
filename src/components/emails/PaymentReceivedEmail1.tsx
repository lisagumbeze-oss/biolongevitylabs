import React from 'react';
import { Text, Section, Heading } from '@react-email/components';
import EmailLayout from './shared/EmailLayout';
import { HeroHeader, InfoBlock } from './shared/EmailComponents';

interface PaymentReceivedProps {
    orderId: string;
}

export const PaymentReceivedEmail1 = ({ orderId = "1234" }: PaymentReceivedProps) => {
    const displayOrderId = orderId.startsWith('#') ? orderId : `#${orderId}`;
    
    return (
        <EmailLayout previewText={`Payment Received for Order ${displayOrderId}`}>
            <Section className="text-center mb-8">
                <div style={{ 
                    width: '80px', 
                    height: '80px', 
                    backgroundColor: '#f0fdf4', 
                    borderRadius: '50%', 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    margin: '0 auto 20px auto'
                }}>
                    <div style={{ color: '#16a34a', fontSize: '40px' }}>✓</div>
                </div>
                <HeroHeader 
                    title="Payment Received!" 
                    subtitle={`We've successfully verified your payment for order ${displayOrderId}.`}
                />
            </Section>

            <Section className="bg-slate-50 border border-slate-200 border-solid rounded-2xl p-8 mb-8 text-center">
                <Text className="text-slate-500 text-[12px] font-black uppercase tracking-widest m-0 mb-2">
                    Current Status
                </Text>
                <Text className="text-primary text-[24px] font-black m-0">
                    Preparing for Shipment
                </Text>
                <Text className="text-slate-500 text-[14px] mt-4 m-0">
                    Your order is now being processed at our warehouse. You will receive another notification with tracking details as soon as it ships.
                </Text>
            </Section>

            <InfoBlock title="Next Steps">
                1. Our team will perform a final quality check on your items.<br />
                2. Your package will be securely prepared for transport.<br />
                3. A tracking number will be sent to this email address within 24-48 hours.
            </InfoBlock>

            <Text className="text-slate-400 text-[13px] text-center italic mt-10">
                Order ID: {displayOrderId} • BioLongevity Labs Official
            </Text>
        </EmailLayout>
    );
};

export default PaymentReceivedEmail1;
