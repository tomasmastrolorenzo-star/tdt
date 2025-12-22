import { NextRequest, NextResponse } from "next/server"
import { cryptomusClient } from "@/lib/services/cryptomus"
import { createClient } from "@supabase/supabase-js"

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
        } = body as any

        console.log('Cryptomus Webhook:', {
            uuid,
            order_id,
            status,
            payment_status,
            txid
        })


        // Initialize Supabase Admin to update orders without RLS restrictions
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            }
        )

        // Update order based on payment status
        if (status === 'paid' || status === 'paid_over') {
            // Payment successful
            const { data: updatedOrder, error: updateError } = await supabase
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
                    status: 'processing', // Standard Paid Status
                    updated_at: new Date().toISOString()
                })
                .eq('id', order_id)
                .select()
                .single()

            if (updateError) {
                console.error("Error updating order:", updateError)
                return NextResponse.json({ success: false, error: "Order update failed" }, { status: 500 })
            }

            // --- AUTOMATION: Resend Email ---
            if (updatedOrder) {
                try {
                    const { emailService } = await import('@/lib/services/email')
                    const planNameMap: Record<string, string> = {
                        'starter': 'GROWTH STARTER',
                        'pro': 'VIRAL MOMENTUM',
                        'partner': 'BRAND PARTNER'
                    }

                    await emailService.sendOrderConfirmation(updatedOrder.details.email, {
                        username: updatedOrder.details.username,
                        planName: planNameMap[updatedOrder.details.plan] || 'Premium Strategy',
                        status_link: 'https://trenddigitaltrade.com/dashboard/profile'
                    })
                    console.log('[Automation] Confirmation email sent for order:', order_id)

                    // --- AUTOMATION: Google Cloud Sync (ORDER_PAID) ---
                    const { triggerGoogleWebhook } = await import('@/lib/webhooks')
                    triggerGoogleWebhook('PAYMENT_SUCCESS', {
                        email: updatedOrder.details.email,
                        username: updatedOrder.details.username,
                        order_id: updatedOrder.id,
                        amount: updatedOrder.amount,
                        plan: updatedOrder.details.plan,
                        niche: updatedOrder.details.niche,
                        location: updatedOrder.details.location,
                        timestamp: new Date().toISOString()
                    }).catch(e => console.error('Google Webhook ORDER_PAID failed:', e))

                } catch (e) {
                    console.error('[Automation Error] Confirm flows failed:', e)
                }
            }

            // Handle Wallet Funding (Legacy/Redundant but keeping for safety)
            if (updatedOrder?.service_id === 'wallet_fund' || updatedOrder?.metadata?.type === 'wallet_fund') {
                const userId = updatedOrder.metadata?.userId
                const amountToAdd = parseFloat(payment_amount || updatedOrder.amount)

                if (userId && !isNaN(amountToAdd)) {
                    console.log(`Processing Wallet Top-up for user ${userId}: +${amountToAdd}`)

                    // 1. Ensure wallet exists (UPSERT not strictly needed if we assume it exists, but safer)
                    // First try to get wallet
                    let { data: wallet } = await supabase.from('wallets').select('id, balance').eq('user_id', userId).single()

                    if (!wallet) {
                        // Create wallet if missing
                        const { data: newWallet, error: createWalletError } = await supabase
                            .from('wallets')
                            .insert({ user_id: userId, balance: 0 })
                            .select()
                            .single()

                        if (createWalletError) {
                            console.error("Error creating wallet:", createWalletError)
                        } else {
                            wallet = newWallet
                        }
                    }

                    if (wallet) {
                        // 2. Update balance
                        const { error: balanceError } = await supabase
                            .from('wallets')
                            .update({
                                balance: Number(wallet.balance) + Number(amountToAdd),
                                updated_at: new Date().toISOString()
                            })
                            .eq('id', wallet.id)

                        if (!balanceError) {
                            // 3. Create Transaction Record
                            await supabase.from('transactions').insert({
                                wallet_id: wallet.id,
                                user_id: userId, // For redundancy/indexing
                                amount: amountToAdd,
                                type: 'deposit',
                                status: 'completed',
                                description: `Carga de saldo via Cryptomus (Orden #${updatedOrder.id.slice(0, 8)})`,
                                reference_id: updatedOrder.id
                            })

                            // 4. Mark order as completed
                            await supabase
                                .from('orders')
                                .update({ status: 'completed' })
                                .eq('id', updatedOrder.id)
                        } else {
                            console.error("Error updating balance:", balanceError)
                        }
                    }
                }
            }

            // TODO: Process JAP orders if it's NOT a wallet fund (service_id !== 'wallet_fund')

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
