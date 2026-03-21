import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: Request) {
    try {
        const { name, email, phone, message } = await request.json();

        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Name, email, and message are required.' },
                { status: 400 }
            );
        }

        // Send via Resend if API key is set
        if (process.env.RESEND_API_KEY) {
            const resend = new Resend(process.env.RESEND_API_KEY);

            await resend.emails.send({
                from: 'BioLongevity Labs <support@biolongevitylabss.com>',
                to: ['support@biolongevitylabss.com'],
                replyTo: email,
                subject: `New Contact Form Message from ${name}`,
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #0f172a; border-bottom: 2px solid #137fec; padding-bottom: 12px;">
                            New Contact Form Submission
                        </h2>
                        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                            <tr>
                                <td style="padding: 10px 0; color: #64748b; font-weight: bold; width: 120px;">Name:</td>
                                <td style="padding: 10px 0; color: #0f172a;">${name}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; color: #64748b; font-weight: bold;">Email:</td>
                                <td style="padding: 10px 0; color: #0f172a;">
                                    <a href="mailto:${email}" style="color: #137fec;">${email}</a>
                                </td>
                            </tr>
                            ${phone ? `
                            <tr>
                                <td style="padding: 10px 0; color: #64748b; font-weight: bold;">Phone:</td>
                                <td style="padding: 10px 0; color: #0f172a;">${phone}</td>
                            </tr>
                            ` : ''}
                        </table>
                        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 20px 0;">
                            <h3 style="color: #0f172a; margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Message</h3>
                            <p style="color: #334155; line-height: 1.6; margin: 0; white-space: pre-wrap;">${message}</p>
                        </div>
                        <p style="color: #94a3b8; font-size: 12px; margin-top: 30px;">
                            This message was sent from the BioLongevity Labs contact form.
                        </p>
                    </div>
                `,
            });
        } else {
            console.warn('RESEND_API_KEY not set. Contact form email not sent.');
            // Still return success — we don't want to show an error to the user
            // The message data is logged for backup
            console.log('Contact form submission:', { name, email, phone, message });
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
