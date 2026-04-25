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
        <EmailLayout previewText={`DEACTIVATED: Order ${displayOrderId} Canceled`}>
            <Section className="text-center mb-10">
                <div style={{ 
                    width: '64px', 
                    height: '64px', 
                    backgroundColor: '#ef4444', 
                    borderRadius: '20px', 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    margin: '0 auto 24px auto',
                    boxShadow: '0 10px 15px -3px rgba(239, 68, 68, 0.3)'
                }}>
                    <Text className="text-white text-[32px] font-bold m-0">✕</Text>
                </div>
                <HeroHeader 
                    title="Protocol Deactivated" 
                    subtitle={`Laboratory requisition ${displayOrderId} has been formally canceled.`}
                />
            </Section>

            <InfoBlock title="Cancellation Report" iconColor="#ef4444">
                <div className="bg-white p-6 rounded-xl border border-red-100 border-solid shadow-sm">
                    <Text className="text-slate-600 text-[14px] leading-[24px] m-0">
                        Financial clearance was not received within the 24-hour verification window. In accordance with laboratory procurement protocols, unpaid orders are automatically purged to release research inventory.
                        <br /><br />
                        If this deactivation was unexpected, please initiate a new requisition or contact the support division.
                    </Text>
                </div>
            </InfoBlock>

            <Section className="text-center mt-10">
                <Text className="text-slate-500 text-[13px] mb-8 font-medium">
                    Select a resolution pathway below:
                </Text>
                <table className="mx-auto">
                    <tr>
                        <td>
                            <Link 
                                href="https://biolongevitylabss.com/shop"
                                className="bg-slate-900 text-white font-black py-4 px-10 rounded-xl text-[12px] uppercase tracking-widest no-underline shadow-lg shadow-slate-900/20 hover:scale-105 transition-all mx-2"
                                style={{ display: 'inline-block' }}
                            >
                                Shop Again
                            </Link>
                        </td>
                        <td>
                            <Link 
                                href="mailto:support@biolongevitylabss.com"
                                className="bg-slate-100 text-slate-900 font-black py-4 px-10 rounded-xl text-[12px] uppercase tracking-widest no-underline border border-slate-200 border-solid mx-2"
                                style={{ display: 'inline-block' }}
                            >
                                Contact Support
                            </Link>
                        </td>
                    </tr>
                </table>
            </Section>

            <Text className="text-slate-400 text-[11px] text-center mt-12 font-mono">
                STATUS: DEACTIVATED // LOG_REF: {displayOrderId.replace('#', '')}
            </Text>
        </EmailLayout>
    );
};

export default OrderCancellationEmail;
