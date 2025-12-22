
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET(req: Request) {
    try {
        // Auth check for CRON (optional but recommended)
        // const authHeader = req.headers.get('authorization');
        // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        //     return new Response('Unauthorized', { status: 401 });
        // }

        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

        // 1. Fetch orders that are 'initiated' and created between 24-48h ago
        // and haven't received a recovery email yet.
        const { data: leads, error } = await supabase
            .from('orders')
            .select('*')
            .eq('status', 'initiated')
            .lt('created_at', twentyFourHoursAgo)
            .gt('created_at', fortyEightHoursAgo)
            .filter('details->>recovery_sent', 'is', null)

        if (error) throw error

        if (!leads || leads.length === 0) {
            return NextResponse.json({ message: 'No abandoned carts found.' })
        }

        const { emailService } = await import('@/lib/services/email')
        const results = []

        const planNameMap: Record<string, string> = {
            'starter': 'GROWTH STARTER',
            'pro': 'VIRAL MOMENTUM',
            'partner': 'BRAND PARTNER'
        }

        for (const lead of leads) {
            try {
                await emailService.sendAbandonedCartEmail(lead.details.email, {
                    username: lead.details.username,
                    planName: planNameMap[lead.details.plan] || 'Premium Strategy',
                    resume_link: `https://trenddigitaltrade.com/checkout?username=${lead.details.username}&plan=${lead.details.plan}`
                })

                // Mark as sent
                const updatedDetails = { ...lead.details, recovery_sent: new Date().toISOString() }
                await supabase
                    .from('orders')
                    .update({ details: updatedDetails })
                    .eq('id', lead.id)

                results.push({ id: lead.id, status: 'sent' })
            } catch (e) {
                console.error(`Failed to send abandoned cart email to ${lead.id}:`, e)
                results.push({ id: lead.id, status: 'failed', error: String(e) })
            }
        }

        return NextResponse.json({ processed: results.length, details: results })

    } catch (error: any) {
        console.error('CRON Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
