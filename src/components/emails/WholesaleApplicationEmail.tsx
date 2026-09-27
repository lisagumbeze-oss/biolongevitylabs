import React from 'react';
import EmailLayout from './shared/EmailLayout';
import { DetailList, EmailActions, EmailHeading } from './shared/EmailComponents';

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
        <EmailLayout previewText={`Wholesale application from ${company}`}>
            <EmailHeading
                eyebrow="Wholesale"
                title="New wholesale application"
                subtitle={`${company} asked about bulk ordering. Reply to start the review.`}
            />
            <DetailList
                rows={[
                    { label: 'Name', value: name },
                    { label: 'Company', value: company },
                    { label: 'Email', value: email },
                    { label: 'Volume', value: volume || 'Not provided' },
                    { label: 'Message', value: message || 'No additional details provided.' },
                ]}
            />
            <EmailActions primary={{ href: `mailto:${email}?subject=${encodeURIComponent(`Wholesale application — ${company}`)}`, label: 'Reply to applicant' }} />
        </EmailLayout>
    );
};

export default WholesaleApplicationEmail;
