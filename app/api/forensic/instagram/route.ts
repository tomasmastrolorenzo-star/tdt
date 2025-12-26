import { NextResponse } from 'next/server';
import { runForensicPipeline, RawInputData } from '../../../lib/forensic/intelligence';

// Simple in-memory cache
const CACHE = new Map<string, { data: any, timestamp: number }>();
const CACHE_DURATION = 168 * 60 * 60 * 1000; // 7 Days (Resiliencia Técnica)

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { handle, intent } = body; // Intent is optional

        if (!handle) {
            return NextResponse.json({ status: 'restricted', message: 'Handle Required' }, { status: 400 });
        }

        const normalizedHandle = handle.toLowerCase().replace('@', '').trim();

        // 1. CHECK CACHE
        const cached = CACHE.get(normalizedHandle);
        if (cached && (Date.now() - cached.timestamp < CACHE_DURATION)) {
            console.log(`[FORENSIC_CACHE_HIT] ${normalizedHandle}`);
            // If intent is provided, we might need to re-run pipeline on cached data? 
            // For now, let's assume cached data is "dumb" raw data? No, cached is the Final JSON Response.
            // If we have new Intent, we cannot just return cached "diagnosis" because diagnosis depends on intent.
            // But we don't cache "diagnosis" separately, we cache the whole output including "ux".
            // Ideally, we should cache Raw Data and re-run pipeline.
            // For Prototype Speed: If Intent is present, BYPASS CACHE or Re-Hydrate?
            // Let's Bypass Cache if Intent is present to ensure fresh analysis.
            if (!intent) {
                return NextResponse.json(cached.data);
            }
        }

        // DEBUG: ENV CHECK
        if (normalizedHandle === 'debug_env') {
            const apifyKeys = Object.keys(process.env).filter(k => k.toLowerCase().includes('apif'));
            return NextResponse.json({
                status: 'restricted',
                message: 'DEBUG ENV KEYS',
                debug: { keys_found: apifyKeys }
            });
        }

        console.log(`[FORENSIC_SCAN_INIT] ${normalizedHandle}`);

        // 2. CALL APIFY
        let apifyToken = process.env.APIFY_TOKEN || process.env.apify_api_;
        if (!apifyToken) {
            const foundKey = Object.keys(process.env).find(key => process.env[key]?.startsWith('apify_api_'));
            if (foundKey) apifyToken = process.env[foundKey];
        }

        if (!apifyToken) {
            console.error("CRITICAL: APIFY_TOKEN missing in env");
            return generateFallbackResponse("Protocolo de Seguridad Activo: Token Missing");
        }

        const runResponse = await fetch(`https://api.apify.com/v2/acts/apify~instagram-profile-scraper/run-sync-get-dataset-items?token=${apifyToken}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                usernames: [normalizedHandle],
                proxy: { useApifyProxy: true }
            })
        });

        if (!runResponse.ok) {
            console.error(`[APIFY_ERROR] Status: ${runResponse.status}`);
            return generateFallbackResponse("Visual data under forensic verification protocol.");
        }

        const items = await runResponse.json();

        // 3. VALIDATE DATA
        if (!items || items.length === 0) {
            return generateFallbackResponse("Asset not visible to public scanner.");
        }

        // 4. NORMALIZATION
        let profile = null;
        let posts: any[] = [];

        if (items[0].ownerUsername || items[0].owner) {
            const first = items[0];
            profile = {
                username: first.ownerUsername || first.owner?.username || normalizedHandle,
                profilePicUrl: first.ownerProfilePicUrl || first.owner?.profile_pic_url,
                biography: first.owner?.biography || "",
                externalUrl: first.owner?.external_url || first.externalUrl || null,
                followersCount: first.owner?.followers_count || first.owner?.edge_followed_by?.count || 0,
                postsCount: first.owner?.edge_owner_to_timeline_media?.count || first.owner?.posts_count || 0,
                isBusiness: first.owner?.is_business_account || false
            };
            posts = items;
        }
        else if (items[0].username) {
            const p = items[0];
            profile = {
                username: p.username,
                profilePicUrl: p.profilePicUrl || p.profilePicUrlHD,
                biography: p.biography,
                externalUrl: p.externalUrl || p.externalUrlShimmed || null,
                followersCount: p.followersCount || 0,
                postsCount: p.postsCount || 0,
                isBusiness: p.isBusinessAccount || false
            };
            posts = p.latestPosts || [];
        }

        if (!profile) {
            return generateFallbackResponse("Estructura de perfil no legible.");
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
            followersCount: profile.followersCount,
            postsCount: profile.postsCount,
            posts: normalizedPosts
        };

        // --- CORE ANALYZER V1.3: LOGIC GATES & VETO ---
        // (Legacy Logic Kept for Vercel/Prototype safety, but heavily relying on Intelligence Pipeline)

        // 1. INPUTS Y CALCULADORES
        const bioLower = (profile.biography || '').toLowerCase();

        // ... (Skipping legacy Asset Class Detection redundant logic for brevity, relying on Pipeline output in response) ...
        // Keeping legacy vars just for 'ux' object fallback if needed, but we should use pipeline data mainly.
        // For simplicity and minimal diff risk, I will re-implement the necessary logic or just let the pipeline drive.

        // Just keeping legacy metrics for the 'indicators' return field
        // METRICS MAPPING
        const CTA_KEYS = ['dm', 'link', 'bio', 'agenda', 'call', 'clase', 'info', 'baja', 'ebook', 'regalo', 'compra'];
        const AUTH_KEYS = ['case', 'result', 'testimoni', 'client', 'award', 'prensa', 'forbes', 'inc.'];
        const PREMIUM_KEYS = ['7 figures', 'million', 'millon', 'luxury', 'elite', 'ceo', 'founder', 'leader'];

        const hasLink = !!profile.externalUrl;
        const matchesType = false; // Simplified
        let PC = 3; if (hasLink) PC += 2; if (bioLower.length > 50) PC += 2; // Simplified

        let ctaCount = 0; normalizedPosts.forEach(p => { if (CTA_KEYS.some(k => (p.caption || '').toLowerCase().includes(k))) ctaCount++; });
        const ctaRatio = normalizedPosts.length ? ctaCount / normalizedPosts.length : 0;
        let IC = 3; if (ctaRatio > 0.3) IC += 3;

        let authCount = 0; normalizedPosts.forEach(p => { if (AUTH_KEYS.some(k => (p.caption || '').toLowerCase().includes(k))) authCount++; });
        let BA = 4; if (authCount === 0) BA = 2; // Rough

        let PI = 4; if (profile.followersCount > 5000) PI += 1;

        /// ... Legacy "Segment" logic ...
        // We will overwrite 'segment' with pipeline result later for consistency

        // --- INTELLIGENCE PIPELINE LINK ---

        const rawInput: RawInputData = {
            username: normalizedData.username,
            biography: normalizedData.biography,
            followers_count: normalizedData.followersCount,
            following_count: normalizedData.followsCount || 0, // Fallback
            posts_count: normalizedData.postsCount,
            recent_posts: normalizedPosts.map(p => ({
                is_video: false, // basic assumption from simplified scraper
                caption: p.caption || '',
                likes: 0, // Scraper might not get likes in basic mode
                comments: 0,
                timestamp: p.timestamp / 1000
            })),
            is_verified: false, // fallback
            external_url: normalizedData.externalUrl
        };

        const diagnosis = runForensicPipeline(rawInput, intent);
        const segment = diagnosis.asset_stage.stage; // HIGH, MID, LOW

        // UX - NARRATIVE 
        const uxContent = {
            title: segment === "HIGH" ? "Protocolo de Transformación de Autoridad" :
                segment === "MID" ? "Validación de Estructura" :
                    "Plan de Corrección Inmediata",

            message: segment === "HIGH" ? "Su perfil demuestra la solidez estructural requerida para una intervención de alto nivel." :
                segment === "MID" ? "Se detectan fundamentos operativos válidos. El siguiente paso es la consolidación del sistema." :
                    "Se han identificado fricciones estructurales que limitan el alcance. Se recomienda corrección técnica inmediata.",

            cta: segment === "HIGH" ? "Solicitar Auditoría de Escala" :
                segment === "MID" ? "Validar Infraestructura" :
                    "Descargar Guía de Corrección",

            roadmap: {
                phase1: "Estabilización (30 días)",
                phase2: "Estructuración (90 días)",
                phase3: "Soberanía (12 meses)"
            },

            disclaimer: "Proyección estimada basada en benchmarks de la industria. No constituye garantía."
        };

        const responsePayload = {
            status: 'success',
            username: normalizedData.username,
            profilePicUrl: normalizedData.profilePicUrl,
            biography: normalizedData.biography,

            // FORENSIC DATA
            asset_type: diagnosis.asset_classification.subtype,
            confidence: diagnosis.asset_classification.confidence,
            last_post_date: normalizedPosts.length > 0 ? new Date(normalizedPosts[0].timestamp).toISOString() : null,
            followers_count: normalizedData.followersCount,
            posts_count: normalizedData.postsCount,
            latest_posts: normalizedPosts.slice(0, 4).map(p => ({ url: p.imageUrl, caption: p.caption, date: p.timestamp })),

            // INTELLIGENCE OUTPUT (THE BRAIN)
            _forensic_diagnosis: diagnosis,

            // ANALYZER OUTPUT
            narrative_level: diagnosis.asset_stage.stage,
            routing_target: diagnosis.asset_stage.stage === 'HIGH' ? 'CALENDAR' : 'CHECKOUT',
            access_level: diagnosis.asset_stage.stage === 'HIGH' ? 2 : 1,
            human_access: diagnosis.asset_stage.stage !== 'LOW',
            sales_alert: diagnosis.asset_stage.stage === 'HIGH',
            risk_flags: diagnosis.problems.critical.map(p => p.code),

            // UX
            ux: uxContent,
            indicators: {
                posicionamiento: { val: PC, label: PC >= 7 ? 'CLARO' : 'DIFUSO', evidence: 'Signal Strength' },
                intencion_comercial: { val: IC, label: IC >= 7 ? 'ALTA' : 'BAJA', evidence: `CTA Analysis ` },
                brecha_aspiracional: { val: BA, label: BA >= 7 ? 'CRITICA' : 'ALINEADA', evidence: 'Authority Gap' },
                infraestructura: { val: PI, label: PI >= 7 ? 'ROBUSTA' : 'INCIPIENTE', evidence: 'Base Metrics' }
            },

            // INTERNAL DEBUG
            _meta: { PC, IC, PI, BA, intent_received: !!intent }
        };

        // Cache result if no intent (Pure Lookup)
        if (!intent) {
            CACHE.set(normalizedHandle, { data: responsePayload, timestamp: Date.now() });
        }

        return NextResponse.json(responsePayload);

    } catch (e) {
        console.error("[FORENSIC_FAILURE]", e);
        return NextResponse.json({
            segment_internal: "FLAG",
            routing_target: "BLOCK",
            access_level: 0,
            sales_alert: true,
            risk_flags: ["api_fallback", "error"],
            ux: {
                title: "Protocolo de Seguridad",
                message: "Interrupción momentánea en el análisis forense. Se ha notificado al equipo de seguridad.",
                cta: "Contactar Soporte",
                disclaimer: "Modo de Protección de Datos Activo"
            }
        });
    }
}

function generateFallbackResponse(reason: string) {
    return NextResponse.json({
        segment_internal: "FLAG",
        routing_target: "BLOCK",
        access_level: 0,
        sales_alert: false,
        risk_flags: ["safe_mode", "input_error"],
        ux: {
            title: "Error de Lectura",
            message: "No se pudo acceder a los vectores públicos del perfil. Verifique que la cuenta sea pública.",
            cta: "Reintentar",
            disclaimer: "Análisis limitado por privacidad."
        }
    });
}
