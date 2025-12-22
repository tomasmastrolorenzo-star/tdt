
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { event, metadata, timestamp } = body
        const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'

        // Extract niche/location from metadata if available
        const niche = metadata?.niche || metadata?.interest || null
        const location = metadata?.location || null
        const email = metadata?.email || null

        const { error } = await supabase
            .from('funnel_events')
            .insert([
                {
                    event_type: event,
                    ip_address: ip,
                    niche: niche,
                    location: location,
                    email: email,
                    metadata: metadata,
                    created_at: timestamp || new Date().toISOString()
                }
            ])

        if (error) {
            console.error('[Analytics] Error logging event:', error)
            return NextResponse.json({ success: false, error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('[Analytics] API Error:', error)
        return NextResponse.json({ success: false }, { status: 500 })
    }
}
