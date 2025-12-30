import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { triggerGoogleWebhook } from '@/lib/webhooks'
import { verifyLeadToken } from '@/lib/security/jwt'

// Initialize Supabase Admin Client
export async function POST(req: Request) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    try {
        // --- JWT PROTECTION (The Shield) ---
        const authHeader = req.headers.get('authorization')
        const token = authHeader?.replace('Bearer ', '')

        if (!token || !(await verifyLeadToken(token))) {
            return NextResponse.json({ error: 'Unauthorized session' }, { status: 401 })
        }

        const body = await req.json()
        const { email, username, plan, period, amount, payment_method, order_bump, niche, location, funnel_history } = body

        if (!email || !username) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'

        // 1. Strict Input Validation
        const usernameRegex = /^[a-zA-Z0-9._]{1,30}$/
        if (!usernameRegex.test(username)) {
            return NextResponse.json({ error: 'Invalid username format' }, { status: 400 })
        }

        // 2. Rate Limiting (Anti-Spam)
        // Check orders created by this IP in the last 10 minutes
        const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString()

        const { count, error: countError } = await supabase
            .from('orders')
            .select('*', { count: 'exact', head: true })
            .filter('details->>ip_address', 'eq', ip)
            .gt('created_at', tenMinutesAgo)

        const ip_reputation = (count && count > 0) ? 'suspicious' : 'clean'

        if (countError) {
            console.error('Rate limit check failed:', countError)
        }

        if (count && count >= 3) {
            return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
        }

        // 3. Create Order Intent
        const { data, error } = await supabase
            .from('orders')
            .insert([
                {
                    details: {
                        email,
                        username,
                        plan,
                        period,
                        payment_method,
                        order_bump,
                        niche,
                        location,
                        ip_address: ip, // Save IP for future checks
                        funnel_history
                    },
                    amount: amount,
                    status: 'initiated', // Changed from pending_payment to initiated
                    created_at: new Date().toISOString()
                }
            ])
            .select()

        if (error) {
            console.error('Error creating lead:', error)
            return NextResponse.json({ success: false, error: error.message }, { status: 500 })
        }

        const orderId = data?.[0]?.id;

        // 4. Trigger Google Webhook (Phase 4)
        triggerGoogleWebhook('ORDER_INITIATED', {
            email,
            username,
            niche,
            location,
            order_id: orderId,
            ip_address: ip,
            ip_reputation,
            amount,
            plan,
            timestamp: new Date().toISOString()
        }).catch(e => console.error('Google Webhook Error:', e));

        // 5. Trigger "Order Initiated" Email (Async)
        const planNameMap: Record<string, string> = {
            'starter': 'GROWTH STARTER',
            'pro': 'VIRAL MOMENTUM',
            'partner': 'BRAND PARTNER'
        };

        const planName = planNameMap[plan] || 'Custom Strategy';

        // Construct the WhatsApp link for the email button
        const waMessage = `[RESERVATION: #${orderId}] ⚡ STRATEGY SECURED\n\nHi TDT Team! I just finished the El Faro analysis for @${username}. I'm ready to activate my ${planName} ($${amount.toFixed(2)}) immediately.\n\n📧 Email: ${email}\n\nI'm ready. Please provide the Zelle / CashApp / Transfer details to bypass the algorithm today. 🚀`;
        const payment_link = `https://wa.me/5492212235170?text=${encodeURIComponent(waMessage)}`;

        try {
            const { emailService } = await import('@/lib/services/email');
            emailService.sendOrderInitiated(email, {
                username,
                planName,
                amount,
                plan,
                orderId,
                payment_link
            }).catch(e => console.error('Delayed Email Error:', e));
        } catch (e) {
            console.error('Email trigger failed:', e);
        }

        return NextResponse.json({ success: true, orderId })

    } catch (error) {
        console.error('API Error:', error)
        return NextResponse.json({ success: false }, { status: 500 })
    }
}
