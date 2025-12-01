import { NextRequest, NextResponse } from "next/server"
import { instagramScraper } from "@/lib/services/instagram-scraper"

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const username = searchParams.get("username")

        if (!username) {
            return NextResponse.json(
                { error: "Username is required" },
                { status: 400 }
            )
        }

        const profile = await instagramScraper.getProfile(username)

        if (!profile) {
            return NextResponse.json(
                { error: "Profile not found or is private" },
                { status: 404 }
            )
        }

        return NextResponse.json(profile)
    } catch (error) {
        console.error("API Error:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
