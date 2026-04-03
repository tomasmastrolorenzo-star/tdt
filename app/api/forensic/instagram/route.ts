import { NextResponse } from 'next/server';
import { ApifyClient } from 'apify-client';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const maxDuration = 60; // Allow Vercel to wait up to 60 seconds for Apify

export async function POST(req: Request) {
  try {
    const { handle } = await req.json();

    if (!handle) {
      return NextResponse.json({ error: 'Instagram handle is required' }, { status: 400 });
    }

    const cleanHandle = handle.replace('@', '').trim();

    // 1. Initialise Apify
    const APIFY_TOKEN = process.env.APIFY_API_TOKEN;
    if (!APIFY_TOKEN) {
      throw new Error("Missing APIFY_API_TOKEN environment variable");
    }

    const client = new ApifyClient({ token: APIFY_TOKEN });

    // 2. Call Instagram Profile Scraper (using lightweight fast scraper)
    // Using apify/instagram-profile-scraper or similar. We use the robust apify/instagram-scraper for profiles.
    const run = await client.actor("apify/instagram-scraper").call({
      addParentData: false,
      directUrls: [`https://www.instagram.com/${cleanHandle}/`],
      enhanceUserSearchWithFacebookPage: false,
      isUserTaggedFeedURL: false,
      resultsLimit: 1,
      resultsType: "details",
      searchLimit: 1,
      searchType: "hashtag"
    });

    // 3. Fetch Data
    const { items } = await client.dataset(run.defaultDatasetId).listItems();
    
    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Profile not found or private." }, { status: 404 });
    }

    const profileData = items[0] as any;

    // 4. Normalization (The previously broken step fixed)
    const normalizedData = {
      handle: profileData.username,
      followers: profileData.followersCount || 0,
      following: profileData.followsCount || 0,
      posts: profileData.postsCount || 0,
      isPrivate: profileData.isPrivate || false,
      biography: profileData.biography || "",
      verified: profileData.isVerified || false,
      profilePic: profileData.profilePicUrl || "",
      // Basic AI heuristic inference variables
      engagement_proxy: profileData.latestPosts ? 
        profileData.latestPosts.reduce((acc: number, p: any) => acc + (p.likesCount || 0) + (p.commentsCount || 0), 0) / (profileData.latestPosts.length || 1) 
        : 0
    };

    return NextResponse.json({ success: true, data: normalizedData });

  } catch (error: any) {
    console.error('Apify Forensic Error:', error);
    return NextResponse.json({ error: error.message || 'Internal screening failure' }, { status: 500 });
  }
}
