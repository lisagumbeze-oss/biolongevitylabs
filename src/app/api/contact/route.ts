import { NextResponse } from 'next/server';
import React from 'react';
import { sendEmail } from '@/lib/mail';
import ContactFormEmail from '@/components/emails/ContactFormEmail';

export async function POST(request: Request) {
    try {
        const { name, email, phone, message } = await request.json();

        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Name, email, and message are required.' },
                { status: 400 }
            );
        }

        // Send via SMTP if configured
        if (process.env.SMTP_HOST) {
            await sendEmail({
                to: process.env.SMTP_FROM_EMAIL || 'support@biolongevitylabss.com',
                replyTo: email,
                subject: `New Contact Form Message from ${name}`,
                react: React.createElement(ContactFormEmail, {
                    name,
                    email,
                    phone,
                    message
                })
            });
        } else {
            console.warn('SMTP_HOST not set. Contact form email not sent.');
            // Still return success — we don't want to show an error to the user
            // The message data is logged for backup
            console.log('Contact form submission (dry run):', { name, email, phone, message });
        }

        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        console.error('Contact form error:', error instanceof Error ? error.message : String(error));
        return NextResponse.json(
            { error: 'Failed to send message. Please try again later.' },
            { status: 500 }
        );
    }
}
