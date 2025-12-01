# Instagram Profile Analyzer - RapidAPI Integration Guide

## Overview
The Profile Analyzer component uses Instagram's public data to create personalized user experiences. This guide explains how to integrate a real Instagram scraping API.

## Current Status
✅ Component structure complete
✅ API route created (`/api/instagram/profile`)
✅ Service layer implemented
⏳ **Pending**: RapidAPI integration

## Step-by-Step Integration

### 1. Choose an API Provider

**Recommended Option: RapidAPI**

Visit [RapidAPI Hub](https://rapidapi.com/hub) and search for:
- "Instagram Profile Scraper"
- "Instagram Public Data"
- "RocketAPI Instagram"

**Top Recommendations:**
1. **Instagram Scraper API** - Most reliable
2. **RocketAPI** - Fast and accurate
3. **Instagram Public Data Scraper** - Budget-friendly

### 2. Get Your API Key

1. Sign up at [RapidAPI](https://rapidapi.com)
2. Subscribe to your chosen API (most have free tiers)
3. Copy your `X-RapidAPI-Key` from the dashboard

### 3. Add Environment Variables

Create/update `.env.local`:

```bash
# RapidAPI Configuration
RAPIDAPI_KEY=your_rapidapi_key_here
RAPIDAPI_HOST=instagram-scraper-api2.p.rapidapi.com
INSTAGRAM_API_URL=https://instagram-scraper-api2.p.rapidapi.com
```

### 4. Update the Service

Open `lib/services/instagram-scraper.ts` and uncomment the real API call:

```typescript
const response = await fetch(`${this.baseUrl}/profile/${cleanUsername}`, {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': this.apiKey,
    'X-RapidAPI-Host': 'instagram-scraper-api2.p.rapidapi.com'
  }
})

if (!response.ok) {
  throw new Error('Failed to fetch profile')
}

const data = await response.json()

return {
  username: data.username,
  fullName: data.full_name,

```json
{
  "username": "example",
  "full_name": "Example User",
  "biography": "Bio text",
  "profile_pic_url": "https://...",
  "edge_followed_by": { "count": 1000 },
  "edge_follow": { "count": 500 },
  "edge_owner_to_timeline_media": { "count": 50 },
  "is_verified": false,
  "is_private": false
}
```

## Cost Considerations

**Free Tier Limits** (typical):
- 100-500 requests/month
- 1-2 requests/second

**Paid Plans**:
- $10-30/month for 10,000-50,000 requests
- Sufficient for most SMM platforms

## Alternative: Apify

If RapidAPI doesn't work, try [Apify](https://apify.com):

```typescript
const response = await fetch('https://api.apify.com/v2/acts/apify~instagram-profile-scraper/runs', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.APIFY_TOKEN}`
  },
  body: JSON.stringify({
    usernames: [cleanUsername]
  })
})
```

## Security Notes

⚠️ **Important**:
- Never expose API keys in frontend code
- Always use server-side API routes
- Implement rate limiting
- Cache results to reduce API calls

## Next Steps

1. Sign up for RapidAPI
2. Add credentials to `.env.local`
3. Update `instagram-scraper.ts`
4. Test with real usernames
5. Monitor usage and costs

---

**Need Help?** Check the RapidAPI documentation for your chosen provider or contact support.
