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
                biography: first.owner?.biography || "",
                externalUrl: first.owner?.external_url || first.externalUrl || null
            };
            posts = items;
        }
        // Check format B: Single Profile Object (items[0] IS the profile)
        else if (items[0].username) {
            const p = items[0];
            profile = {
                username: p.username,
                profilePicUrl: p.profilePicUrl || p.profilePicUrlHD,
                biography: p.biography,
                externalUrl: p.externalUrl || p.externalUrlShimmed || null
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
                biography: "Visual vectors extracted.",
                externalUrl: null
            };
            posts = items;
        }

        const normalizedPosts = posts.slice(0, 9).map((p: any) => ({
            id: p.id || Math.random().toString(),
            imageUrl: p.displayUrl || p.url || p.images?.[0],
            caption: p.caption || "",
            timestamp: p.timestamp ? new Date(p.timestamp).getTime() : Date.now()
        }));

        const normalizedData = {
            username: profile.username || normalizedHandle,
            profilePicUrl: profile.profilePicUrl || null,
            biography: profile.biography || "",
            posts: normalizedPosts
        };

        // --- FORENSIC LOGIC ENGINE ---

        // Keywords / Signals
        const NICHE_KEYWORDS = ['marketing', 'real estate', 'inmobiliaria', 'cirugia', 'surgeon', 'fitness', 'coach', 'consultor', 'agency', 'agencia', 'b2b', 'high ticket', 'inversiones', 'crypto', 'ecommerce', 'dropshipping', 'mentoria', 'negocio', 'growth'];
        const CTA_KEYWORDS = ['link', 'bio', 'dm', 'mensaje', 'clase', 'agendar', 'agenda', 'reserva', 'comprar', 'acceder', 'registro', 'ignite', 'apply', 'aplicar', 'click', 'info'];
        const PREMIUM_KEYWORDS = ['luxury', '7 figures', '7 cifras', 'cifr', 'millon', 'highticket', 'premium', 'exclusive', 'elite', 'ceo', 'founder', 'dueño', 'propietario', 'autoridad', 'líder', 'top 1%', 'global'];
        const AUTHORITY_KEYWORDS = ['casos', 'case study', 'resultados', 'testimonio', 'cliente', 'student', 'estudiante', 'exito', 'award', 'premio', 'prensa', 'forbes', 'tedx', 'conferencia'];

        // 1. Posicionamiento (1-10)
        let posScore = 3;
        const bioLower = (profile.biography || '').toLowerCase();
        const hasNiche = NICHE_KEYWORDS.some(k => bioLower.includes(k));
        const hasLink = !!profile.externalUrl;
        if (hasNiche) posScore += 3;
        if (hasLink) posScore += 2;
        if (hasLink && hasNiche && bioLower.length > 30) posScore += 2;
        posScore = Math.min(10, posScore);

        // 2. Intencion Comercial (1-10)
        let ctaCount = 0;
        normalizedPosts.forEach(p => {
            const cap = (p.caption || '').toLowerCase();
            if (CTA_KEYWORDS.some(k => cap.includes(k))) ctaCount++;
        });
        const bioHasCTA = CTA_KEYWORDS.some(k => bioLower.includes(k)) || hasLink; // Link implies commercial intent usually.
        let intentScore = 3;
        if (bioHasCTA) intentScore += 2;
        const ctaRatio = normalizedPosts.length > 0 ? ctaCount / normalizedPosts.length : 0;
        if (ctaRatio > 0.1) intentScore += 2;
        if (ctaRatio >= 0.3) intentScore += 3;
        intentScore = Math.min(10, intentScore);

        // 3. Coherencia Tematica (1-10) - (Proxy: Niche Keyword Consistency)
        let nichePostCount = 0;
        if (hasNiche) {
            normalizedPosts.forEach(p => {
                if (NICHE_KEYWORDS.some(k => (p.caption || '').toLowerCase().includes(k))) nichePostCount++;
            });
        }
        const consistencyRatio = normalizedPosts.length > 0 ? nichePostCount / normalizedPosts.length : 0;
        let cohScore = 4;
        if (consistencyRatio > 0.2) cohScore = 6;
        if (consistencyRatio > 0.5) cohScore = 9;

        // 4. Consistencia Operativa (1-10) - (Posts Frequency)
        let opScore = 2;
        if (normalizedPosts.length >= 2) {
            const newest = normalizedPosts[0].timestamp;
            const oldest = normalizedPosts[normalizedPosts.length - 1].timestamp;
            const diffDays = Math.max(1, (newest - oldest) / (1000 * 60 * 60 * 24));
            const diffWeeks = diffDays / 7;

            if (diffWeeks > 0) {
                const freq = normalizedPosts.length / diffWeeks;
                if (freq >= 1) opScore = 6;
                if (freq >= 3) opScore = 9;
            } else {
                opScore = 5;
            }
        }

        // 5. Brecha Aspiracional (1-10) - (High Income Claim vs Low Proof)
        const hasPremium = PREMIUM_KEYWORDS.some(k => bioLower.includes(k));
        let authorityPostCount = 0;
        normalizedPosts.forEach(p => {
            if (AUTHORITY_KEYWORDS.some(k => (p.caption || '').toLowerCase().includes(k))) authorityPostCount++;
        });
        const authorityRatio = normalizedPosts.length > 0 ? authorityPostCount / normalizedPosts.length : 0;

        let gapScore = 2;
        if (hasPremium) {
            gapScore = 5;
            if (authorityRatio < 0.2) gapScore = 9; // High Gap (Good Lead)
            else gapScore = 4; // Low Gap (Has proof)
        }

        const indicators = {
            posicionamiento: posScore,
            intencion_comercial: intentScore,
            coherencia: cohScore,
            consistencia: opScore,
            brecha_aspiracional: gapScore
        };

        // Classification Logic
        let altos = 0;
        let medios = 0;
        Object.values(indicators).forEach(v => {
            if (v >= 8) altos++;
            else if (v >= 5) medios++;
        });

        let ticketClass = "LOW_TICKET";
        if (altos >= 3) ticketClass = "HIGH_TICKET";
        else if (medios >= 3 || altos >= 1) ticketClass = "MEDIUM_TICKET";

        const impact = {
            credibilidad: posScore > 7 ? "ALTO" : (posScore > 4 ? "MEDIO" : "BAJO"),
            conversion: intentScore > 7 ? "ALTO" : (intentScore > 4 ? "MEDIO" : "BAJO"),
            complejidad: cohScore > 7 ? "ESTRUCTURADA" : (cohScore > 4 ? "SIMPLE" : "COMPLEJA")
        };

        const analysisResult = {
            indicators,
            impact,
            ticket_class: ticketClass
        };

        // 5. CACHE & RETURN
        const finalPayload = { ...normalizedData, ...analysisResult };

        CACHE.set(normalizedHandle, { data: finalPayload, timestamp: Date.now() });
        return NextResponse.json(finalPayload);

    } catch (e) {
        console.error("[FORENSIC_FAILURE]", e);
        return NextResponse.json({
            status: 'restricted',
            message: 'Visual data under forensic verification protocol.',
            debug: e instanceof Error ? e.message : String(e)
        });
    }
}
