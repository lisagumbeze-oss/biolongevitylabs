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
        <EmailLayout previewText={`Validated: Payment Received for Order ${displayOrderId}`}>
            <Section className="text-center mb-10">
                <div style={{ 
                    width: '64px', 
                    height: '64px', 
                    backgroundColor: '#10b981', 
                    borderRadius: '20px', 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    margin: '0 auto 24px auto',
                    boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.3)'
                }}>
                    <Text className="text-white text-[32px] font-bold m-0">✓</Text>
                </div>
                <HeroHeader 
                    title="Transfer Validated" 
                    subtitle={`Verification of financial transfer for order ${displayOrderId} is complete.`}
                />
            </Section>

            <Section className="bg-slate-950 border border-slate-800 border-solid rounded-2xl overflow-hidden shadow-2xl mb-10">
                <div className="bg-emerald-500 px-6 py-2">
                    <Text className="text-white text-[10px] font-black uppercase tracking-[0.2em] m-0">
                        Operational Phase: Logistics
                    </Text>
                </div>
                <div className="p-8 text-center">
                    <Text className="text-white text-[24px] font-black m-0 tracking-tight uppercase">
                        Preparing for Shipment
                    </Text>
                    <Text className="text-slate-400 text-[14px] mt-4 m-0 leading-[24px]">
                        Your research materials are now being transitioned to the logistics queue. Final inspection and packaging are underway.
                    </Text>
                </div>
            </Section>

            <InfoBlock title="Logistics Timeline" iconColor="#10b981">
                <Text className="text-slate-600 text-[14px] leading-[24px] m-0">
                    • <strong>Phase 1:</strong> Final laboratory quality assurance check.<br />
                    • <strong>Phase 2:</strong> Secure deployment preparation.<br />
                    • <strong>Phase 3:</strong> Generation of tracking identifiers (Estimated: 24-48h).
                </Text>
            </InfoBlock>

            <Section className="text-center mt-10">
                <Text className="text-slate-400 text-[11px] font-mono m-0">
                    TRANSACTION_HASH: {Math.random().toString(36).substring(2, 15).toUpperCase()} // VALIDATED
                </Text>
            </Section>
        </EmailLayout>
    );
};

export default PaymentReceivedEmail1;
