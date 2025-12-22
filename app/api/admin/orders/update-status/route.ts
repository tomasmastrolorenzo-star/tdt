
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { orderId, newStatus } = body

        if (!orderId || !newStatus) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
        }

        // 1. Get current order details before update
        const { data: order, error: fetchError } = await supabase
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .single()

        if (fetchError || !order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 })
        }

        // 2. Update status
        const { error: updateError } = await supabase
            .from('orders')
            .update({ status: newStatus })
            .eq('id', orderId)

        if (updateError) throw updateError

        // 3. If transitioning to 'processing' (PAID), send confirmation email
        if (newStatus === 'processing' && order.status !== 'processing') {
            try {
                const { emailService } = await import('@/lib/services/email')
                const planNameMap: Record<string, string> = {
                    'starter': 'GROWTH STARTER',
                    'pro': 'VIRAL MOMENTUM',
                    'partner': 'BRAND PARTNER'
                }

                await emailService.sendOrderConfirmation(order.details.email, {
                    username: order.details.username,
                    planName: planNameMap[order.details.plan] || 'Premium Strategy',
                    status_link: 'https://trenddigitaltrade.com/dashboard/profile' // Placeholder for user dashboard
                })
                console.log('Confirmation email triggered for order:', orderId)
            } catch (e) {
                console.error('Failed to send confirmation email:', e)
            }
        }

        return NextResponse.json({ success: true })

    } catch (error: any) {
        console.error('Admin Update Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
