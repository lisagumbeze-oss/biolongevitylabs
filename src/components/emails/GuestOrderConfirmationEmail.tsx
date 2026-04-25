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
        <EmailLayout previewText={`Confirmation: Order ${orderId} - BioLongevity Labs`}>
            <HeroHeader 
                title="Requisition Initiated" 
                subtitle="Your laboratory order has been logged. Follow the protocol below to finalize the acquisition."
            />

            <Section className="bg-slate-950 border border-slate-800 border-solid rounded-2xl p-8 text-center mb-10 shadow-xl">
                <Text className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] m-0 mb-2">
                    Research Log ID
                </Text>
                <Text className="text-white text-[32px] font-black m-0 tracking-tight">
                    {orderId.replace('#', '')}
                </Text>
            </Section>

            <OrderTable items={items} total={total} />

            <InfoBlock title="Financial Protocol" iconColor="#137fec">
                <Text className="text-slate-600 text-[14px] leading-[24px] m-0">
                    A total value of <strong>${total.toFixed(2)}</strong> must be cleared via the specified gateway to trigger the logistics phase. 
                </Text>
                <div style={{ marginTop: '20px', padding: '24px', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                    <table className="w-full">
                        <tr>
                            <td className="py-2 border-b border-slate-100 border-solid">
                                <Text className="text-slate-400 text-[10px] font-black uppercase tracking-widest m-0 mb-1">Gateway</Text>
                                <Text className="text-slate-900 text-[14px] font-bold m-0">Zelle / Transfer</Text>
                            </td>
                        </tr>
                        <tr>
                            <td className="py-2 border-b border-slate-100 border-solid">
                                <Text className="text-slate-400 text-[10px] font-black uppercase tracking-widest m-0 mb-1">Target Account</Text>
                                <Text className="text-primary text-[14px] font-black m-0">payments@biolongevitylabss.com</Text>
                            </td>
                        </tr>
                        <tr>
                            <td className="py-2">
                                <Text className="text-slate-400 text-[10px] font-black uppercase tracking-widest m-0 mb-1">Required Memo</Text>
                                <Text className="text-slate-900 text-[14px] font-black m-0">ID {orderId.replace('#', '')}</Text>
                            </td>
                        </tr>
                    </table>
                </div>
            </InfoBlock>

            <Section className="text-center mt-10">
                <Text className="text-slate-400 text-[12px] m-0 font-medium italic">
                    BioLongevity Labs • Automated Logistics System // Operational Status: PENDING
                </Text>
            </Section>
        </EmailLayout>
    );
};

export default GuestOrderConfirmationEmail;
