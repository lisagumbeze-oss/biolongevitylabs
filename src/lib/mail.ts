import { Resend } from 'resend';
import { render } from '@react-email/render';
import React from 'react';

const DEFAULT_FROM_EMAIL = 'support@biolongevitylabss.com';
const DEFAULT_FROM_NAME = 'BioLongevity Labs';

interface SendEmailOptions {
    to: string | string[];
    subject: string;
    html?: string;
    react?: React.ReactElement;
    replyTo?: string;
}

export function isEmailConfigured() {
    return Boolean(process.env.RESEND_API_KEY);
}

export function getNotificationEmail() {
    return process.env.ORDER_NOTIFICATION_EMAIL
        || process.env.RESEND_FROM_EMAIL
        || DEFAULT_FROM_EMAIL;
}

function getFromAddress() {
    const email = process.env.RESEND_FROM_EMAIL || DEFAULT_FROM_EMAIL;
    const name = process.env.RESEND_FROM_NAME || DEFAULT_FROM_NAME;
    return `${name} <${email}>`;
}

/**
 * Sends an email through Resend.
 * Supports both raw HTML and React Email components.
 */
export async function sendEmail({ to, subject, html, react, replyTo }: SendEmailOptions) {
    if (!process.env.RESEND_API_KEY) {
        throw new Error('RESEND_API_KEY is not set.');
    }

    let emailHtml = html;
    if (react) {
        emailHtml = await render(react);
    }

    if (!emailHtml) {
        throw new Error('No email content provided (html or react).');
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
        from: getFromAddress(),
        to,
        subject,
        html: emailHtml,
        replyTo,
    });

    if (error) {
        console.error('[Mail] Resend rejected the email:', error);
        throw new Error(error.message || 'Resend failed to send email.');
    }

    console.log('[Mail] Email sent successfully:', data?.id);
    return { success: true, messageId: data?.id };
}
