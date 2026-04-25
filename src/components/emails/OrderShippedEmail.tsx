import React from 'react';
import { Text, Section, Link } from '@react-email/components';
import EmailLayout from './shared/EmailLayout';
import { HeroHeader, InfoBlock } from './shared/EmailComponents';

interface OrderShippedEmailProps {
    orderId: string;
    customerName: string;
    trackingNumber?: string;
    trackingUrl?: string;
}

export const OrderShippedEmail = ({
    orderId = '#ORD-123456',
    customerName = 'Jane Doe',
    trackingNumber = '1Z999AA10123456784',
    trackingUrl = 'https://www.ups.com'
}: OrderShippedEmailProps) => {
    return (
        <EmailLayout previewText={`Deployment Active: Order ${orderId} has shipped`}>
            <HeroHeader 
                title="Logistics Active" 
                subtitle={`Hi ${customerName}, your acquisition ${orderId} has cleared laboratory inspection and is now in transit.`}
            />

            <Section className="mb-8 overflow-hidden bg-slate-900 border border-slate-800 border-solid rounded-2xl shadow-xl">
                <div className="bg-emerald-500 px-6 py-2">
                    <Text className="text-white text-[10px] font-black uppercase tracking-[0.2em] m-0">
                        Transit Protocol Enabled
                    </Text>
                </div>
                <div className="p-8 text-center">
                    <Text className="text-white text-[16px] font-medium m-0 mb-6">
                        Your package has been dispatched via secure courier.
                    </Text>
                    
                    {trackingNumber && (
                        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 border-solid">
                            <Text className="text-slate-400 text-[10px] font-black uppercase tracking-widest m-0 mb-2">
                                Tracking Identifier
                            </Text>
                            <Text className="text-emerald-400 text-[20px] font-mono font-bold m-0 mb-6 tracking-tight">
                                {trackingNumber}
                            </Text>
                            <Link 
                                href={trackingUrl}
                                className="inline-block bg-primary text-white font-black px-10 py-4 rounded-xl text-[12px] uppercase tracking-widest no-underline shadow-lg shadow-primary/20 hover:scale-105 transition-all"
                            >
                                Track Acquisition
                            </Link>
                        </div>
                    )}
                </div>
            </Section>

            <InfoBlock title="Research Integrity" iconColor="#137fec">
                <Text className="text-slate-600 text-[14px] leading-[24px] m-0">
                    Upon arrival, please verify the integrity of all laboratory seals. Ensure compounds are stored in a temperature-controlled environment as specified in the research protocol documents. 
                    <br /><br />
                    Technical support for research inquiries is available at <strong>support@biolongevitylabss.com</strong>.
                </Text>
            </InfoBlock>

            <Section className="text-center mt-10">
                <Text className="text-slate-400 text-[12px] m-0 font-medium italic">
                    BioLongevity Labs • Logistics Division // Global Distribution Network
                </Text>
            </Section>
        </EmailLayout>
    );
};

export default OrderShippedEmail;
