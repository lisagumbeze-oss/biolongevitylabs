import React from 'react';
import EmailLayout from './shared/EmailLayout';
import { DetailList, EmailActions, EmailHeading, EmailParagraph, type EmailAction } from './shared/EmailComponents';
import { SITE_URL } from '@/lib/site';

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
    primaryAction?: EmailAction;
    secondaryAction?: EmailAction;
}

export const SubmissionReceivedEmail = ({
    previewText,
    title,
    subtitle,
    intro,
    details = [],
    primaryAction = { href: SITE_URL, label: 'Visit BioLongevity Labs' },
    secondaryAction,
}: SubmissionReceivedEmailProps) => {
    return (
        <EmailLayout previewText={previewText}>
            <EmailHeading title={title} subtitle={subtitle} />
            <EmailParagraph>{intro}</EmailParagraph>
            {details.length > 0 && <DetailList rows={details} />}
            <EmailActions primary={primaryAction} secondary={secondaryAction} />
        </EmailLayout>
    );
};

export default SubmissionReceivedEmail;
