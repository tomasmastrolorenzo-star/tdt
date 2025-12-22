
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { triggerGoogleWebhook } from '@/lib/webhooks'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { event, metadata, timestamp } = body
        const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'

        // Extract niche/location and VIP classification from metadata
        const niche = metadata?.niche || metadata?.interest || null
        const location = metadata?.location || null
        const email = metadata?.email || null
        const leadClass = metadata?.lead_classification || 'STANDARD'
        const originalityScore = metadata?.visual_originality_score || null
        const nicheAvatar = metadata?.niche_avatar || null

        const { error } = await supabase
            .from('funnel_events')
            .insert([
                {
                    event_type: event,
                    ip_address: ip,
                    niche: niche,
                    location: location,
                    email: email,
                    metadata: {
                        ...metadata,
                        lead_classification: leadClass,
                        visual_originality_score: originalityScore,
                        niche_avatar: nicheAvatar
                    },
                    created_at: timestamp || new Date().toISOString()
                }
            ])

        if (error) {
            console.error('[Analytics] Error logging event:', error)
            return NextResponse.json({ success: false, error: error.message }, { status: 500 })
        }

        // TRIGGER CRM SYNC (Google Brain)
        triggerGoogleWebhook(event, {
            ...metadata,
            ip_address: ip,
            lead_classification: leadClass,
            is_black_tier: leadClass === 'LAZARUS',
            priority_tag: leadClass === 'LAZARUS' ? '[BLACK_TIER_RESCUE]' : (leadClass === 'WHALE' ? '[VIP_ELITE]' : '[STANDARD]'),
            visual_originality_score: originalityScore,
            timestamp: timestamp || new Date().toISOString()
        }).catch(e => console.error('[Analytics] Webhook Error:', e));

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('[Analytics] API Error:', error)
        return NextResponse.json({ success: false }, { status: 500 })
    }
}
