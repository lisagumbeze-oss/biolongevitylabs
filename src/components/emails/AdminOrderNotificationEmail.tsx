import React from 'react';
import { Text, Heading, Section, Row, Column } from '@react-email/components';
import EmailLayout from './shared/EmailLayout';
import { OrderTable, InfoBlock } from './shared/EmailComponents';

interface AdminOrderNotificationEmailProps {
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
    shippingAddress: {
        addressLine1: string;
        addressLine2?: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
}

export const AdminOrderNotificationEmail = ({
    orderId = '#ORD-123456',
    customerName = 'Jane Doe',
    customerEmail = 'jane@example.com',
    items = [
        { id: '1', name: 'BPC-157', price: 59.99, quantity: 2, variationString: '5mg Vial' }
    ],
    total = 119.98,
    paymentMethod = 'Venmo',
    shippingAddress = {
        addressLine1: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zipCode: '12345',
        country: 'USA'
    }
}: AdminOrderNotificationEmailProps) => {
    return (
        <EmailLayout previewText={`ALERT: New Order ${orderId} - $${total.toFixed(2)}`}>
            {/* Admin Header */}
            <Section className="mb-10">
                <Text className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em] m-0 mb-3">
                    Transaction Log: New Acquisition
                </Text>
                <Heading className="text-slate-900 text-[32px] font-black leading-[1.1] m-0 tracking-tight">
                    Order {orderId}
                </Heading>
                <Text className="text-slate-500 text-[14px] mt-2 font-medium">
                    New research order submitted via the global portal. Action required for logistics and payment verification.
                </Text>
            </Section>

            {/* Customer & Payment Info Grid */}
            <Section className="mb-8 p-1 bg-slate-950 border border-slate-800 border-solid rounded-2xl overflow-hidden shadow-xl">
                <table className="w-full border-collapse">
                    <tbody>
                        <tr>
                            <td className="p-6 border-b border-slate-800 border-solid" style={{ width: '50%' }}>
                                <Text className="text-slate-500 text-[10px] font-black uppercase tracking-widest m-0 mb-1">Researcher Identification</Text>
                                <Text className="text-white text-[16px] font-bold m-0">{customerName}</Text>
                                <Text className="text-primary text-[14px] font-bold m-0">{customerEmail}</Text>
                            </td>
                            <td className="p-6 border-b border-slate-800 border-solid border-l" style={{ width: '50%' }}>
                                <Text className="text-slate-500 text-[10px] font-black uppercase tracking-widest m-0 mb-1">Financial Protocol</Text>
                                <Text className="text-white text-[16px] font-bold m-0 uppercase tracking-wide">{paymentMethod}</Text>
                                <Text className="text-emerald-500 text-[12px] font-black m-0 uppercase mt-1">Pending Verification</Text>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </Section>

            <OrderTable items={items} total={total} />

            <InfoBlock title="Logistics Destination" iconColor="#137fec">
                <div className="bg-white p-4 rounded-xl border border-slate-200 border-solid shadow-sm">
                    <Text className="text-slate-900 text-[15px] font-bold m-0 mb-1">{customerName}</Text>
                    <Text className="text-slate-600 text-[14px] leading-[22px] m-0">
                        {shippingAddress.addressLine1}
                        {shippingAddress.addressLine2 && <><br />{shippingAddress.addressLine2}</>}
                        <br />
                        {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}
                        <br />
                        <span className="font-black text-slate-900 uppercase tracking-widest text-[11px]">{shippingAddress.country}</span>
                    </Text>
                </div>
            </InfoBlock>

            <Section className="mt-10 p-6 bg-slate-50 border border-slate-200 border-solid rounded-2xl">
                <Text className="text-slate-500 text-[12px] m-0 font-medium leading-[20px]">
                    <strong>Next Steps:</strong> Please cross-reference the transfer in the financial dashboard. Once verified, update the order status to "Processing" to trigger laboratory selection.
                </Text>
            </Section>

            <Text className="text-slate-400 text-[11px] text-center mt-12 font-mono">
                SECURE TRANSMISSION // ID: {orderId.replace('#', '')} // PORTAL: ADMIN-V1
            </Text>
        </EmailLayout>
    );
};

export default AdminOrderNotificationEmail;
