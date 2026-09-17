import { NextResponse } from 'next/server';
import React from 'react';
import { sendEmailToBoth, isEmailConfigured } from '@/lib/mail';
import ContactFormEmail from '@/components/emails/ContactFormEmail';
import SubmissionReceivedEmail from '@/components/emails/SubmissionReceivedEmail';

export async function POST(request: Request) {
    try {
        const { name, email, phone, message } = await request.json();

        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Name, email, and message are required.' },
                { status: 400 }
            );
        }

        if (isEmailConfigured()) {
            await sendEmailToBoth({
                customerEmail: email,
                customerSubject: 'We received your message - BioLongevity Labs',
                customerReact: React.createElement(SubmissionReceivedEmail, {
                    previewText: 'We received your message.',
                    title: 'Message Received',
                    subtitle: `Thanks ${name}. Your inquiry is in the support queue.`,
                    intro: 'Our team will reply to this email address. A copy of what you sent is below.',
                    details: [
                        { label: 'Name', value: name },
                        { label: 'Email', value: email },
                        { label: 'Phone', value: phone || 'Not provided' },
                        { label: 'Message', value: message },
                    ],
                }),
                adminSubject: `New Contact Form Message from ${name}`,
                adminReact: React.createElement(ContactFormEmail, {
                    name,
                    email,
                    phone,
                    message,
                }),
                replyToCustomer: email,
            });
        } else {
            console.warn('RESEND_API_KEY not set. Contact form email not sent.');
            // Still return success — we don't want to show an error to the user
            // The message data is logged for backup
            console.log('Contact form submission (dry run):', { name, email, phone, message });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('[Contact API] Failed to send email:', error?.message || error);
        return NextResponse.json(
            { error: `Failed to send message: ${error?.message || 'Unknown error'}` },
            { status: 500 }
        );
    }
}
