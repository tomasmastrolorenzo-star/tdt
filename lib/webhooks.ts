
export type WebhookEvent = 'LEAD_ABANDONED' | 'ORDER_INITIATED' | 'PAYMENT_SUCCESS';

interface WebhookPayload {
    email?: string;
    username?: string;
    niche?: string;
    location?: string;
    order_id?: string;
    ip_address?: string;
    ip_reputation?: 'clean' | 'suspicious' | 'flagged';
    amount?: number;
    plan?: string;
    timestamp: string;
    [key: string]: any;
}

export async function triggerGoogleWebhook(event: WebhookEvent, payload: WebhookPayload) {
    const GOOGLE_URL = process.env.GOOGLE_AUTOMATION_URL || 'https://script.google.com/macros/s/AKfycbwcpl7m3WtPVtSqJe_60NUoVSJWF99tx9fuOW5uVkoiW1lYT4rdt5xIeu9AQ0946PESxA/exec';

    if (!GOOGLE_URL) {
        console.warn('GOOGLE_AUTOMATION_URL not configured. Skipping webhook.');
        return null;
    }

    try {
        console.log(`[Webhook] Triggering ${event} for ${payload.email || payload.username}`);

        const response = await fetch(GOOGLE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                event,
                ...payload,
                source: 'TDT_PLATFORM_V4'
            }),
        });

        if (!response.ok) {
            throw new Error(`Webhook failed with status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`[Webhook Error] ${event}:`, error);
        // We could log to Sentry here once configured
        return null;
    }
}
