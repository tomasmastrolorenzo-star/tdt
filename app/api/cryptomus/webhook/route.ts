import { NextRequest, NextResponse } from "next/server"
import { cryptomusClient } from "@/lib/services/cryptomus"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
    try {
        // Get webhook signature from headers
        const signature = request.headers.get('sign')

        if (!signature) {
            return NextResponse.json(
                { success: false, error: "Missing signature" },
                { status: 400 }
            )
        }

        // Parse webhook body
        const body = await request.json()

        // Verify webhook signature
        const isValid = cryptomusClient.verifyWebhookSignature(body, signature)

        if (!isValid) {
            console.error('Invalid webhook signature')
            return NextResponse.json(
                { success: false, error: "Invalid signature" },
                { status: 401 }
            )
        }

        // Extract payment data
        const {
            uuid,
            order_id,
            status,
            payment_status,
            txid,
            network,
            from,
            payment_amount,
            payer_amount,
            payer_currency,
        } = body

        console.log('Cryptomus Webhook:', {
            uuid,
            order_id,
            status,
            payment_status,
            txid
        })

        // Update order status in database
        const supabase = createClient()

        // Update order based on payment status
        if (status === 'paid' || status === 'paid_over') {
            // Payment successful
            await supabase
                .from('orders')
                .update({
                    payment_status: 'completed',
                    payment_method: 'crypto',
                    payment_details: {
                        uuid,
                        txid,
                        network,
                        from,
                        payment_amount,
                        payer_amount,
                        payer_currency,
                    },
                    status: 'processing',
                    updated_at: new Date().toISOString()
                })
                .eq('id', order_id)

            // TODO: Process the order (create JAP order, send confirmation email, etc.)

        } else if (status === 'cancel' || status === 'system_fail' || status === 'fail') {
            // Payment failed or cancelled
            await supabase
                .from('orders')
                .update({
                    payment_status: 'failed',
                    status: 'cancelled',
                    updated_at: new Date().toISOString()
                })
                .eq('id', order_id)
        } else if (status === 'process' || status === 'check' || status === 'confirmation_check') {
            // Payment in progress
            await supabase
                .from('orders')
                .update({
                    payment_status: 'pending',
                    updated_at: new Date().toISOString()
                })
                .eq('id', order_id)
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error processing Cryptomus webhook:", error)

        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : "Webhook processing failed"
            },
            { status: 500 }
        )
    }
}
