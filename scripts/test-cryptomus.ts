/**
 * Test script for Cryptomus integration
 * Run this after configuring your Cryptomus credentials
 */

async function testCryptomus() {
    console.log('🔑 Testing Cryptomus Integration...\n')

    // Get credentials from environment
    const merchantId = process.env.CRYPTOMUS_MERCHANT_ID
    const apiKey = process.env.CRYPTOMUS_API_KEY
    const paymentKey = process.env.CRYPTOMUS_PAYMENT_KEY

    // Check if credentials are configured
    if (!merchantId || merchantId === 'your_merchant_id_here') {
        console.log('❌ ERROR: CRYPTOMUS_MERCHANT_ID not configured')
        console.log('\n📝 Steps to fix:')
        console.log('1. Go to https://cryptomus.com/merchant')
        console.log('2. Settings → Merchant')
        console.log('3. Copy your Merchant ID, API Key, and Payment Key')
        console.log('4. Edit .env.local and set:')
        console.log('   CRYPTOMUS_MERCHANT_ID=your_merchant_id')
        console.log('   CRYPTOMUS_API_KEY=your_api_key')
        console.log('   CRYPTOMUS_PAYMENT_KEY=your_payment_key')
        console.log('\n💡 See guide: cryptomus-configuration-guide.md')
        process.exit(1)
    }

    if (!apiKey || apiKey === 'your_cryptomus_api_key_here') {
        console.log('❌ ERROR: CRYPTOMUS_API_KEY not configured')
        process.exit(1)
    }

    if (!paymentKey || paymentKey === 'your_payment_key_here') {
        console.log('❌ ERROR: CRYPTOMUS_PAYMENT_KEY not configured')
        process.exit(1)
    }

    console.log('✅ Credentials found in environment')
    console.log(`🏪 Merchant ID: ${merchantId.substring(0, 10)}...`)
    console.log(`🔑 API Key: ${apiKey.substring(0, 10)}...`)
    console.log(`🔐 Payment Key: ${paymentKey.substring(0, 10)}...\n`)

    try {
        // Test 1: Create a test payment
        console.log('🧪 Test 1: Creating test payment...')

        const testPayment = {
            amount: '10.00',
            currency: 'USD',
            order_id: `test_${Date.now()}`,
            url_return: 'https://panel.trenddigitaltrade.com/checkout/success',
            url_callback: 'https://panel.trenddigitaltrade.com/api/cryptomus/webhook',
            to_currency: 'USDT',
            lifetime: 3600,
        }

        const response = await fetch('http://localhost:3000/api/cryptomus/create-payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testPayment),
        })

        if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`HTTP ${response.status}: ${errorText}`)
        }

        const data = await response.json()

        if (!data.success) {
            throw new Error(data.error || 'Failed to create payment')
        }

        console.log('✅ Test payment created successfully!')
        console.log('\n📋 Payment Details:')
        console.log('━'.repeat(80))
        console.log(`UUID: ${data.payment.uuid}`)
        console.log(`Order ID: ${data.payment.orderId}`)
        console.log(`Amount: ${data.payment.amount} ${data.payment.currency}`)
        console.log(`Payment Amount: ${data.payment.paymentAmount} ${data.payment.payerCurrency}`)
        console.log(`Network: ${data.payment.network}`)
        console.log(`Address: ${data.payment.address}`)
        console.log(`Status: ${data.payment.status}`)
        console.log(`Payment URL: ${data.payment.url}`)
        console.log(`Expires At: ${new Date(data.payment.expiresAt * 1000).toLocaleString()}`)
        console.log('━'.repeat(80))

        // Summary
        console.log('\n' + '═'.repeat(80))
        console.log('✅ ALL TESTS PASSED!')
        console.log('═'.repeat(80))
        console.log('\n🎯 Next steps:')
        console.log('1. Configure webhook URL in Cryptomus dashboard')
        console.log('2. Test a real payment with small amount')
        console.log('3. Verify webhook receives notifications')
        console.log('4. Integrate with checkout flow')
        console.log('\n💡 Webhook URL: https://panel.trenddigitaltrade.com/api/cryptomus/webhook')
        console.log('💡 See guide: cryptomus-configuration-guide.md')

    } catch (error) {
        console.log('\n❌ TEST FAILED')
        console.log('━'.repeat(80))
        console.error('Error:', error instanceof Error ? error.message : error)
        console.log('\n💡 Troubleshooting:')
        console.log('1. Verify your Cryptomus credentials are correct')
        console.log('2. Check that your merchant is active in Cryptomus')
        console.log('3. Ensure your server is running (npm run dev)')
        console.log('4. Check the API endpoint is accessible')
        console.log('5. Review Cryptomus documentation: https://doc.cryptomus.com/')
        process.exit(1)
    }
}

// Run the test
testCryptomus()
    .then(() => {
        console.log('\n✅ Test completed successfully!')
        process.exit(0)
    })
    .catch((error) => {
        console.error('\n❌ Test failed:', error)
        process.exit(1)
    })
