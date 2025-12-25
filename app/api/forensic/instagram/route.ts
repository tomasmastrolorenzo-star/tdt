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

        const runResponse = await fetch(`https://api.apify.com/v2/acts/apify~instagram-profile-scraper/run-sync-get-dataset-items?token=${apifyToken}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                usernames: [normalizedHandle],
                proxy: {
                    useApifyProxy: true
                }
            })
        });


        if (!runResponse.ok) {
            console.error(`[APIFY_ERROR] Status: ${runResponse.status}`);
            return NextResponse.json({ status: 'restricted', message: 'Visual data under forensic verification protocol.' });
        }

        const items = await runResponse.json();

        // 3. VALIDATE DATA
        if (!items || items.length === 0) {
            console.warn(`[APIFY_EMPTY] No data found for ${normalizedHandle}`);
            return NextResponse.json({ status: 'restricted', message: 'Asset not visible to public scanner.' });
        }

        // 4. NORMALIZATION (Adapter for Profile Scraper)
        let profile = null;
        let posts: any[] = [];

        // Check format A: Array of Posts (items[0] is a post)
        if (items[0].ownerUsername || items[0].owner) {
            const first = items[0];
            profile = {
                username: first.ownerUsername || first.owner?.username || normalizedHandle,
                profilePicUrl: first.ownerProfilePicUrl || first.owner?.profile_pic_url,
                biography: first.owner?.biography || ""
            };
            posts = items;
        }
        // Check format B: Single Profile Object (items[0] IS the profile)
        else if (items[0].username) {
            const p = items[0];
            profile = {
                username: p.username,
                profilePicUrl: p.profilePicUrl || p.profilePicUrlHD,
                biography: p.biography
            };
            // Profile scraper sometimes creates a child dataset for posts, OR puts them in latestPosts
            posts = p.latestPosts || [];
        }

        if (!profile) {
            // Fallback: assume first item is relevant if it has an image
            console.warn("[APIFY_STRUCT] Unknown structure, attempting force-read.");
            const p = items[0];
            profile = {
                username: normalizedHandle,
                profilePicUrl: p.displayUrl || p.images?.[0] || null,
                biography: "Visual vectors extracted."
            };
            posts = items;
        }

        const normalizedData = {
            username: profile.username || normalizedHandle,
            profilePicUrl: profile.profilePicUrl || null,
            biography: profile.biography || "",

            posts: posts.slice(0, 9).map((p: any) => ({
                id: p.id || Math.random().toString(),
                imageUrl: p.displayUrl || p.url || p.images?.[0],
                caption: p.caption || "",
                timestamp: p.timestamp ? new Date(p.timestamp).getTime() : Date.now()
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
