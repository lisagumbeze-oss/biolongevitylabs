import React from 'react';
import { Text, Section, Heading, Row, Column } from '@react-email/components';
import EmailLayout from './shared/EmailLayout';
import { InfoBlock } from './shared/EmailComponents';

interface WholesaleApplicationEmailProps {
    name: string;
    email: string;
    company: string;
    volume: string;
    message?: string;
}

export const WholesaleApplicationEmail = ({
    name = 'Jane Doe',
    email = 'jane@example.com',
    company = 'Research Lab Inc.',
    volume = '50 - 200 Vials',
    message = 'We are interested in bulk procurement for our clinical studies.'
}: WholesaleApplicationEmailProps) => {
    return (
        <EmailLayout previewText={`Partnership Application: ${company}`}>
            <Section className="mb-10 text-center">
                <Text className="text-primary text-[10px] font-black uppercase tracking-[0.3em] m-0 mb-3">
                    Institutional Partnership Log
                </Text>
                <Heading className="text-slate-900 text-[32px] font-black leading-[1.1] m-0 tracking-tight">
                    Wholesale Application
                </Heading>
                <Text className="text-slate-500 text-[14px] mt-2 font-medium">
                    A new bulk procurement request has been submitted for institutional review.
                </Text>
            </Section>

            <Section className="mb-8 p-1 bg-slate-50 border border-slate-200 border-solid rounded-2xl overflow-hidden">
                <table className="w-full border-collapse">
                    <tbody>
                        <tr>
                            <td className="p-6 border-b border-slate-200 border-solid" style={{ width: '50%' }}>
                                <Text className="text-slate-400 text-[10px] font-black uppercase tracking-widest m-0 mb-1">Lead Researcher</Text>
                                <Text className="text-slate-900 text-[16px] font-bold m-0">{name}</Text>
                            </td>
                            <td className="p-6 border-b border-slate-200 border-solid border-l" style={{ width: '50%' }}>
                                <Text className="text-slate-400 text-[10px] font-black uppercase tracking-widest m-0 mb-1">Institution / Entity</Text>
                                <Text className="text-slate-900 text-[16px] font-bold m-0 uppercase tracking-tight">{company}</Text>
                            </td>
                        </tr>
                        <tr>
                            <td className="p-6" style={{ width: '50%' }}>
                                <Text className="text-slate-400 text-[10px] font-black uppercase tracking-widest m-0 mb-1">Direct Channel</Text>
                                <Text className="text-primary text-[16px] font-bold m-0">{email}</Text>
                            </td>
                            <td className="p-6 border-l border-slate-200 border-solid" style={{ width: '50%' }}>
                                <Text className="text-slate-400 text-[10px] font-black uppercase tracking-widest m-0 mb-1">Projected Capacity</Text>
                                <Text className="text-slate-900 text-[16px] font-black m-0">{volume}</Text>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </Section>

            <InfoBlock title="Institutional Context" iconColor="#137fec">
                <div className="bg-white p-6 rounded-xl border border-slate-200 border-solid italic shadow-sm">
                    <Text className="text-slate-600 text-[15px] leading-[26px] m-0">
                        &quot;{message || 'No additional research context provided.'}&quot;
                    </Text>
                </div>
            </InfoBlock>

            <Section className="mt-10 p-6 border border-dashed border-slate-200 rounded-2xl text-center">
                <Text className="text-slate-400 text-[12px] m-0 font-medium leading-[20px]">
                    This inquiry was processed by the BioLongevity Labs Institutional Relations team.
                    Review the applicant's credentials before authorizing wholesale portal access.
                </Text>
            </Section>
        </EmailLayout>
    );
};

export default WholesaleApplicationEmail;
