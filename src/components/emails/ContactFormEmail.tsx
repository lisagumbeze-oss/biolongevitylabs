import React from 'react';
import { Section, Text, Heading, Row, Column } from '@react-email/components';
import EmailLayout from './shared/EmailLayout';

interface ContactFormEmailProps {
    name: string;
    email: string;
    phone?: string;
    message: string;
}

export const ContactFormEmail = ({
    name = 'John Doe',
    email = 'john@example.com',
    phone = 'N/A',
    message = 'Testing message content here.'
}: ContactFormEmailProps) => {
    return (
        <EmailLayout previewText={`New Contact Message from ${name}`}>
            <Section className="mb-8 border-b-2 border-slate-100 border-solid pb-6">
                <Text className="text-primary text-[12px] font-black uppercase tracking-widest m-0 mb-2">
                    Inquiry Received
                </Text>
                <Heading className="text-slate-900 text-[28px] font-black leading-[36px] m-0">
                    New Contact Message
                </Heading>
            </Section>

            <Section className="mb-10 p-6 bg-slate-50 border border-slate-200 border-solid rounded-2xl">
                <Row className="mb-4">
                    <Column className="w-[30%]">
                        <Text className="text-slate-500 text-[11px] font-black uppercase tracking-widest m-0">Name</Text>
                    </Column>
                    <Column className="w-[70%]">
                        <Text className="text-slate-900 text-[15px] font-bold m-0">{name}</Text>
                    </Column>
                </Row>
                <Row className="mb-4">
                    <Column className="w-[30%]">
                        <Text className="text-slate-500 text-[11px] font-black uppercase tracking-widest m-0">Email</Text>
                    </Column>
                    <Column className="w-[70%]">
                        <Text className="text-primary text-[15px] font-bold m-0">{email}</Text>
                    </Column>
                </Row>
                <Row>
                    <Column className="w-[30%]">
                        <Text className="text-slate-500 text-[11px] font-black uppercase tracking-widest m-0">Phone</Text>
                    </Column>
                    <Column className="w-[70%]">
                        <Text className="text-slate-900 text-[15px] font-medium m-0">{phone || 'Not provided'}</Text>
                    </Column>
                </Row>
            </Section>

            <Section className="bg-[#f0f7ff] border border-primary/20 border-solid rounded-2xl p-8 mb-8">
                <Heading as="h4" className="text-slate-900 text-[14px] font-black uppercase tracking-wider mt-0 mb-4">
                    Message
                </Heading>
                <Text className="text-slate-700 text-[16px] leading-[26px] m-0 whitespace-pre-wrap">
                    {message}
                </Text>
            </Section>

            <Text className="text-slate-400 text-[12px] text-center mt-12">
                This is an automated notification from BioLongevity Labs Support Portal.
            </Text>
        </EmailLayout>
    );
};

export default ContactFormEmail;
