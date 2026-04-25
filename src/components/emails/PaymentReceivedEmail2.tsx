import React from 'react';
import { Text, Section, Link } from '@react-email/components';
import EmailLayout from './shared/EmailLayout';
import { HeroHeader, InfoBlock } from './shared/EmailComponents';

export const PaymentReceivedEmail2 = () => {
    // Mock data for reminder preview
    const orderId = '#ORD-1234';
    
    return (
        <EmailLayout previewText={`ACTION REQUIRED: Payment Pending for Order ${orderId}`}>
            <Section className="text-center mb-10">
                <div style={{ 
                    width: '64px', 
                    height: '64px', 
                    backgroundColor: '#fbbf24', 
                    borderRadius: '20px', 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    margin: '0 auto 24px auto',
                    boxShadow: '0 10px 15px -3px rgba(251, 191, 36, 0.3)'
                }}>
                    <Text className="text-white text-[32px] font-bold m-0">!</Text>
                </div>
                <HeroHeader 
                    title="Transaction Incomplete" 
                    subtitle={`Laboratory requisition ${orderId} is currently held pending financial clearance.`}
                />
            </Section>

            <Section className="bg-amber-50 border border-amber-200 border-solid rounded-2xl p-8 mb-10 shadow-sm">
                <Text className="text-amber-900 text-[14px] leading-[24px] font-medium m-0">
                    Your research compounds have been reserved, but requires payment verification to proceed to the logistics phase. If you have already initiated the transfer, please provide a transmission receipt to expedite verification.
                </Text>
            </Section>

            <InfoBlock title="Financial Instructions" iconColor="#d97706">
                <div className="bg-white p-6 rounded-xl border border-amber-200 border-solid shadow-sm">
                    <table className="w-full">
                        <tr>
                            <td className="py-2 border-b border-slate-100 border-solid">
                                <Text className="text-slate-400 text-[10px] font-black uppercase tracking-widest m-0 mb-1">Transfer Gateway</Text>
                                <Text className="text-slate-900 text-[15px] font-bold m-0">Zelle / Bank Transfer</Text>
                            </td>
                        </tr>
                        <tr>
                            <td className="py-2 border-b border-slate-100 border-solid">
                                <Text className="text-slate-400 text-[10px] font-black uppercase tracking-widest m-0 mb-1">Protocol Address</Text>
                                <Text className="text-primary text-[15px] font-black m-0">payments@biolongevitylabss.com</Text>
                            </td>
                        </tr>
                        <tr>
                            <td className="py-2">
                                <Text className="text-slate-400 text-[10px] font-black uppercase tracking-widest m-0 mb-1">Required Reference</Text>
                                <Text className="text-slate-900 text-[15px] font-black m-0">ORDER {orderId.replace('#', '')}</Text>
                            </td>
                        </tr>
                    </table>
                </div>
            </InfoBlock>

            <Section className="text-center mt-10">
                <Text className="text-slate-500 text-[13px] mb-6 font-medium">
                    Encountering issues with the gateway? Our technical support team is standing by.
                </Text>
                <Link 
                    href="mailto:support@biolongevitylabss.com"
                    className="bg-primary text-white font-black py-4 px-10 rounded-xl text-[12px] uppercase tracking-widest no-underline shadow-lg shadow-primary/20 hover:scale-105 transition-all"
                    style={{ display: 'inline-block' }}
                >
                    Contact Support
                </Link>
            </Section>

            <Text className="text-slate-400 text-[11px] text-center mt-12 font-mono">
                STATUS: WAITING_FOR_PAYMENT // TTL: 48H
            </Text>
        </EmailLayout>
    );
};

export default PaymentReceivedEmail2;
