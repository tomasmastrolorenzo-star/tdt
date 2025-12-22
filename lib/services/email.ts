import { Resend } from 'resend';
import * as Sentry from '@sentry/nextjs';

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
}

const COLORS = {
    bg: '#0f172a',
    text: '#ffffff',
    muted: '#94a3b8',
    neonOrange: '#FF6B35',
    border: '#1e293b',
    card: '#1e293b'
};

const commonStyles = `
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    max-width: 600px;
    margin: 0 auto;
    background: ${COLORS.bg};
    color: ${COLORS.text};
    padding: 0;
    border-radius: 16px;
    overflow: hidden;
    line-height: 1.6;
`;

const emailLayout = (content: string) => `
    <div style="background-color: #020617; padding: 40px 20px;">
        <div style="${commonStyles}">
            <div style="padding: 40px;">
                <div style="margin-bottom: 30px; text-align: center;">
                    <span style="font-size: 24px; font-weight: 900; letter-spacing: -0.025em;">TDT <span style="color: ${COLORS.neonOrange};">PLATFORM</span></span>
                </div>
                ${content}
                <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid ${COLORS.border}; text-align: center;">
                    <p style="font-size: 12px; color: ${COLORS.muted}; margin-bottom: 8px;">
                        &copy; ${new Date().getFullYear()} Trend Digital Trade. All rights reserved.
                    </p>
                    <p style="font-size: 11px; color: ${COLORS.muted}; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700;">
                        Digital Authority Built with AI
                    </p>
                </div>
            </div>
        </div>
    </div>
`;

const buttonStyle = `
    display: inline-block;
    background: ${COLORS.neonOrange};
    color: #ffffff;
    padding: 16px 32px;
    text-decoration: none;
    border-radius: 12px;
    font-weight: 800;
    font-size: 16px;
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin: 20px 0;
    box-shadow: 0 10px 20px -10px ${COLORS.neonOrange}80;
`;

export class EmailService {
    private resend: Resend;

    constructor() {
        this.resend = new Resend(process.env.RESEND_API_KEY);
    }

    async sendEmail(options: EmailOptions): Promise<void> {
        if (!process.env.RESEND_API_KEY) {
            console.warn('RESEND_API_KEY not found. Skipping email.');
            return;
        }

        try {
            const { data, error } = await this.resend.emails.send({
                from: 'TDT Elite Team <hq@trenddigitaltrade.com>',
                to: options.to,
                subject: options.subject,
                html: options.html,
            });

            if (error) {
                const sentryError = new Error(`Resend Error: ${error.message}`);
                Sentry.captureException(sentryError, {
                    extra: { to: options.to, subject: options.subject, error }
                });
                throw error;
            }
            console.log('Email sent successfully:', data?.id);
        } catch (error) {
            console.error('Resend Error:', error);
            Sentry.captureException(error, {
                extra: { to: options.to, subject: options.subject }
            });
            // Don't throw here to prevent blocking main flows
        }
    }

    async sendOrderInitiated(to: string, o: any): Promise<void> {
        const content = `
            <h1 style="font-size: 24px; font-weight: 900; margin-bottom: 20px; line-height: 1.2;">Hey ${o.username},</h1>
            <p style="font-size: 16px; color: ${COLORS.text}; margin-bottom: 24px;">Your AI Analysis is complete, and your slot for <strong>${o.planName}</strong> is officially locked in.</p>
            
            <p style="font-size: 16px; color: ${COLORS.text}; margin-bottom: 24px;">We’ve reserved your spot in our deployment queue for the next 2 hours. To finalize your activation and start beating the algorithm, please complete your payment via our VIP Concierge.</p>
            
            <div style="background: ${COLORS.card}; padding: 24px; border-radius: 12px; border: 1px solid ${COLORS.border}; margin-bottom: 30px;">
                <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; color: ${COLORS.neonOrange}; margin-top: 0; margin-bottom: 16px;">Next Steps:</h3>
                <ol style="margin: 0; padding-left: 20px; color: ${COLORS.text};">
                    <li style="margin-bottom: 12px;">Click the button below to reach our agent on WhatsApp.</li>
                    <li style="margin-bottom: 12px;">Send your payment confirmation (Zelle / USDT / Transfer).</li>
                    <li>Our AI engine starts the deployment immediately.</li>
                </ol>
            </div>

            <div style="text-align: center;">
                <a href="${o.payment_link}" style="${buttonStyle}">COMPLETE ACTIVATION NOW 🔒</a>
            </div>

            <div style="margin-top: 30px; padding: 20px; border-top: 1px solid ${COLORS.border};">
                <p style="font-size: 12px; color: ${COLORS.muted}; margin-bottom: 4px; text-transform: uppercase;">Order Details:</p>
                <p style="margin: 4px 0; font-size: 14px;"><strong>Service:</strong> ${o.planName}</p>
                <p style="margin: 4px 0; font-size: 14px;"><strong>Account:</strong> @${o.username}</p>
                <p style="margin: 4px 0; font-size: 14px;"><strong>Status:</strong> <span style="color: ${COLORS.neonOrange};">Pending Verification</span></p>
            </div>

            <p style="font-size: 14px; color: ${COLORS.muted}; margin-top: 30px;">
                Don't let the algorithm win. If we don't receive confirmation within 2 hours, your slot will be released to the next creator in line.
            </p>
            <p style="font-size: 16px; font-weight: 700; margin-top: 20px;">Stay ahead,<br>The TDT Elite Team</p>
        `;

        await this.sendEmail({
            to,
            subject: `🛡️ Action Required: Your Growth Slot is Reserved [Order #${o.orderId || 'REC'}]`,
            html: emailLayout(content)
        });
    }

    async sendOrderConfirmation(to: string, o: any): Promise<void> {
        const content = `
            <h1 style="font-size: 24px; font-weight: 900; margin-bottom: 20px; line-height: 1.2;">It’s official, ${o.username}.</h1>
            <p style="font-size: 16px; margin-bottom: 24px;">Your payment has been verified. You are no longer just a creator; you are now powered by Trend Digital Trade’s GPT-4o Engine.</p>
            
            <div style="background: ${COLORS.card}; padding: 24px; border-radius: 12px; border: 1px solid ${COLORS.border}; margin-bottom: 30px;">
                <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; color: ${COLORS.neonOrange}; margin-top: 0; margin-bottom: 16px;">What’s happening now?</h3>
                <ul style="margin: 0; padding-left: 20px; list-style-type: none;">
                    <li style="margin-bottom: 12px;">✔️ <strong>Phase 1:</strong> Account indexing and niche targeting (Started).</li>
                    <li style="margin-bottom: 12px;">✔️ <strong>Phase 2:</strong> Organic engagement simulation.</li>
                    <li>✔️ <strong>Phase 3:</strong> Algorithm momentum trigger.</li>
                </ul>
            </div>

            <p style="font-size: 16px; margin-bottom: 24px;"><strong>Estimated Delivery:</strong> You will start seeing the first results within 12 to 24 hours. Our system drips the engagement naturally to ensure maximum security for your account.</p>

            <div style="text-align: center;">
                <a href="${o.status_link || '#'}" style="${buttonStyle}">VIEW MY ORDER STATUS</a>
            </div>

            <p style="font-size: 16px; margin-top: 30px; font-style: italic; color: ${COLORS.muted};">
                Welcome to the inner circle. Most people buy bots; you just bought a strategy.
            </p>
            <p style="font-size: 16px; font-weight: 700; margin-top: 20px;">Best,<br>Vortex & The TDT Team</p>
        `;

        await this.sendEmail({
            to,
            subject: `✅ Welcome to the 1%: Activation Started [@${o.username}]`,
            html: emailLayout(content)
        });
    }

    async sendAbandonedCartEmail(to: string, o: any): Promise<void> {
        const content = `
            <h1 style="font-size: 24px; font-weight: 900; margin-bottom: 20px; color: ${COLORS.neonOrange};">We noticed you left your AI Strategy on the table.</h1>
            <p style="font-size: 16px; margin-bottom: 24px;">The algorithm doesn't wait for anyone. Since you initiated your analysis for <strong>${o.planName}</strong>, our system has already mapped out your niche's growth path. It would be a waste to let it expire.</p>
            
            <p style="font-size: 16px; margin-bottom: 24px;">We've extended your reservation for 12 more hours.</p>

            <div style="text-align: center;">
                <a href="${o.resume_link || '#'}" style="${buttonStyle}">RESUME ACTIVATION</a>
            </div>

            <p style="font-size: 16px; margin-top: 30px;">If you have questions about the process or need another payment method, just reply to this email or hit us on WhatsApp.</p>
            
            <p style="font-size: 18px; font-weight: 900; margin-top: 30px; text-align: center;">Get the reach you deserve.</p>
        `;

        await this.sendEmail({
            to,
            subject: `⚠️ Final Notice: Your Strategy for @${o.username} is expiring...`,
            html: emailLayout(content)
        });
    }
}

export function getEmailService(): EmailService {
    return new EmailService();
}

export const emailService = {
    sendOrderInitiated: async (to: string, o: any) => getEmailService().sendOrderInitiated(to, o),
    sendOrderConfirmation: async (to: string, o: any) => getEmailService().sendOrderConfirmation(to, o),
    sendAbandonedCartEmail: async (to: string, o: any) => getEmailService().sendAbandonedCartEmail(to, o)
};
