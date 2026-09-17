import React from 'react';
import { Text, Section } from '@react-email/components';
import EmailLayout from './shared/EmailLayout';
import { HeroHeader } from './shared/EmailComponents';

interface Detail {
    label: string;
    value: string;
}

interface SubmissionReceivedEmailProps {
    previewText: string;
    title: string;
    subtitle: string;
    intro: string;
    details?: Detail[];
}

export const SubmissionReceivedEmail = ({
    previewText,
    title,
    subtitle,
    intro,
    details = [],
}: SubmissionReceivedEmailProps) => {
    return (
        <EmailLayout previewText={previewText}>
            <HeroHeader title={title} subtitle={subtitle} />

            <Text className="text-slate-600 text-[15px] leading-[26px] m-0 mb-6">
                {intro}
            </Text>

            {details.length > 0 && (
                <Section className="bg-slate-50 border border-slate-200 border-solid rounded-2xl p-6">
                    <table className="w-full">
                        <tbody>
                            {details.map((detail) => (
                                <tr key={detail.label}>
                                    <td className="py-2 border-b border-slate-100 border-solid">
                                        <Text className="text-slate-400 text-[10px] font-black uppercase tracking-widest m-0 mb-1">{detail.label}</Text>
                                        <Text className="text-slate-900 text-[14px] font-bold m-0 whitespace-pre-wrap">{detail.value}</Text>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Section>
            )}
        </EmailLayout>
    );
};

export default SubmissionReceivedEmail;
