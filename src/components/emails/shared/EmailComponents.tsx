import React from 'react';
import { Button, Column, Img, Row, Section, Text } from '@react-email/components';
import { CRYPTO_DISCOUNT_PERCENT, CRYPTO_WALLETS } from '@/config/payments';
import type { CryptoQuote } from '@/lib/crypto-quotes';
import { SITE_URL } from '@/lib/site';
import { EMAIL_BRAND, EMAIL_CANVAS, EMAIL_INK, EMAIL_LINE, EMAIL_MUTED } from './EmailLayout';

export interface EmailAction {
    href: string;
    label: string;
}

export interface OrderEmailItem {
    id?: string;
    name: string;
    price: number;
    quantity: number;
    variationString?: string;
}

const labelStyle = {
    color: EMAIL_MUTED,
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
    margin: '0 0 4px',
};

const valueStyle = {
    color: EMAIL_INK,
    fontSize: '15px',
    fontWeight: 600,
    lineHeight: '22px',
    margin: 0,
};

export const EmailHeading = ({
    eyebrow,
    title,
    subtitle,
}: {
    eyebrow?: string;
    title: string;
    subtitle?: string;
}) => (
    <Section style={{ marginBottom: '24px' }}>
        {eyebrow && (
            <Text style={{ ...labelStyle, color: EMAIL_BRAND, margin: '0 0 8px' }}>{eyebrow}</Text>
        )}
        <Text style={{ color: EMAIL_INK, fontSize: '28px', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: '34px', margin: 0 }}>
            {title}
        </Text>
        {subtitle && (
            <Text style={{ color: EMAIL_MUTED, fontSize: '15px', lineHeight: '24px', margin: '10px 0 0' }}>
                {subtitle}
            </Text>
        )}
    </Section>
);

export const EmailParagraph = ({ children }: { children: React.ReactNode }) => (
    <Text style={{ color: '#334155', fontSize: '15px', lineHeight: '24px', margin: '0 0 20px' }}>
        {children}
    </Text>
);

export const EmailActions = ({
    primary,
    secondary,
}: {
    primary?: EmailAction;
    secondary?: EmailAction;
}) => {
    if (!primary && !secondary) return null;
    return (
        <Section style={{ margin: '28px 0 8px' }}>
            {primary && (
                <Button
                    href={primary.href}
                    style={{
                        backgroundColor: EMAIL_BRAND,
                        color: '#ffffff',
                        fontSize: '15px',
                        fontWeight: 600,
                        textDecoration: 'none',
                        textAlign: 'center',
                        display: 'inline-block',
                        padding: '12px 20px',
                        borderRadius: '8px',
                        marginRight: secondary ? '10px' : 0,
                        marginBottom: '10px',
                    }}
                >
                    {primary.label}
                </Button>
            )}
            {secondary && (
                <Button
                    href={secondary.href}
                    style={{
                        backgroundColor: '#ffffff',
                        color: EMAIL_INK,
                        fontSize: '15px',
                        fontWeight: 600,
                        textDecoration: 'none',
                        textAlign: 'center',
                        display: 'inline-block',
                        padding: '11px 18px',
                        borderRadius: '8px',
                        border: `1px solid ${EMAIL_LINE}`,
                        marginBottom: '10px',
                    }}
                >
                    {secondary.label}
                </Button>
            )}
        </Section>
    );
};

export const DetailList = ({ rows }: { rows: { label: string; value: string }[] }) => (
    <Section style={{ border: `1px solid ${EMAIL_LINE}`, borderRadius: '10px', margin: '0 0 20px' }}>
        {rows.map((row, index) => (
            <Row key={row.label} style={{ borderTop: index === 0 ? 'none' : `1px solid ${EMAIL_LINE}` }}>
                <Column style={{ padding: '14px 16px', width: '34%', verticalAlign: 'top' }}>
                    <Text style={{ ...labelStyle, margin: 0 }}>{row.label}</Text>
                </Column>
                <Column style={{ padding: '14px 16px', verticalAlign: 'top' }}>
                    <Text style={{ ...valueStyle, fontWeight: 500, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                        {row.value}
                    </Text>
                </Column>
            </Row>
        ))}
    </Section>
);

export const OrderTable = ({ items, total }: { items: OrderEmailItem[]; total: number }) => (
    <Section style={{ border: `1px solid ${EMAIL_LINE}`, borderRadius: '10px', margin: '0 0 20px' }}>
        <Row style={{ backgroundColor: EMAIL_CANVAS }}>
            <Column style={{ padding: '10px 16px' }}>
                <Text style={{ ...labelStyle, margin: 0 }}>Item</Text>
            </Column>
            <Column style={{ padding: '10px 8px', width: '64px' }}>
                <Text style={{ ...labelStyle, margin: 0, textAlign: 'right' }}>Qty</Text>
            </Column>
            <Column style={{ padding: '10px 16px', width: '96px' }}>
                <Text style={{ ...labelStyle, margin: 0, textAlign: 'right' }}>Amount</Text>
            </Column>
        </Row>
        {items.map((item, index) => (
            <Row key={`${item.name}-${index}`} style={{ borderTop: `1px solid ${EMAIL_LINE}` }}>
                <Column style={{ padding: '14px 16px', verticalAlign: 'top' }}>
                    <Text style={{ ...valueStyle, fontSize: '14px' }}>{item.name}</Text>
                    {item.variationString && (
                        <Text style={{ color: EMAIL_MUTED, fontSize: '12px', margin: '4px 0 0' }}>{item.variationString}</Text>
                    )}
                </Column>
                <Column style={{ padding: '14px 8px', width: '64px', verticalAlign: 'top' }}>
                    <Text style={{ ...valueStyle, fontSize: '14px', textAlign: 'right', fontWeight: 500 }}>{item.quantity}</Text>
                </Column>
                <Column style={{ padding: '14px 16px', width: '96px', verticalAlign: 'top' }}>
                    <Text style={{ ...valueStyle, fontSize: '14px', textAlign: 'right' }}>
                        ${(item.price * item.quantity).toFixed(2)}
                    </Text>
                </Column>
            </Row>
        ))}
        <Row style={{ borderTop: `1px solid ${EMAIL_LINE}`, backgroundColor: EMAIL_CANVAS }}>
            <Column style={{ padding: '14px 16px' }}>
                <Text style={{ ...valueStyle, margin: 0 }}>Total due</Text>
            </Column>
            <Column />
            <Column style={{ padding: '14px 16px', width: '96px' }}>
                <Text style={{ color: EMAIL_INK, fontSize: '18px', fontWeight: 700, textAlign: 'right', margin: 0 }}>
                    ${total.toFixed(2)}
                </Text>
            </Column>
        </Row>
    </Section>
);

export const CryptoWalletList = ({
    quotes,
    total,
}: {
    quotes?: CryptoQuote[];
    total: number;
}) => (
    <Section style={{ margin: '0 0 20px' }}>
        <Text style={{ color: '#047857', fontSize: '14px', fontWeight: 600, lineHeight: '22px', margin: '0 0 12px' }}>
            A {CRYPTO_DISCOUNT_PERCENT}% cryptocurrency discount is included in the ${total.toFixed(2)} total. Send one of the amounts below.
        </Text>
        {CRYPTO_WALLETS.map((wallet) => {
            const quote = quotes?.find((item) => item.id === wallet.id);
            return (
                <Section key={wallet.id} style={{ border: `1px solid ${EMAIL_LINE}`, borderRadius: '10px', padding: '16px', marginBottom: '12px' }}>
                    <Text style={{ ...labelStyle, margin: '0 0 6px' }}>{wallet.name} ({wallet.symbol})</Text>
                    {quote && (
                        <Text style={{ color: EMAIL_INK, fontSize: '18px', fontWeight: 700, margin: '0 0 12px' }}>
                            Send exactly {quote.amount} {wallet.symbol}
                        </Text>
                    )}
                    {wallet.qrSrc && (
                        <Img
                            src={`${SITE_URL}${wallet.qrSrc}`}
                            alt={`${wallet.name} wallet QR code`}
                            width="140"
                            height="140"
                            style={{ borderRadius: '8px', margin: '0 0 12px' }}
                        />
                    )}
                    <Text style={{ ...labelStyle, margin: '0 0 4px' }}>Wallet address</Text>
                    <Text style={{ color: EMAIL_INK, fontSize: '13px', lineHeight: '20px', fontFamily: 'Consolas, Monaco, monospace', margin: 0, wordBreak: 'break-all' }}>
                        {wallet.address}
                    </Text>
                </Section>
            );
        })}
    </Section>
);

/** Kept so older templates can still import a titled block. */
export const InfoBlock = ({ title, children }: { title: string; children: React.ReactNode; iconColor?: string }) => (
    <Section style={{ border: `1px solid ${EMAIL_LINE}`, borderRadius: '10px', padding: '16px 18px', margin: '0 0 20px' }}>
        <Text style={{ ...labelStyle, color: EMAIL_BRAND, margin: '0 0 8px' }}>{title}</Text>
        {children}
    </Section>
);

export const HeroHeader = EmailHeading;
