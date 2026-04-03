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
export const OrderTable = ({ items, total }: { items: any[], total: number }) => (
    <Section className="my-8 bg-slate-50 border border-slate-200 border-solid rounded-2xl p-6">
        <Heading as="h3" className="text-slate-900 text-[14px] font-black uppercase tracking-wider mb-6 mt-0">
            Order Items
        </Heading>

        {items.map((item, index) => (
            <React.Fragment key={index}>
                <Row className="mb-4">
                    <Column className="w-[70%]">
                        <Text className="text-slate-900 text-[14px] font-bold m-0 leading-[20px]">
                            {item.name}
                        </Text>
                        {item.variationString && (
                            <Text className="text-slate-500 text-[12px] m-0 mt-1 italic">
                                {item.variationString}
                            </Text>
                        )}
                    </Column>
                    <Column className="w-[10%] text-center align-top">
                        <Text className="text-slate-500 text-[13px] m-0 pt-[2px]">x{item.quantity}</Text>
                    </Column>
                    <Column className="w-[20%] text-right align-top">
                        <Text className="text-slate-900 text-[14px] font-black m-0 pt-[2px] text-right">
                            ${(item.price * item.quantity).toFixed(2)}
                        </Text>
                    </Column>
                </Row>
            </React.Fragment>
        ))}

        <Hr className="border-slate-200 my-6" />

        <Row>
            <Column className="w-[70%]">
                <Text className="text-slate-900 text-[16px] font-black m-0">Total Amount</Text>
            </Column>
            <Column className="w-[30%] text-right">
                <Text className="text-primary text-[20px] font-black m-0 text-right">
                    ${total.toFixed(2)}
                </Text>
            </Column>
        </Row>
    </Section>
);

/**
 * Branded Info Block (for Address, Payment info, etc.)
 */
export const InfoBlock = ({ title, children, iconColor = '#137fec' }: { title: string, children: React.ReactNode, iconColor?: string }) => (
    <Section className="mb-8 p-6 border border-slate-200 border-solid rounded-2xl">
        <Heading as="h4" style={{ color: iconColor }} className="text-[14px] font-black uppercase tracking-wider mt-0 mb-3">
            {title}
        </Heading>
        <Text className="text-slate-700 text-[14px] leading-[22px] m-0">
            {children}
        </Text>
    </Section>
);

/**
 * Hero Header with welcome message
 */
export const HeroHeader = ({ title, subtitle }: { title: string, subtitle?: string }) => (
    <Section className="text-center mb-10">
        <Heading className="text-slate-900 text-[28px] font-black leading-[36px] m-0 mb-3">
            {title}
        </Heading>
        {subtitle && (
            <Text className="text-slate-500 text-[16px] leading-[24px] m-0">
                {subtitle}
            </Text>
        )}
    </Section>
);
