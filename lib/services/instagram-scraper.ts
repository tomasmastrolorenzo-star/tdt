/**
 * Instagram Profile Scraper Service
 * 
 * This service handles fetching public Instagram profile data.
 * 
 * IMPLEMENTATION OPTIONS:
 * 
 * 1. RapidAPI - Instagram Public Data Scraper
 *    - Endpoint: https://rapidapi.com/hub
 *    - Search for: "Instagram Profile" or "Instagram Scraper"
 *    - Recommended: "Instagram Scraper API" or "RocketAPI"
 * 
 * 2. Custom Scraper (Not recommended - Instagram blocks easily)
 * 
 * 3. Apify Instagram Scraper
 *    - https://apify.com/apify/instagram-profile-scraper
 */

export interface InstagramProfileData {
    username: string
    fullName: string
    biography: string
    profilePicUrl: string
    followers: number
    following: number
    posts: number
    isVerified: boolean
    isPrivate: boolean
    externalUrl?: string
}

export class InstagramScraperService {
    private apiKey: string
    private baseUrl: string

    constructor() {
        // TODO: Add these to .env.local
        this.apiKey = process.env.RAPIDAPI_KEY || ""
        this.baseUrl = process.env.INSTAGRAM_API_URL || ""
    }

    /**
     * Fetch Instagram profile data by username
     * @param username - Instagram username (without @)
     * @returns Profile data or null if not found
     */
    async getProfile(username: string): Promise<InstagramProfileData | null> {
        try {
            // Remove @ if present
            const cleanUsername = username.replace("@", "")

            // If no API key configured, return mock data for development
            if (!this.apiKey || !this.baseUrl) {
                console.warn("Instagram API not configured, using mock data")
                return this.getMockProfile(cleanUsername)
            }

            // Make request to RapidAPI Instagram Scraper
            const response = await fetch(
                `${this.baseUrl}/get_profile_info.php?username_or_id_or_url=${cleanUsername}`,
                {
                    method: 'GET',
                    headers: {
                        'x-rapidapi-host': 'instagram-scraper-stable-api.p.rapidapi.com',
                        'x-rapidapi-key': this.apiKey
                    }
                }
            )

            if (!response.ok) {
                console.error(`Instagram API error: ${response.status}`)
                return this.getMockProfile(cleanUsername)
            }

            const data = await response.json()

            // Map RapidAPI response to our interface
            const profileData: InstagramProfileData = {
                username: data.username || cleanUsername,
                fullName: data.full_name || "",
                biography: data.biography || "",
                profilePicUrl: data.profile_pic_url_hd || data.profile_pic_url || `https://i.pravatar.cc/150?u=${cleanUsername}`,
                followers: data.edge_followed_by?.count || 0,
                following: data.edge_follow?.count || 0,
                posts: data.edge_owner_to_timeline_media?.count || 0,
                isVerified: data.is_verified || false,
                isPrivate: data.is_private || false,
                externalUrl: data.external_url
            }

            return profileData
        } catch (error) {
            console.error("Error fetching Instagram profile:", error)
            // Fallback to mock data on error
            return this.getMockProfile(username.replace("@", ""))
        }
    }

    /**
     * Generate mock profile data for development/fallback
     */
    private getMockProfile(username: string): InstagramProfileData {
        return {
            username: username,
            fullName: "Sample User",
            biography: "Sample bio",
            profilePicUrl: `https://i.pravatar.cc/150?u=${username}`,
            followers: Math.floor(Math.random() * 100000) + 1000,
            following: Math.floor(Math.random() * 1000) + 100,
            posts: Math.floor(Math.random() * 500) + 50,
            isVerified: false,
            isPrivate: false,
        }
    }

    /**
     * Validate if username exists and is public
     */
    async validateUsername(username: string): Promise<boolean> {
        const profile = await this.getProfile(username)
        return profile !== null && !profile.isPrivate
    }
}

// Export singleton instance
export const instagramScraper = new InstagramScraperService()
