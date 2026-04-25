import React from 'react';
import {
    Html,
    Body,
    Head,
    Container,
    Preview,
    Section,
    Text,
    Tailwind,
    Hr,
    Link,
    Img,
    Row,
    Column
} from '@react-email/components';

interface EmailLayoutProps {
    previewText: string;
    children: React.ReactNode;
}

const main = {
    backgroundColor: '#f1f5f9',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
    margin: '40px auto',
    width: '600px',
    backgroundColor: '#ffffff',
    borderRadius: '24px',
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
};

const logoText = {
    fontSize: '28px',
    fontWeight: '900',
    letterSpacing: '-1px',
    color: '#ffffff',
    margin: '0',
    textTransform: 'uppercase' as const,
};

const accentText = {
    color: '#137fec',
    textShadow: '0 0 15px rgba(19, 127, 236, 0.4)',
};

export const EmailLayout = ({ previewText, children }: EmailLayoutProps) => {
    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Tailwind>
                <Body style={main} className="bg-slate-100 my-auto mx-auto font-sans px-2">
                    <Container style={container} className="bg-white border border-slate-200 border-solid rounded-[24px] mx-auto my-10 overflow-hidden shadow-2xl">
                        {/* High-End Header */}
                        <Section className="bg-slate-950 p-10 text-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(19,127,236,0.1),transparent)]" />
                            <Text style={logoText} className="relative z-10 m-0">
                                BioLongevity <span style={accentText}>Labs</span>
                            </Text>
                            <Text className="text-slate-500 text-[10px] font-black tracking-[0.2em] uppercase m-0 mt-2 relative z-10">
                                Advanced Peptide Research Systems
                            </Text>
                        </Section>

                        {/* Accent Bar */}
                        <Section className="h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />

                        {/* Content Body */}
                        <Section className="p-10">
                            {children}
                        </Section>

                        {/* Lab Footer Signature */}
                        <Section className="bg-slate-50 border-t border-slate-100 p-6 flex items-center justify-between">
                            <div className="flex flex-col">
                                <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest m-0">System Status</Text>
                                <Text className="text-[12px] font-bold text-emerald-500 m-0 flex items-center gap-1">
                                    ● OPERATIONAL
                                </Text>
                            </div>
                            <div className="text-right">
                                <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest m-0">Auth Token</Text>
                                <Text className="text-[12px] font-mono font-bold text-slate-900 m-0 uppercase">
                                    BL-{Math.random().toString(36).substring(7).toUpperCase()}
                                </Text>
                            </div>
                        </Section>
                    </Container>

                    {/* Clean Minimal Footer */}
                    <Section className="max-w-[600px] mx-auto text-center py-10 px-4">
                        <Text className="text-slate-500 text-[13px] leading-[22px] m-0">
                            <strong>BioLongevity Labs Headquarters</strong><br />
                            F2 Nutrition Inc. 405 Rothrock Rd #106 Akron, OH 44321
                        </Text>
                        <Section className="mt-6 flex justify-center items-center gap-4">
                            <Link href="https://biolongevitylabss.com" className="text-slate-900 font-black text-xs uppercase tracking-widest no-underline border-b-2 border-primary/20 hover:border-primary transition-all">Portal</Link>
                            <span className="text-slate-300">/</span>
                            <Link href="mailto:support@biolongevitylabss.com" className="text-slate-900 font-black text-xs uppercase tracking-widest no-underline border-b-2 border-primary/20 hover:border-primary transition-all">Support</Link>
                        </Section>
                        <Text className="text-slate-400 mt-8 text-[11px] font-medium">
                            © {new Date().getFullYear()} BioLongevity Labs. Laboratory grade research materials only.<br />
                            Confidential transmission intended for specified recipient.
                        </Text>
                    </Section>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default EmailLayout;
