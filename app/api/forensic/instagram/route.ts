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
            // Return cached data, ensuring it has the latest structure implies we trust the cache or invalidate if structure changed significantly
            // For now, we return as is.
            return NextResponse.json(cached.data);
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

        // FALLBACK IF NO TOKEN
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

        // --- ANALYZER CORE V1.2 ---

        // 1. ENTITY CLASSIFICATION
        const bioLower = (profile.biography || '').toLowerCase();
        let entityType = 'personal';

        const KEYWORDS = {
            specialist: ['founder', 'ceo', 'dueño', 'fundador', 'coach', 'consultor', 'mentor', 'asesor', 'md', 'dr.', 'dra.', 'architect', 'abogado', 'expert', 'especialista'],
            business: ['llc', 'inc', 's.a.', 'shop', 'tienda', 'envios', 'shipping', 'store', 'oficial', 'official', 'marca', 'brand', 'estudio', 'agency', 'agencia'],
            artist: ['artist', 'art', 'music', 'dj', 'producer', 'model', 'modelo', 'actor', 'actriz', 'singer', 'cantante', 'creator', 'creador', 'blog'],
            hybrid: ['personal brand', 'marca personal', 'entrepreneur', 'emprendedor', 'lifestyle']
        };

        if (KEYWORDS.business.some(k => bioLower.includes(k)) || (profile.isBusiness && !KEYWORDS.specialist.some(k => bioLower.includes(k)))) {
            entityType = 'empresa';
        }
        if (KEYWORDS.artist.some(k => bioLower.includes(k))) entityType = 'artista';
        if (KEYWORDS.hybrid.some(k => bioLower.includes(k))) entityType = 'hibrido';
        if (KEYWORDS.specialist.some(k => bioLower.includes(k))) entityType = 'especialista';

        // 2. INDICATORS CORE (1-10)

        // Signals
        const hasLink = !!profile.externalUrl;
        const NICHE_KEYS = ['marketing', 'real estate', 'inmobiliaria', 'cirugia', 'surgeon', 'fit', 'gym', 'crypto', 'invest', 'b2b', 'high ticket', 'growth', 'scale', 'money', 'dinero', 'ventas', 'sales'];
        const hasNiche = NICHE_KEYS.some(k => bioLower.includes(k));

        // A. Posicionamiento
        let scorePos = 3;
        if (hasNiche) scorePos += 3;
        if (hasLink) scorePos += 2;
        if (bioLower.length > 50) scorePos += 2;
        scorePos = Math.min(10, scorePos);

        // B. Intención Comercial
        const CTA_KEYS = ['dm', 'link', 'bio', 'agenda', 'call', 'clase', 'info', 'baja', 'ebook', 'regalo', 'compra'];
        let ctaCount = 0;
        normalizedPosts.forEach(p => { if (CTA_KEYS.some(k => (p.caption || '').toLowerCase().includes(k))) ctaCount++; });
        let scoreIntent = 3;
        if (hasLink && hasNiche) scoreIntent += 2;
        const ctaRatio = normalizedPosts.length ? ctaCount / normalizedPosts.length : 0;
        if (ctaRatio > 0.3) scoreIntent += 3;
        if (ctaRatio > 0.6) scoreIntent += 2;
        scoreIntent = Math.min(10, scoreIntent);

        // C. Coherencia Temática
        let nichePostCount = 0;
        if (hasNiche) {
            normalizedPosts.forEach(p => { if (NICHE_KEYS.some(k => (p.caption || '').toLowerCase().includes(k))) nichePostCount++; });
        }
        let scoreCoh = 4;
        const nicheRatio = normalizedPosts.length ? nichePostCount / normalizedPosts.length : 0;
        if (nicheRatio > 0.3) scoreCoh = 7;
        if (nicheRatio > 0.6) scoreCoh = 9;
        scoreCoh = Math.min(10, scoreCoh);

        // D. Consistencia Operativa
        let scoreOps = 5;
        if (normalizedPosts.length > 1) {
            const days = (normalizedPosts[0].timestamp - normalizedPosts[normalizedPosts.length - 1].timestamp) / (1000 * 3600 * 24);
            const safeDays = Math.max(days, 1);
            const postsPerWeek = normalizedPosts.length / (safeDays / 7);

            if (postsPerWeek < 1) scoreOps = 3;
            else if (postsPerWeek > 3) scoreOps = 9;
            else scoreOps = 6;
        }
        scoreOps = Math.min(10, scoreOps);

        // E. Brecha Aspiracional
        const PREMIUM_KEYS = ['7 figures', 'million', 'millon', 'luxury', 'elite', 'ceo', 'founder', 'leader'];
        const AUTH_KEYS = ['case', 'result', 'testimoni', 'client', 'award', 'prensa', 'forbes', 'inc.'];
        const hasPremium = PREMIUM_KEYS.some(k => bioLower.includes(k));
        let authCount = 0;
        normalizedPosts.forEach(p => { if (AUTH_KEYS.some(k => (p.caption || '').toLowerCase().includes(k))) authCount++; });

        let scoreGap = 5;
        if (hasPremium && authCount === 0) scoreGap = 9;
        else if (hasPremium && authCount > 0) scoreGap = 3;
        else if (!hasPremium && authCount === 0) scoreGap = 2;
        scoreGap = Math.min(10, scoreGap);

        // F. Arquitectura de Autoridad
        let scoreArch = 4;
        if (profile.followersCount > 10000) scoreArch += 2;
        if (profile.followersCount > 100000) scoreArch += 2;
        if (hasLink && bioLower.includes('http')) scoreArch += 1;
        if (profile.postsCount > 100) scoreArch += 1;
        scoreArch = Math.min(10, scoreArch);

        // 4. LOGIC GATES & VETO
        let history = 'estable';
        if (profile.postsCount < 20) history = 'nueva';
        if (profile.postsCount > 300) history = 'consolidada';

        let ticketClass = "LOW_TICKET";
        let flag = null;
        let riskFlags: string[] = [];

        // Risk Flags & Veto
        if (history === 'nueva' && profile.followersCount > 10000) {
            flag = "FLAG_REVIEW";
            riskFlags.push("ANOMALY_GROWTH");
        }
        if (profile.followersCount > 100000) riskFlags.push("EGO_SENSITIVE");
        if (scoreGap > 7) riskFlags.push("VULNERABILITY_HIGH");

        // Classification
        if (scoreGap > 7 && scoreArch < 4) flag = "MEDIUM_TICKET"; // Cap

        if (!flag) {
            if (profile.followersCount > 50000 && scoreIntent < 4) ticketClass = "HIGH_POTENTIAL";
            else if (entityType === 'especialista' && scoreGap > 6) ticketClass = "HIGH_TICKET";
            else if (entityType === 'empresa' && scorePos > 7 && scoreOps < 4) ticketClass = "HIGH_TICKET";
            else if (profile.followersCount > 10000) ticketClass = "MEDIUM_TICKET";
            else ticketClass = "LOW_TICKET";
        } else {
            ticketClass = flag;
        }

        // --- FINAL OUTPUT MAPPING (PHASE 25.7) ---

        // Narrative Level Mappings
        const narrativeMap: any = {
            "LOW_TICKET": "RAPIDO_IMPACTO",
            "MEDIUM_TICKET": "CONSOLIDACION",
            "HIGH_TICKET": "TRANSFORMACION",
            "HIGH_POTENTIAL": "ESCALA_ESTRATEGICA",
            "FLAG_REVIEW": "REVISION_MANUAL" // Fallback narrative
        };

        const routingMap: any = {
            "LOW_TICKET": "CHECKOUT",
            "MEDIUM_TICKET": "APPLICATION", // Was VSL or App
            "HIGH_TICKET": "APPLICATION", // Strict App
            "HIGH_POTENTIAL": "APPLICATION", // Strategic Session
            "FLAG_REVIEW": "WAITLIST"
        };

        let narrativeLevel = narrativeMap[ticketClass] || "CONSOLIDACION";
        let routingTarget = routingMap[ticketClass] || "APPLICATION";
        let humanAccess = (ticketClass === "HIGH_TICKET" || ticketClass === "HIGH_POTENTIAL");
        let salesAlert = (ticketClass === "HIGH_TICKET");

        // Router Content (Narrative Tone)
        let routerContent = {
            title: "Diagnóstico: Impacto Digital",
            message: "Análisis completado.",
            roadmap: { gain: "", foundation: "", transformation: "" }
        };

        if (ticketClass === "LOW_TICKET") {
            routerContent.title = "Protocolo de Rápido Impacto";
            routerContent.message = "La estructura digital actual presenta oportunidades de corrección inmediata en la base de autoridad.";
            routerContent.roadmap = {
                gain: "Alineación de Vectores (7 Días)",
                foundation: "Estructura de Conversión (30 Días)",
                transformation: "Autoridad Percibida (90 Días)"
            };
        } else if (ticketClass === "MEDIUM_TICKET") {
            routerContent.title = "Protocolo de Consolidación";
            routerContent.message = "Tracción detectada. El sistema requiere profesionalizar la captura de valor para escalar.";
            routerContent.roadmap = {
                gain: "Optimización de Embudo (30 Días)",
                foundation: "Sistematización de Contenido (90 Días)",
                transformation: "Liderazgo de Nicho (12 Meses)"
            };
        } else if (ticketClass === "HIGH_TICKET") {
            routerContent.title = "Protocolo de Transformación";
            routerContent.message = "Perfil de alta elegibilidad. Se recomienda intervención profunda para maximizar soberanía de mercado.";
            routerContent.roadmap = {
                gain: "Reingeniería de Autoridad (30 Días)",
                foundation: "Ecosistema de Poder (90 Días)",
                transformation: "Dominio de Categoría (12 Meses)"
            };
        } else if (ticketClass === "HIGH_POTENTIAL") {
            routerContent.title = "Protocolo de Escala Estratégica";
            routerContent.message = "Volumen de audiencia significativo. El riesgo principal es la dilución de marca. Se sugiere refinamiento.";
            routerContent.roadmap = {
                gain: "Monetización de Audiencia (30 Días)",
                foundation: "Creación de Oferta (60 Días)",
                transformation: "Imperio Personal (12 Meses)"
            };
        } else {
            routerContent.title = "Diagnóstico en Proceso";
            routerContent.message = "Patrones complejos detectados. Se ha derivado al equipo de análisis para una revisión contextual.";
            routerContent.roadmap = { gain: "Auditoría (48h)", foundation: "Diagnóstico (72h)", transformation: "Recomendación (7 Días)" };
        }

        // Indicators (No Scores in Label)
        // We keep 'val' for internal frontend logic (charts), but 'label' is narrative.
        const indicators = {
            posicionamiento: { val: scorePos, label: scorePos > 7 ? "CLARO" : "DIFUSO", evidence: hasNiche ? "Keywords de Nicho" : "Bio Genérica" },
            intencion_comercial: { val: scoreIntent, label: scoreIntent > 7 ? "ALTA" : "LATENTE", evidence: ctaRatio > 0.3 ? "CTA Activo" : "Contenido Pasivo" },
            brecha_aspiracional: { val: scoreGap, label: scoreGap > 7 ? "CRÍTICA" : "ALINEADA", evidence: scoreGap > 7 ? "Discurso > Evidencia" : "Evidencia Sólida" },
            arquitectura_autoridad: { val: scoreArch, label: scoreArch > 7 ? "SÓLIDA" : "INCIPIENTE", evidence: profile.followersCount > 10000 ? "Validación Social" : "Estructura Inicial" }
        };

        const finalOutput = {
            // ORIGINAL DATA
            username: profile.username,
            profilePicUrl: profile.profilePicUrl,
            // META INTERNO
            narrative_level: narrativeLevel,
            routing_target: routingTarget,
            human_access: humanAccess,
            sales_alert: salesAlert,
            risk_flags: [...riskFlags, "LEGAL_SAFE"],
            // UX CONTEXT
            ux: {
                title: routerContent.title,
                message: routerContent.message,
                roadmap: routerContent.roadmap,
                disclaimer: "Proyección estimada basada en benchmarks de la industria. No constituye garantía."
            },
            // INDICATORS (For Sequential Reveal)
            indicators: indicators,
            // RAW (Hidden from User Logic, used for Debug)
            _meta: {
                ticket_class: ticketClass,
                entity: entityType,
                history: history
            }
        };

        CACHE.set(normalizedHandle, { data: finalOutput, timestamp: Date.now() });
        return NextResponse.json(finalOutput);

    } catch (e) {
        console.error("[FORENSIC_FAILURE]", e);
        return generateFallbackResponse("Error de conexión seguro. Protocolo Lite activo.");
    }
}

function generateFallbackResponse(reason: string) {
    return NextResponse.json({
        narrative_level: "REVISION_MANUAL",
        routing_target: "WAITLIST",
        human_access: true,
        sales_alert: false,
        risk_flags: ["API_FAIL", "SAFE_MODE"],
        ux: {
            title: "Protocolo de Seguridad",
            message: "No se pudo completar el escaneo automático debido a restricciones de privacidad. Se requiere revisión manual.",
            roadmap: { gain: "Auditoría", foundation: "Diagnóstico", transformation: "Acceso" },
            disclaimer: "Error de conexión con proveedor de datos."
        },
        indicators: {},
        _meta: { error: reason }
    });
}
