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
    backgroundColor: '#f8fafc',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
    margin: '40px auto',
    width: '600px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
};

const footerContainer = {
    width: '600px',
    margin: '0 auto',
};

const footer = {
    color: '#64748b',
    fontSize: '12px',
    lineHeight: '20px',
    textAlign: 'center' as const,
    padding: '40px 10px',
};

const logoText = {
    fontSize: '24px',
    fontWeight: '900',
    letterSpacing: '-0.5px',
    color: '#0f172a',
    margin: '0',
    textTransform: 'uppercase' as const,
};

const accentText = {
    color: '#137fec',
    fontStyle: 'italic',
};

export const EmailLayout = ({ previewText, children }: EmailLayoutProps) => {
    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Tailwind>
                <Body style={main} className="bg-slate-50 my-auto mx-auto font-sans px-2">
                    <Container style={container} className="bg-white border border-slate-200 border-solid rounded-2xl mx-auto my-10 overflow-hidden shadow-sm">
                        {/* Header Banner */}
                        <Section className="bg-slate-900 p-8 text-center border-b-[4px] border-solid border-primary">
                            <Text style={logoText} className="text-white">
                                BioLongevity <span style={accentText}>Labs</span>
                            </Text>
                        </Section>

                        {/* Content */}
                        <Section className="p-8">
                            {children}
                        </Section>

                        <Hr className="border-slate-200" />
                        
                        {/* Secondary Brand Bar */}
                        <Section className="bg-slate-50 p-4 text-center">
                            <Text className="text-slate-500 text-[12px] font-bold tracking-widest uppercase m-0">
                                Premium Peptide Research
                            </Text>
                        </Section>
                    </Container>

                    {/* Outer Footer */}
                    <Container style={footerContainer}>
                        <Section style={footer}>
                            <Text className="m-0">
                                BioLongevity Labs Headquarters<br />
                                F2 Nutrition Inc. 405 Rothrock Rd #106 Akron, OH 44321
                            </Text>
                            <Section className="mt-4">
                                <Link href="https://biolongevitylabss.com" className="text-primary font-bold mx-2">Website</Link>
                                <span className="text-slate-300">|</span>
                                <Link href="mailto:support@biolongevitylabss.com" className="text-primary font-bold mx-2">Support</Link>
                            </Section>
                            <Text className="text-slate-400 mt-6 text-[11px]">
                                © {new Date().getFullYear()} BioLongevity Labs. All rights reserved. <br />
                                This email was sent to you because you interacted with BioLongevity Labs.
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default EmailLayout;
