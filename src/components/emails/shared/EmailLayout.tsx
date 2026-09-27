import React from 'react';
import {
    Html,
    Body,
    Head,
    Container,
    Preview,
    Section,
    Text,
    Link,
    Hr,
} from '@react-email/components';
import { SITE_URL } from '@/lib/site';

export const EMAIL_BRAND = '#137fec';
export const EMAIL_INK = '#0f172a';
export const EMAIL_MUTED = '#64748b';
export const EMAIL_LINE = '#e2e8f0';
export const EMAIL_CANVAS = '#f8fafc';
export const EMAIL_SUPPORT = 'support@biolongevitylabss.com';

interface EmailLayoutProps {
    previewText: string;
    children: React.ReactNode;
}

const font = '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif';

export const EmailLayout = ({ previewText, children }: EmailLayoutProps) => {
    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Body style={{ backgroundColor: '#f1f5f9', margin: 0, padding: '24px 12px', fontFamily: font }}>
                <Container style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#ffffff', border: `1px solid ${EMAIL_LINE}`, borderRadius: '12px', overflow: 'hidden' }}>
                    <Section style={{ backgroundColor: '#0f172a', padding: '28px 32px' }}>
                        <Text style={{ color: '#ffffff', fontSize: '20px', fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>
                            BioLongevity Labs
                        </Text>
                        <Text style={{ color: '#94a3b8', fontSize: '13px', margin: '6px 0 0' }}>
                            Research peptides and bioregulators
                        </Text>
                    </Section>
                    <Section style={{ height: '3px', backgroundColor: EMAIL_BRAND, lineHeight: '3px', fontSize: '0' }}>
                        &nbsp;
                    </Section>
                    <Section style={{ padding: '32px' }}>
                        {children}
                    </Section>
                </Container>
                <Section style={{ maxWidth: '600px', margin: '0 auto', padding: '24px 8px 8px', textAlign: 'center' }}>
                    <Text style={{ color: EMAIL_MUTED, fontSize: '12px', lineHeight: '20px', margin: 0 }}>
                        BioLongevity Labs · F2 Nutrition Inc.
                        <br />
                        405 Rothrock Rd #106, Akron, OH 44321
                    </Text>
                    <Text style={{ margin: '12px 0 0', fontSize: '12px' }}>
                        <Link href={SITE_URL} style={{ color: EMAIL_INK, textDecoration: 'underline' }}>Website</Link>
                        <span style={{ color: '#cbd5e1' }}> · </span>
                        <Link href={`mailto:${EMAIL_SUPPORT}`} style={{ color: EMAIL_INK, textDecoration: 'underline' }}>Support</Link>
                    </Text>
                    <Hr style={{ borderColor: '#e2e8f0', margin: '16px 0' }} />
                    <Text style={{ color: '#94a3b8', fontSize: '11px', lineHeight: '18px', margin: 0 }}>
                        © {new Date().getFullYear()} BioLongevity Labs. Products are for laboratory research use only.
                    </Text>
                </Section>
            </Body>
        </Html>
    );
};

export default EmailLayout;
