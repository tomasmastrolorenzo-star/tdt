
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { emailService } from '@/lib/services/email'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { email, eventId } = body

        if (!email || !eventId) {
            return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
        }

        // 1. Fetch event metadata to pre-populate email
        const { data: event, error: eventError } = await supabase
            .from('funnel_events')
            .select('*')
            .eq('id', eventId)
            .single()

        if (eventError || !event) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 })
        }

        const planNameMap: Record<string, string> = {
            'starter': 'GROWTH STARTER',
            'pro': 'VIRAL MOMENTUM',
            'partner': 'BRAND PARTNER'
        }

        const planKey = event.metadata?.plan || 'pro'
        const planName = planNameMap[planKey] || 'Custom Strategy'
        const username = event.metadata?.username || 'Creator'

        // 2. Trigger Recovery Email
        await emailService.sendAbandonedCartEmail(email, {
            username,
            planName,
            resume_link: `https://trenddigitaltrade.com/checkout?plan=${planKey}&email=${email}&username=${username}&interest=${event.niche}&location=${event.location}`
        })

        // 3. Mark as processed
        await supabase
            .from('funnel_events')
            .update({ processed_at: new Date().toISOString() })
            .eq('id', eventId)

        return NextResponse.json({ success: true })

    } catch (error) {
        console.error('Trigger Recovery Email Error:', error)
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 })
    }
}
