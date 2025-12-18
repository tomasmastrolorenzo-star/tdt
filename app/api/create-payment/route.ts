import { NextRequest, NextResponse } from "next/server"
import { cryptomusClient } from "@/lib/services/cryptomus"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, currency = "USD", orderDetails, email, username, userId } = body

    if (!amount || !email || !orderDetails) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Determine if this is a wallet top-up or service purchase
    const isWalletFund = orderDetails.type === 'wallet_fund'
    const serviceId = isWalletFund ? 'wallet_fund' : (orderDetails.packageId || "custom")
    const serviceName = isWalletFund ? 'Carga de Saldo' : orderDetails.plan

  }

    // Initialize Supabase Admin to bypass RLS for order creation
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

  // 1. Create Order in Database (Status: Pending Payment)
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_email: email,
      username: username,
      service_id: serviceId,
      service_name: serviceName,
      amount: amount, // Monetary amount
      quantity: parseInt(orderDetails.amount) || 0, // Service quantity (e.g. 1000 followers)
      link: orderDetails.link || "",
      platform: orderDetails.platform || "instagram",
      status: "pending_payment", // Initial status
      payment_method: "crypto",
      payment_status: "pending",
      metadata: {
        ...orderDetails,
        plan: orderDetails.plan,
        billing: orderDetails.billing,
        userId: userId // Store userId for wallet crediting
      }
    })
    .select()
    .single()

  if (orderError) {
    console.error("Error creating order:", orderError)
    return NextResponse.json(
      { error: "Failed to create order record" },
      { status: 500 }
    )
  }

  // 2. Create Payment in Cryptomus
  // Note: Cryptomus expects string amount. Ensure 'amount' is string or number.
  const paymentData = {
    amount: amount.toString(),
    currency: currency,
    order_id: order.id, // Use our DB ID as external order ID
    url_return: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?order_id=${order.id}&email=${email}`,
    url_callback: `${process.env.NEXT_PUBLIC_APP_URL}/api/cryptomus/webhook`,
    is_payment_multiple: true, // Allow user to pay in multiple txs if needed? Usually false is safer for simple items.
    lifetime: 3600, // 1 hour to pay
    additional_data: JSON.stringify({
      email,
      username,
      plan: orderDetails.plan
    })
  }

  const payment = await cryptomusClient.createPayment(paymentData)

  if (!payment || !payment.result) {
    throw new Error("Failed to get payment result from Cryptomus")
  }

  // 3. Return Payment URL to Frontend
  return NextResponse.json({
    success: true,
    url: payment.result.url,
    orderId: order.id
  })

} catch (error: any) {
  console.error("Payment Creation Error:", error)
  return NextResponse.json(
    { error: error.message || "Internal Server Error" },
    { status: 500 }
  )
}
}
