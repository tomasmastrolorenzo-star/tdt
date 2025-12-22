"use client"

// Event types for the conversion funnel
export type FunnelEvent =
    | 'hero_view'
    | 'STEP_1_BEACON_START'
    | 'STEP_2_PRICING_VIEW'
    | 'STEP_3_CHECKOUT_ENTRY'
    | 'STEP_4_WHATSAPP_REDIRECT'
    | 'lead_attempt'
    | 'whatsapp_redirect';

interface FunnelStep {
    event: FunnelEvent;
    timestamp: string;
    metadata?: any;
}

const STORAGE_KEY = 'tdt_funnel_session';

export const funnelTracker = {
    track: async (event: FunnelEvent, metadata?: any) => {
        if (typeof window === 'undefined') return;

        try {
            // 1. Local Storage Persistence (for browser session)
            const sessionData = localStorage.getItem(STORAGE_KEY);
            const funnel: FunnelStep[] = sessionData ? JSON.parse(sessionData) : [];

            funnel.push({
                event,
                timestamp: new Date().toISOString(),
                metadata
            });

            localStorage.setItem(STORAGE_KEY, JSON.stringify(funnel));

            // 2. Server-side Persistence (The "Digital Shadow")
            // Send to internal API to handle IP/DB insert
            fetch('/api/analytics/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    event,
                    metadata,
                    timestamp: new Date().toISOString()
                })
            }).catch(e => console.warn('[Funnel] DB Sync Failed:', e));

            console.log(`[Funnel] Tracked: ${event}`, metadata);
        } catch (e) {
            console.error('Funnel Tracking Error:', e);
        }
    },

    getHistory: (): FunnelStep[] => {
        if (typeof window === 'undefined') return [];
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    },

    clear: () => {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(STORAGE_KEY);
    }
};
