
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Initialize Supabase Admin Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { email, username, plan, period, amount, payment_method, order_bump } = body

        if (!email || !username) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Upsert Profile if needed (or just ensure it exists? For now we just create order)
        // Actually, we should try to link it to a user if possible, but for guest checkout just storing in orders is fine if tables allow nullable user_id.
        // Assuming 'orders' table has email/username fields or metadata.

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
                        order_bump
                    },
                    amount: amount,
                    status: 'pending_payment',
                    // user_id: ... might be null for guest
                    created_at: new Date().toISOString()
                }
            ])
            .select()

        if (error) {
            console.error('Error creating lead:', error)
            // Don't fail the request to the user, we want them to proceed to WhatsApp regardless
            return NextResponse.json({ success: false, error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true, orderId: data?.[0]?.id })

    } catch (error) {
        console.error('API Error:', error)
        return NextResponse.json({ success: false }, { status: 500 })
    }
}
