/**
 * Quick test script to verify your JAP API Key
 * Run this after you've added your API Key to .env.local
 */

async function testJapApiKey() {
    console.log('🔑 Testing JAP API Key...\n')

    // Get API credentials from environment
    const apiKey = process.env.JAP_API_KEY
    const apiUrl = process.env.JAP_API_URL || 'https://justanotherpanel.com/api/v2'

    // Check if API Key is configured
    if (!apiKey || apiKey === 'your_jap_api_key_here') {
        console.log('❌ ERROR: JAP_API_KEY not configured')
        console.log('\n📝 Steps to fix:')
        console.log('1. Go to https://justanotherpanel.com')
        console.log('2. Login → Account (or Settings → API)')
        console.log('3. Copy your API Key')
        console.log('4. Edit .env.local and set JAP_API_KEY=your_api_key_here')
        console.log('\n💡 See guide: como-obtener-api-key-jap.md')
        process.exit(1)
    }

    console.log('✅ API Key found in environment')
    console.log(`📍 API URL: ${apiUrl}`)
    console.log(`🔑 API Key: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 5)}\n`)

    try {
        // Test 1: Check balance
        console.log('🧪 Test 1: Checking account balance...')
        const balanceBody = new URLSearchParams({
            key: apiKey,
            action: 'balance'
        })

        const balanceResponse = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: balanceBody.toString(),
        })

        if (!balanceResponse.ok) {
            throw new Error(`HTTP ${balanceResponse.status}: ${balanceResponse.statusText}`)
        }

        const balanceData = await balanceResponse.json()

        if (balanceData.error) {
            console.log('❌ API Error:', balanceData.error)
            console.log('\n💡 Possible issues:')
            console.log('   - API Key is incorrect')
            console.log('   - API Key has extra spaces or characters')
            console.log('   - Account is not active')
            process.exit(1)
        }

        console.log('✅ Balance retrieved successfully!')
        console.log(`💰 Balance: ${balanceData.currency} ${balanceData.balance}\n`)

        // Test 2: Fetch services
        console.log('🧪 Test 2: Fetching available services...')
        const servicesBody = new URLSearchParams({
            key: apiKey,
            action: 'services'
        })

        const servicesResponse = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: servicesBody.toString(),
        })

        if (!servicesResponse.ok) {
            throw new Error(`HTTP ${servicesResponse.status}: ${servicesResponse.statusText}`)
        }

        const servicesData = await servicesResponse.json()

        if (Array.isArray(servicesData)) {
            console.log(`✅ Services retrieved successfully!`)
            console.log(`📦 Total services available: ${servicesData.length}\n`)

            // Show sample services
            console.log('📋 Sample services:')
            console.log('━'.repeat(80))
            servicesData.slice(0, 5).forEach(service => {
                console.log(`Service ID: ${service.service}`)
                console.log(`Name: ${service.name}`)
                console.log(`Category: ${service.category}`)
                console.log(`Rate: $${service.rate} | Min: ${service.min} | Max: ${service.max}`)
                console.log(`Refill: ${service.refill ? '✅' : '❌'} | Cancel: ${service.cancel ? '✅' : '❌'}`)
                console.log('─'.repeat(80))
            })

            if (servicesData.length > 5) {
                console.log(`... and ${servicesData.length - 5} more services\n`)
            }

            // Categorize services
            const categories = [...new Set(servicesData.map(s => s.category))]
            console.log(`\n📊 Service Categories (${categories.length}):`)
            categories.slice(0, 10).forEach(cat => {
                const count = servicesData.filter(s => s.category === cat).length
                console.log(`   - ${cat}: ${count} services`)
            })
            if (categories.length > 10) {
                console.log(`   ... and ${categories.length - 10} more categories`)
            }

        } else {
            console.log('❌ Unexpected response format')
            console.log(servicesData)
        }

        // Summary
        console.log('\n' + '═'.repeat(80))
        console.log('✅ ALL TESTS PASSED!')
        console.log('═'.repeat(80))
        console.log('\n🎯 Next steps:')
        console.log('1. Run: npx tsx scripts/sync-jap-services.ts')
        console.log('2. Access your dashboard: /dashboard/operator/services')
        console.log('3. Configure your service IDs in JAP admin panel')
        console.log('\n💡 See configuration guide: jap-services-configuration-guide.md')

    } catch (error) {
        console.log('\n❌ TEST FAILED')
        console.log('━'.repeat(80))
        console.error('Error:', error instanceof Error ? error.message : error)
        console.log('\n💡 Troubleshooting:')
        console.log('1. Verify your API Key is correct (no extra spaces)')
        console.log('2. Check that your JAP account is active')
        console.log('3. Verify the API URL is correct')
        console.log('4. Contact JAP support if the issue persists')
        process.exit(1)
    }
}

// Run the test
testJapApiKey()
    .then(() => {
        console.log('\n✅ Test completed successfully!')
        process.exit(0)
    })
    .catch((error) => {
        console.error('\n❌ Test failed:', error)
        process.exit(1)
    })
