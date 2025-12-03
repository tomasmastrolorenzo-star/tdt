/**
 * Test script for Instagram API (RapidAPI) integration
 * Run this after configuring RAPIDAPI_KEY in .env.local
 */

import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import { instagramScraper } from "../lib/services/instagram-scraper"

async function testInstagramApi() {
    console.log('📸 Testing Instagram API Integration...\n')

    // Get credentials from environment
    // const apiKey = process.env.RAPIDAPI_KEY
    const apiKey = "b3f8d26681msh591240419c64bfbp149aedjsn0b86a8fd85b2"
    const apiUrl = process.env.INSTAGRAM_API_URL || "https://instagram-scraper-stable-api.p.rapidapi.com"

    // Check if credentials are configured
    if (!apiKey || apiKey === 'your_rapidapi_key_here') {
        console.log('❌ ERROR: RAPIDAPI_KEY not configured')
        console.log('\n📝 Steps to fix:')
        console.log('1. Get your API Key from RapidAPI')
        console.log('2. Edit .env.local and set RAPIDAPI_KEY')
        process.exit(1)
    }

    console.log('✅ Credentials found in environment')
    console.log(`🔑 API Key: ${apiKey.substring(0, 10)}...`)
    console.log(`🌐 API URL: ${apiUrl}\n`)

    try {
        // Test with a known public profile (e.g., instagram)
        const testUsername = "instagram"
        console.log(`🔍 Fetching profile for @${testUsername}...`)

        // Manually inject key for testing if env var fails
        // @ts-ignore
        instagramScraper.apiKey = apiKey

        const profile = await instagramScraper.getProfile(testUsername)

        if (!profile) {
            throw new Error("Profile not found or API error")
        }

        console.log('\n✅ Profile fetched successfully!')
        console.log('━'.repeat(50))
        console.log(`👤 Username: ${profile.username}`)
        console.log(`📛 Full Name: ${profile.fullName}`)
        console.log(`📝 Bio: ${profile.biography.substring(0, 50)}...`)
        console.log(`👥 Followers: ${profile.followers.toLocaleString()}`)
        console.log(`👀 Following: ${profile.following.toLocaleString()}`)
        console.log(`📸 Posts: ${profile.posts.toLocaleString()}`)
        console.log(`✅ Verified: ${profile.isVerified ? 'Yes' : 'No'}`)
        console.log(`🔒 Private: ${profile.isPrivate ? 'Yes' : 'No'}`)
        console.log('━'.repeat(50))

        // Verify data looks real (not mock)
        if (profile.followers < 1000000) {
            console.warn('\n⚠️ WARNING: Follower count seems low for @instagram. Are you using mock data?')
        } else {
            console.log('\n✨ Data looks REAL (High follower count confirmed)')
        }

    } catch (error) {
        console.log('\n❌ TEST FAILED')
        console.log('━'.repeat(50))
        console.error('Error:', error instanceof Error ? error.message : error)
        console.log('\n💡 Troubleshooting:')
        console.log('1. Check if your RapidAPI Key is valid')
        console.log('2. Check if you have subscribed to the API plan (Basic is free)')
        console.log('3. Check your internet connection')
        process.exit(1)
    }
}

// Run the test
testInstagramApi()
    .then(() => {
        console.log('\n✅ Test completed successfully!')
        process.exit(0)
    })
    .catch((error) => {
        console.error('\n❌ Test failed:', error)
        process.exit(1)
    })
