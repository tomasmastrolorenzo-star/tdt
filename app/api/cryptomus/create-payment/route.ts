import { NextRequest, NextResponse } from "next/server"
import { cryptomusClient } from "@/lib/services/cryptomus"

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const {
            amount,
            currency = "USD",
            orderId,
            customerEmail,
            returnUrl,
            callbackUrl
        } = body

        // Validate required fields
        if (!amount || !orderId) {
            return NextResponse.json(
                { success: false, error: "Missing required fields: amount, orderId" },
                { status: 400 }
            )
        }

        // Create payment with Cryptomus
        const payment = await cryptomusClient.createPayment({
            amount: amount.toString(),
            currency: currency,
            order_id: orderId,
            url_return: returnUrl || `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
            url_callback: callbackUrl || `${process.env.NEXT_PUBLIC_APP_URL}/api/cryptomus/webhook`,
            lifetime: 3600, // 1 hour
            to_currency: "USDT", // Accept USDT by default
            additional_data: customerEmail || "",
        })

        if (payment.state !== 0) {
            throw new Error("Failed to create payment")
        }

        return NextResponse.json({
            success: true,
            payment: {
                uuid: payment.result.uuid,
                orderId: payment.result.order_id,
                amount: payment.result.amount,
                paymentAmount: payment.result.payment_amount,
                currency: payment.result.currency,
                payerCurrency: payment.result.payer_currency,
                address: payment.result.address,
                network: payment.result.network,
                url: payment.result.url,
                status: payment.result.status,
                expiresAt: payment.result.expired_at,
            }
        })
    } catch (error) {
        console.error("Error creating Cryptomus payment:", error)

        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : "Failed to create payment"
            },
            { status: 500 }
        )
    }
}
