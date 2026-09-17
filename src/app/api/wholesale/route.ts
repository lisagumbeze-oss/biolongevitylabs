import { NextResponse } from 'next/server';
import React from 'react';
import { sendEmailToBoth, isEmailConfigured } from '@/lib/mail';
import WholesaleApplicationEmail from '@/components/emails/WholesaleApplicationEmail';
import SubmissionReceivedEmail from '@/components/emails/SubmissionReceivedEmail';

export async function POST(request: Request) {
    try {
        const { name, email, company, volume, message } = await request.json();

        if (!name || !email || !company) {
            return NextResponse.json(
                { error: 'Name, email, and company are required.' },
                { status: 400 }
            );
        }

        if (isEmailConfigured()) {
            await sendEmailToBoth({
                customerEmail: email,
                customerSubject: 'Wholesale application received - BioLongevity Labs',
                customerReact: React.createElement(SubmissionReceivedEmail, {
                    previewText: 'We received your wholesale application.',
                    title: 'Application Received',
                    subtitle: `Thanks ${name}. Your wholesale request is under review.`,
                    intro: 'Our institutional team will contact you at this email address, typically within 24 hours.',
                    details: [
                        { label: 'Name', value: name },
                        { label: 'Company', value: company },
                        { label: 'Email', value: email },
                        { label: 'Projected volume', value: volume || 'Not provided' },
                        { label: 'Message', value: message || 'No additional details provided.' },
                    ],
                }),
                adminSubject: `New Wholesale Application from ${company}`,
                adminReact: React.createElement(WholesaleApplicationEmail, {
                    name,
                    email,
                    company,
                    volume,
                    message,
                }),
                replyToCustomer: email,
            });
            console.log(`Wholesale application emails sent for ${company}`);
        } else {
            console.warn('RESEND_API_KEY not set. Wholesale email not sent.');
            console.log('Wholesale submission (dry run):', { name, email, company, volume, message });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('[Wholesale API] Failed to send email:', error?.message || error);
        return NextResponse.json(
            { error: `Failed to send application: ${error?.message || 'Unknown error'}` },
            { status: 500 }
        );
    }
}
