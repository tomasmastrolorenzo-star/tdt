import { NextRequest, NextResponse } from "next/server"
import { japClient } from "@/lib/services/jap"
import { mockJapClient } from "@/lib/services/jap-mock"

export async function GET(request: NextRequest) {
    try {
        // Check if API Key is configured
        const apiKey = process.env.JAP_API_KEY
        const useMock = !apiKey || apiKey === 'your_jap_api_key_here'

        // Use mock client if API Key is not configured
        const client = useMock ? mockJapClient : japClient

        if (useMock) {
            console.warn('⚠️  Using MOCK JAP client - API Key not configured')
            console.warn('📝 Configure JAP_API_KEY in .env.local to use real data')
        }

        // Fetch services from JAP (or mock)
        const services = await client.getServices()

        // Fetch balance
        const balance = await client.getBalance()

        return NextResponse.json({
            success: true,
            services,
            balance,
            isMock: useMock,
            timestamp: new Date().toISOString()
        })
    } catch (error) {
        console.error("Error fetching JAP services:", error)

        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : "Failed to fetch JAP services",
                services: [],
                balance: null,
                isMock: false
            },
            { status: 500 }
        )
    }
}
