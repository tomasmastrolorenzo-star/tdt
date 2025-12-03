import { japClient } from '../lib/services/jap'
import {
    instagramFollowersPackages,
    tiktokFollowersPackages,
    youtubeSubscribersPackages
} from '../lib/trend-up/packages'

/**
 * Script to sync and verify JAP services configuration
 * This helps ensure that all service IDs in packages.ts match actual JAP services
 */

async function syncJapServices() {
    console.log('🔄 Fetching services from JAP...\n')

    try {
        // Get all available services from JAP
        const japServices = await japClient.getServices()
        console.log(`✅ Found ${japServices.length} services in JAP\n`)

        // Check Instagram services
        console.log('📱 INSTAGRAM FOLLOWERS:')
        console.log('━'.repeat(80))
        for (const pkg of instagramFollowersPackages) {
            const japService = japServices.find(s => s.service === pkg.japServiceId)
            if (japService) {
                console.log(`✅ ${pkg.name} (ID: ${pkg.japServiceId})`)
                console.log(`   JAP Name: ${japService.name}`)
                console.log(`   JAP Rate: $${japService.rate} | Your Price: $${pkg.price}`)
                console.log(`   Margin: $${(pkg.price - parseFloat(japService.rate)).toFixed(2)} (${((pkg.price - parseFloat(japService.rate)) / pkg.price * 100).toFixed(1)}%)`)
                console.log(`   Min/Max: ${japService.min} - ${japService.max}`)
            } else {
                console.log(`❌ ${pkg.name} (ID: ${pkg.japServiceId}) - NOT FOUND IN JAP`)
            }
            console.log('')
        }

        // Check TikTok services
        console.log('\n🎵 TIKTOK FOLLOWERS:')
        console.log('━'.repeat(80))
        for (const pkg of tiktokFollowersPackages) {
            const japService = japServices.find(s => s.service === pkg.japServiceId)
            if (japService) {
                console.log(`✅ ${pkg.name} (ID: ${pkg.japServiceId})`)
                console.log(`   JAP Name: ${japService.name}`)
                console.log(`   JAP Rate: $${japService.rate} | Your Price: $${pkg.price}`)
                console.log(`   Margin: $${(pkg.price - parseFloat(japService.rate)).toFixed(2)} (${((pkg.price - parseFloat(japService.rate)) / pkg.price * 100).toFixed(1)}%)`)
                console.log(`   Min/Max: ${japService.min} - ${japService.max}`)
            } else {
                console.log(`❌ ${pkg.name} (ID: ${pkg.japServiceId}) - NOT FOUND IN JAP`)
            }
            console.log('')
        }

        // Check YouTube services
        console.log('\n📺 YOUTUBE SUBSCRIBERS:')
        console.log('━'.repeat(80))
        for (const pkg of youtubeSubscribersPackages) {
            const japService = japServices.find(s => s.service === pkg.japServiceId)
            if (japService) {
                console.log(`✅ ${pkg.name} (ID: ${pkg.japServiceId})`)
                console.log(`   JAP Name: ${japService.name}`)
                console.log(`   JAP Rate: $${japService.rate} | Your Price: $${pkg.price}`)
                console.log(`   Margin: $${(pkg.price - parseFloat(japService.rate)).toFixed(2)} (${((pkg.price - parseFloat(japService.rate)) / pkg.price * 100).toFixed(1)}%)`)
                console.log(`   Min/Max: ${japService.min} - ${japService.max}`)
            } else {
                console.log(`❌ ${pkg.name} (ID: ${pkg.japServiceId}) - NOT FOUND IN JAP`)
            }
            console.log('')
        }

        // Check balance
        console.log('\n💰 JAP ACCOUNT BALANCE:')
        console.log('━'.repeat(80))
        const balance = await japClient.getBalance()
        console.log(`Balance: ${balance.currency} ${balance.balance}`)
        console.log('')

        // Summary
        const allPackages = [
            ...instagramFollowersPackages,
            ...tiktokFollowersPackages,
            ...youtubeSubscribersPackages
        ]
        const foundServices = allPackages.filter(pkg =>
            japServices.find(s => s.service === pkg.japServiceId)
        )
        const missingServices = allPackages.filter(pkg =>
            !japServices.find(s => s.service === pkg.japServiceId)
        )

        console.log('\n📊 SUMMARY:')
        console.log('━'.repeat(80))
        console.log(`Total packages configured: ${allPackages.length}`)
        console.log(`✅ Found in JAP: ${foundServices.length}`)
        console.log(`❌ Missing in JAP: ${missingServices.length}`)

        if (missingServices.length > 0) {
            console.log('\n⚠️  MISSING SERVICE IDs:')
            missingServices.forEach(pkg => {
                console.log(`   - ${pkg.name}: ${pkg.japServiceId}`)
            })
            console.log('\n💡 You need to configure these service IDs in your JAP admin panel')
        }

    } catch (error) {
        console.error('❌ Error syncing JAP services:', error)
        process.exit(1)
    }
}

// Run the sync
syncJapServices()
    .then(() => {
        console.log('\n✅ Sync completed successfully!')
        process.exit(0)
    })
    .catch((error) => {
        console.error('\n❌ Sync failed:', error)
        process.exit(1)
    })
