import { NextResponse } from 'next/server';
import React from 'react';
import { sendEmail } from '@/lib/mail';
import WholesaleApplicationEmail from '@/components/emails/WholesaleApplicationEmail';

export async function POST(request: Request) {
    try {
        const { name, email, company, volume, message } = await request.json();

        if (!name || !email || !company) {
            return NextResponse.json(
                { error: 'Name, email, and company are required.' },
                { status: 400 }
            );
        }

        // Send via SMTP
        if (process.env.SMTP_HOST) {
            await sendEmail({
                to: 'support@biolongevitylabss.com',
                replyTo: email,
                subject: `New Wholesale Application from ${company}`,
                react: React.createElement(WholesaleApplicationEmail, {
                    name,
                    email,
                    company,
                    volume,
                    message
                })
            });
            console.log(`Wholesale application sent for ${company}`);
        } else {
            console.warn('SMTP_HOST not set. Wholesale email not sent.');
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
