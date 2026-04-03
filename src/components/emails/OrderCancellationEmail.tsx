import React from 'react';
import { Section, Text, Link } from '@react-email/components';
import EmailLayout from './shared/EmailLayout';
import { HeroHeader, InfoBlock } from './shared/EmailComponents';

interface OrderCancellationProps {
    orderId: string;
}

export const OrderCancellationEmail = ({ orderId = "1234" }: OrderCancellationProps) => {
    const displayOrderId = orderId.startsWith('#') ? orderId : `#${orderId}`;

    return (
        <EmailLayout previewText={`Order Canceled - BioLongevity Labs ${displayOrderId}`}>
            <Section className="text-center mb-8">
                <div style={{ 
                    width: '80px', 
                    height: '80px', 
                    backgroundColor: '#fee2e2', 
                    borderRadius: '50%', 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    margin: '0 auto 20px auto'
                }}>
                    <div style={{ color: '#dc2626', fontSize: '40px' }}>✕</div>
                </div>
                <HeroHeader 
                    title="Order Canceled" 
                    subtitle={`Your order ${displayOrderId} has been canceled.`}
                />
            </Section>

            <InfoBlock title="Reason for Cancellation" iconColor="#dc2626">
                Payment was not received within the required 24-hour timeframe. As a guest checkout, unpaid orders are automatically released. 
                If you believe this is an error or would like to reactivate your order, please contact our support team.
            </InfoBlock>

            <Section className="text-center mt-10">
                <Text className="text-slate-500 text-[14px] mb-6">
                    Would you like to try again or need assistance?
                </Text>
                <div className="flex justify-center gap-4">
                    <Link 
                        href="https://biolongevitylabss.com/shop"
                        className="bg-primary text-white font-bold py-3 px-8 rounded-xl mx-2"
                        style={{ display: 'inline-block', textDecoration: 'none' }}
                    >
                        Shop Again
                    </Link>
                    <Link 
                        href="mailto:support@biolongevitylabss.com"
                        className="bg-slate-200 text-slate-900 font-bold py-3 px-8 rounded-xl mx-2"
                        style={{ display: 'inline-block', textDecoration: 'none' }}
                    >
                        Contact Support
                    </Link>
                </div>
            </Section>

            <Text className="text-slate-400 text-[13px] text-center italic mt-12">
                Order ID: {displayOrderId} • BioLongevity Labs
            </Text>
        </EmailLayout>
    );
};

export default OrderCancellationEmail;
