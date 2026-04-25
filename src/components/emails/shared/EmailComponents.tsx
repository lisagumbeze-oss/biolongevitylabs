import React from 'react';
import {
    Section,
    Text,
    Row,
    Column,
    Hr,
    Heading
} from '@react-email/components';

/**
 * Modern Order Item Table
 */
/**
 * Modern Order Item Table
 */
export const OrderTable = ({ items, total }: { items: any[], total: number }) => (
    <Section className="my-10 overflow-hidden border border-slate-200 border-solid rounded-2xl shadow-sm">
        <div className="bg-slate-950 px-6 py-3 border-b border-slate-800">
            <Text className="text-white text-[10px] font-black uppercase tracking-[0.2em] m-0">
                Manifest / Batch Contents
            </Text>
        </div>
        <div className="p-6">
            <table className="w-full">
                <tbody>
                    {items.map((item, index) => (
                        <tr key={index}>
                            <td className={`py-4 ${index !== items.length - 1 ? 'border-b border-slate-100 border-solid' : ''}`}>
                                <Text className="text-slate-900 text-[15px] font-bold m-0 leading-tight uppercase">
                                    {item.name}
                                </Text>
                                {item.variationString && (
                                    <Text className="text-primary text-[11px] font-black uppercase tracking-wider m-0 mt-1">
                                        Ref: {item.variationString}
                                    </Text>
                                )}
                            </td>
                            <td className={`py-4 text-center align-middle ${index !== items.length - 1 ? 'border-b border-slate-100 border-solid' : ''}`}>
                                <div className="inline-block bg-slate-100 px-3 py-1 rounded-lg">
                                    <Text className="text-slate-500 text-[12px] font-black m-0">QTY: {item.quantity}</Text>
                                </div>
                            </td>
                            <td className={`py-4 text-right align-middle ${index !== items.length - 1 ? 'border-b border-slate-100 border-solid' : ''}`}>
                                <Text className="text-slate-950 text-[15px] font-black m-0">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </Text>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="mt-6 pt-6 border-t-2 border-slate-100 border-solid">
                <Row>
                    <Column>
                        <Text className="text-slate-400 text-[12px] font-black uppercase tracking-widest m-0">Total Research Value</Text>
                    </Column>
                    <Column className="text-right">
                        <Text className="text-slate-950 text-[24px] font-black m-0">
                            ${total.toFixed(2)}
                        </Text>
                    </Column>
                </Row>
            </div>
        </div>
    </Section>
);

/**
 * Branded Info Block (for Address, Payment info, etc.)
 */
export const InfoBlock = ({ title, children, iconColor = '#137fec' }: { title: string, children: React.ReactNode, iconColor?: string }) => (
    <Section className="mb-8 overflow-hidden bg-slate-50 border border-slate-200 border-solid rounded-2xl">
        <div className="w-1 h-full absolute left-0 bg-primary" style={{ backgroundColor: iconColor }} />
        <div className="p-6">
            <Heading as="h4" style={{ color: iconColor }} className="text-[11px] font-black uppercase tracking-[0.2em] mt-0 mb-3">
                {title}
            </Heading>
            <div className="text-slate-700 text-[14px] leading-[22px]">
                {children}
            </div>
        </div>
    </Section>
);

/**
 * Hero Header with welcome message
 */
export const HeroHeader = ({ title, subtitle }: { title: string, subtitle?: string }) => (
    <Section className="text-center mb-12">
        <Text className="text-primary text-[10px] font-black uppercase tracking-[0.4em] m-0 mb-4">
            System Communication
        </Text>
        <Heading className="text-slate-950 text-[36px] font-black leading-[1.1] m-0 tracking-tight">
            {title}
        </Heading>
        {subtitle && (
            <Text className="text-slate-500 text-[16px] leading-[26px] mt-4 font-medium max-w-[400px] mx-auto">
                {subtitle}
            </Text>
        )}
    </Section>
);
