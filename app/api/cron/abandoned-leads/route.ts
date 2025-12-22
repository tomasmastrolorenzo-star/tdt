
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { triggerGoogleWebhook } from '@/lib/webhooks'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET(req: Request) {
    try {
        // Authenticate CRON (optional, but good practice)
        // const authHeader = req.headers.get('authorization');
        // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        //     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        // }

        const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString()
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()

        // 1. Fetch unprocessed checkout entries from 10-60 minutes ago
        const { data: events, error: eventError } = await supabase
            .from('funnel_events')
            .select('*')
            .eq('event_type', 'STEP_3_CHECKOUT_ENTRY')
            .is('processed_at', null)
            .not('email', 'is', null)
            .lt('created_at', tenMinutesAgo)
            .gt('created_at', oneHourAgo);

        if (eventError) throw eventError;
        if (!events || events.length === 0) {
            return NextResponse.json({ success: true, count: 0 });
        }

        let processedCount = 0;

        for (const event of events) {
            // 2. Check if an order exists for this email
            const { count, error: orderError } = await supabase
                .from('orders')
                .select('*', { count: 'exact', head: true })
                .eq('details->>email', event.email);

            if (orderError) {
                console.error('Error checking orders for abandonment:', orderError);
                continue;
            }

            // 3. If no order, trigger LEAD_ABANDONED webhook
            if (!count || count === 0) {
                await triggerGoogleWebhook('LEAD_ABANDONED', {
                    email: event.email,
                    username: event.metadata?.username || 'unknown',
                    niche: event.niche || 'universal',
                    location: event.location || 'global',
                    ip_address: event.ip_address,
                    ip_reputation: 'clean', // Could be detailed later
                    plan: event.metadata?.plan || 'unknown',
                    timestamp: event.created_at
                });
            }

            // 4. Mark as processed (whether a lead or not, to avoid re-checking)
            await supabase
                .from('funnel_events')
                .update({ processed_at: new Date().toISOString() })
                .eq('id', event.id);

            processedCount++;
        }

        return NextResponse.json({ success: true, processed: processedCount });

    } catch (error) {
        console.error('Abandoned Leads Cron Error:', error);
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
    }
}
