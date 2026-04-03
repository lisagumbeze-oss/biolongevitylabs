import nodemailer from 'nodemailer';
import { render } from '@react-email/render';
import React from 'react';

// Configure the SMTP transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 10000,
});

interface SendEmailOptions {
    to: string | string[];
    subject: string;
    html?: string;
    react?: React.ReactElement;
    replyTo?: string;
}

/**
 * Sends an email using the configured SMTP server.
 * Supports both raw HTML and React Email components.
 */
export async function sendEmail({ to, subject, html, react, replyTo }: SendEmailOptions) {
    try {
        let emailHtml = html;

        // If a React component is provided, render it to HTML string
        if (react) {
            emailHtml = await render(react);
        }

        if (!emailHtml) {
            throw new Error('No email content provided (html or react).');
        }

        const info = await transporter.sendMail({
            from: `"${process.env.SMTP_FROM_NAME || 'BioLongevity Labs'}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
            to: Array.isArray(to) ? to.join(', ') : to,
            subject,
            html: emailHtml,
            replyTo,
        });

        console.log('[Mail] Email sent successfully:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('[Mail] Error sending email:', error);
        throw error;
    }
}
