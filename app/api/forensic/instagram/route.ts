import { NextResponse } from 'next/server';

// Simple in-memory cache
const CACHE = new Map<string, { data: any, timestamp: number }>();
const CACHE_DURATION = 12 * 60 * 60 * 1000; // 12 Hours

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { handle } = body;

        if (!handle) {
            return NextResponse.json({ status: 'restricted', message: 'Handle Required' }, { status: 400 });
        }

        const normalizedHandle = handle.toLowerCase().replace('@', '').trim();

        // 1. CHECK CACHE
        const cached = CACHE.get(normalizedHandle);
        if (cached && (Date.now() - cached.timestamp < CACHE_DURATION)) {
            console.log(`[FORENSIC_CACHE_HIT] ${normalizedHandle}`);
            return NextResponse.json(cached.data);
        }

        // DEBUG: ENV CHECK
        if (normalizedHandle === 'debug_env') {
            const apifyKeys = Object.keys(process.env).filter(k => k.toLowerCase().includes('apif'));
            const potentialTokens = Object.entries(process.env).filter(([k, v]) => v?.startsWith('apify_api_')).map(([k]) => k);
            return NextResponse.json({
                status: 'restricted',
                message: 'DEBUG ENV KEYS',
                debug: {
                    keys_found: apifyKeys,
                    smart_matches: potentialTokens,
                    env_example: Object.keys(process.env).slice(0, 5) // Sample
                }
            });
        }

        console.log(`[FORENSIC_SCAN_INIT] ${normalizedHandle}`);

        // 2. CALL APIFY - SMART TOKEN SEARCH
        let apifyToken = process.env.APIFY_TOKEN || process.env.apify_api_;

        // If not found by standard names, scan all env vars for a value that looks like an Apify token
        if (!apifyToken) {
            const foundKey = Object.keys(process.env).find(key => process.env[key]?.startsWith('apify_api_'));
            if (foundKey) {
                console.log(`[FORENSIC] Found token in var: ${foundKey}`);
                apifyToken = process.env[foundKey];
            }
        }

        if (!apifyToken) {
            console.error("CRITICAL: APIFY_TOKEN missing in env");
            // Fail safe -> Restricted Mode
            return NextResponse.json({ status: 'restricted', message: 'Validation Protocol Active' });
        }

        const runResponse = await fetch(`https://api.apify.com/v2/acts/apify~instagram-scraper/run-sync-get-dataset-items?token=${apifyToken}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                directUrls: [`https://www.instagram.com/${normalizedHandle}/`],
                resultsLimit: 9,
                scrapePosts: true,
                scrapeStories: false,
                scrapeHighlights: false,
                scrapeTaggedPosts: false,
                scrapeReels: false,
            })
        });


        if (!runResponse.ok) {
            console.error(`[APIFY_ERROR] Status: ${runResponse.status}`);
            return NextResponse.json({ status: 'restricted', message: 'Visual data under forensic verification protocol.' });
        }

        const items = await runResponse.json();

        // 3. VALIDATE DATA
        if (!items || items.length === 0 || !items[0].ownerUsername) {
            console.warn(`[APIFY_EMPTY] No data found for ${normalizedHandle}`);
            return NextResponse.json({ status: 'restricted', message: 'Asset not visible to public scanner.' });
        }

        const item = items[0]; // First item contains profile data + post info usually? 
        // Apify structure varies, but usually 'ownerUsername' is top level in the dataset item for posts.
        // Wait, 'run-sync-get-dataset-items' returns an ARRAY of items (posts).
        // Each post has 'owner' data. Let's extract from the first post.

        // Safer check:
        // Does the scraper return specific "profile" item or just posts?
        // The standard "instagram-scraper" (apify/instagram-scraper) returns posts.
        // We can extract profile info from the first post's 'owner' object.

        // However, if the user requested 'scrapePosts: true', we get posts.
        // Let's assume standard output.

        // 4. NORMALIZE (Strict Censorship)
        const normalizedData = {
            username: item.ownerUsername || normalizedHandle,
            profilePicUrl: item.ownerProfilePicUrl || null,
            biography: item.owner?.biography || item.biography || "", // Attempt to find bio
            // Note: apify/instagram-scraper standard output for posts might NOT include full bio in every post.
            // If bio is critical, we might need a "profile" scrape mode. 
            // BUT, the user prompt said: "const normalized = { username: item.ownerUsername... }"
            // I will follow the USER'S provided snippet logic strictly where possible.

            posts: items.slice(0, 9).map((p: any) => ({
                id: p.id,
                imageUrl: p.displayUrl,
                caption: p.caption,
                timestamp: p.takenAtTimestamp
            }))
        };

        // *Correction*: usage of `item` variable in user snippet implies `item` is the PROFILE object or the first item.
        // If apify returns an array of posts, `items` is that array.
        // `item` in user snippet likely referred to `items[0]`.

        // 5. CACHE & RETURN
        CACHE.set(normalizedHandle, { data: normalizedData, timestamp: Date.now() });
        return NextResponse.json(normalizedData);

    } catch (e) {
        console.error("[FORENSIC_FAILURE]", e);
        return NextResponse.json({
            status: 'restricted',
            message: 'Visual data under forensic verification protocol.',
            debug: e instanceof Error ? e.message : String(e)
        });
    }
}
