import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Use a separate client for rate limiting to ensure it bypasses any RLS if necessary (though service key does anyway)
// and strict usage.
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface RateLimitResult {
    allowed: boolean;
    error?: string;
}

const MAX_ATTEMPTS = 3;
const WINDOW_MINUTES = 10;

/**
 * Checks if the given IP address has exceeded the rate limit.
 * Uses the 'orders' table to count attempts (created records) in the last 10 minutes.
 * @param ip The IP address to check.
 */
export async function checkRateLimit(ip: string): Promise<RateLimitResult> {
    try {
        const timeWindow = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000).toISOString();

        const { count, error } = await supabase
            .from('orders')
            .select('*', { count: 'exact', head: true })
            .eq('details->>ip_address', ip) // Filter by IP in the JSONB column
            .gt('created_at', timeWindow);

        if (error) {
            console.error('Rate limit query error:', error);
            // Fail open if DB error, or closed? Secure default is closed, but for biz continuity maybe open.
            // Let's log and allow, but practically if DB is down nothing works anyway.
            return { allowed: true };
        }

        if (count !== null && count >= MAX_ATTEMPTS) {
            return {
                allowed: false,
                error: `Too many requests. Limit is ${MAX_ATTEMPTS} attempts per ${WINDOW_MINUTES} minutes. Please wait.`
            };
        }

        return { allowed: true };

    } catch (error) {
        console.error('Rate limit exception:', error);
        return { allowed: true };
    }
}
