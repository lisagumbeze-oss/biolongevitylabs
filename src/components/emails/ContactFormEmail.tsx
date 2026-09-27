import React from 'react';
import EmailLayout from './shared/EmailLayout';
import { DetailList, EmailActions, EmailHeading, EmailParagraph } from './shared/EmailComponents';

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
        <EmailLayout previewText={`New message from ${name}`}>
            <EmailHeading
                eyebrow="Contact form"
                title="New customer message"
                subtitle="Someone submitted the contact form. Reply from this email so the customer receives it."
            />
            <DetailList
                rows={[
                    { label: 'Name', value: name },
                    { label: 'Email', value: email },
                    { label: 'Phone', value: phone || 'Not provided' },
                    { label: 'Message', value: message },
                ]}
            />
            <EmailActions primary={{ href: `mailto:${email}?subject=${encodeURIComponent('Re: your message to BioLongevity Labs')}`, label: 'Reply to customer' }} />
            <EmailParagraph>Received {new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}.</EmailParagraph>
        </EmailLayout>
    );
};

export default ContactFormEmail;
