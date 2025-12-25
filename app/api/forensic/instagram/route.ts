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

        if (!apifyToken) {
            const foundKey = Object.keys(process.env).find(key => process.env[key]?.startsWith('apify_api_'));
            if (foundKey) {
                console.log(`[FORENSIC] Found token in var: ${foundKey}`);
                apifyToken = process.env[foundKey];
            }
        }

        if (!apifyToken) {
            console.error("CRITICAL: APIFY_TOKEN missing in env");
            return NextResponse.json({ status: 'restricted', message: 'Validation Protocol Active', router_action: 'MANUAL_REVIEW_PATH' });
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
            return NextResponse.json({ status: 'restricted', message: 'Visual data under forensic verification protocol.', router_action: 'MANUAL_REVIEW_PATH' });
        }

        const items = await runResponse.json();

        // 3. VALIDATE DATA
        if (!items || items.length === 0) {
            console.warn(`[APIFY_EMPTY] No data found for ${normalizedHandle}`);
            return NextResponse.json({ status: 'restricted', message: 'Asset not visible to public scanner.', router_action: 'MANUAL_REVIEW_PATH' });
        }

        // 4. NORMALIZATION (Adapter for Profile Scraper)
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
            const p = items[0];
            profile = {
                username: normalizedHandle,
                profilePicUrl: p.displayUrl || p.images?.[0] || null,
                biography: "Visual vectors extracted.",
                externalUrl: null,
                followersCount: 0,
                postsCount: 0,
                isBusiness: false
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
            followersCount: profile.followersCount,
            postsCount: profile.postsCount,
            posts: normalizedPosts
        };

        // --- ANALYZER CORE V1.1 LOGIC ---

        // 1. ENTITY CLASSIFICATION MODULE
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
        const NICHE_KEYS = ['marketing', 'real estate', 'inmo', 'cirug', 'surg', 'fit', 'gym', 'crypto', 'invest', 'b2b', 'high ticket', 'grow', 'scale', 'money', 'dinero', 'ventas', 'sales'];
        const hasNiche = NICHE_KEYS.some(k => bioLower.includes(k));

        // A. Posicionamiento (Clarity)
        let scorePos = 3;
        if (hasNiche) scorePos += 3;
        if (hasLink) scorePos += 2;
        if (bioLower.length > 50) scorePos += 2;
        scorePos = Math.min(10, scorePos);

        // B. Intención Comercial (CTA Density)
        const CTA_KEYS = ['dm', 'link', 'bio', 'agenda', 'call', 'clase', 'info', 'baja', 'ebook', 'regalo', 'compra'];
        let ctaCount = 0;
        normalizedPosts.forEach(p => { if (CTA_KEYS.some(k => (p.caption || '').toLowerCase().includes(k))) ctaCount++; });
        let scoreIntent = 3;
        if (hasLink && hasNiche) scoreIntent += 2;
        const ctaRatio = normalizedPosts.length ? ctaCount / normalizedPosts.length : 0;
        if (ctaRatio > 0.3) scoreIntent += 3;
        if (ctaRatio > 0.6) scoreIntent += 2;
        scoreIntent = Math.min(10, scoreIntent);

        // C. Coherencia Temática (Consistency)
        let nichePostCount = 0;
        if (hasNiche) {
            normalizedPosts.forEach(p => { if (NICHE_KEYS.some(k => (p.caption || '').toLowerCase().includes(k))) nichePostCount++; });
        }
        let scoreCoh = 4;
        const nicheRatio = normalizedPosts.length ? nichePostCount / normalizedPosts.length : 0;
        if (nicheRatio > 0.3) scoreCoh = 7;
        if (nicheRatio > 0.6) scoreCoh = 9;
        scoreCoh = Math.min(10, scoreCoh);

        // D. Consistencia Operativa (Frequency)
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

        // E. Brecha Aspiracional (Vulnerability)
        const PREMIUM_KEYS = ['7 figures', 'million', 'millon', 'luxury', 'elite', 'ceo', 'founder', 'leader'];
        const AUTH_KEYS = ['case', 'result', 'testimoni', 'client', 'award', 'prensa', 'forber', 'inc.'];
        const hasPremium = PREMIUM_KEYS.some(k => bioLower.includes(k));
        let authCount = 0;
        normalizedPosts.forEach(p => { if (AUTH_KEYS.some(k => (p.caption || '').toLowerCase().includes(k))) authCount++; });

        let scoreGap = 5;
        if (hasPremium && authCount === 0) scoreGap = 9;
        else if (hasPremium && authCount > 0) scoreGap = 3;
        else if (!hasPremium && authCount === 0) scoreGap = 2;
        scoreGap = Math.min(10, scoreGap);

        // F. Arquitectura de Autoridad (New)
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

        const isNewAndHighScoring = (history === 'nueva' && profile.followersCount > 10000);
        if (isNewAndHighScoring) flag = "FLAG_REVIEW";

        const isVulnerable = scoreGap > 7;
        const lowAuthority = scoreArch < 4;
        if (isVulnerable && lowAuthority) flag = "MEDIUM_TICKET";

        if (!flag) {
            if (profile.followersCount > 50000 && scoreIntent < 4) ticketClass = "HIGH_POTENTIAL";
            else if (entityType === 'especialista' && scoreGap > 6) ticketClass = "HIGH_TICKET";
            else if (entityType === 'empresa' && scorePos > 7 && scoreOps < 4) ticketClass = "HIGH_TICKET";
            else if (profile.followersCount > 10000) ticketClass = "MEDIUM_TICKET";
            else ticketClass = "LOW_TICKET";
        } else {
            ticketClass = flag;
        }

        const impact = {
            credibilidad: scoreArch > 7 ? "RESILIENTE" : (scoreArch > 4 ? "ESTABLE" : "FRÁGIL"),
            conversion: scoreIntent > 7 ? "AGRESIVA" : (scoreIntent > 4 ? "MODERADA" : "LATENTE"),
            complejidad: (entityType === 'empresa' || entityType === 'hibrido') ? "SISTÉMICA" : "LINEAR"
        };

        const indicators = {
            posicionamiento: { val: scorePos, label: scorePos > 7 ? "CLARO" : "CONFUSO" },
            intencion_comercial: { val: scoreIntent, label: scoreIntent > 7 ? "ALTA" : "BAJA" },
            coherencia_tematica: { val: scoreCoh, label: scoreCoh > 7 ? "DEFINIDA" : "DILUIDA" },
            consistencia_operativa: { val: scoreOps, label: scoreOps > 7 ? "ALTA" : "ERRÁTICA" },
            brecha_aspiracional: { val: scoreGap, label: scoreGap > 7 ? "CRÍTICA" : "ALINEADA" },
            arquitectura_autoridad: { val: scoreArch, label: scoreArch > 7 ? "SÓLIDA" : "INCIPIENTE" }
        };

        // --- ROUTING ENGINE (PHASE 25.6) ---

        let routerAction = "DIGITAL_FAST_IMPACT";
        let roadmapData = {
            gain: "Estabilización de Perfil (30 Días)",
            foundation: "Infraestructura de Conversión",
            transformation: "Escalamiento Digital"
        };
        let uxContent = {
            title: "Diagnóstico: Impacto Digital",
            message: "Se detectan oportunidades de corrección inmediata en la estructura de autoridad.",
            cta: "Acceder a Solución",
            restrictions: [] as string[]
        };

        switch (ticketClass) {
            case "LOW_TICKET":
                routerAction = "DIGITAL_FAST_IMPACT";
                roadmapData = {
                    gain: "Corrección de Bio y Enlaces (7 Días)",
                    foundation: "Estructura de Contenido (30 Días)",
                    transformation: "Autoridad Percibida (3 Meses)"
                };
                uxContent = {
                    title: "Protocolo: Rápido Impacto",
                    message: "La cuenta requiere intervención estructural básica antes de escalar.",
                    cta: "Acceso Inmediato",
                    restrictions: ["No Agenda Humana", "Acceso Digital Único"]
                };
                break;

            case "MEDIUM_TICKET":
                routerAction = "STRUCTURED_CONSOLIDATION";
                roadmapData = {
                    gain: "Optimización de Embudo (30 Días)",
                    foundation: "Sistematización de Contenido (90 Días)",
                    transformation: "Liderazgo de Nicho (12 Meses)"
                };
                uxContent = {
                    title: "Protocolo: Consolidación Estratégica",
                    message: "Se detecta tracción. Se requiere profesionalizar la conversión.",
                    cta: "Acceder al Programa",
                    restrictions: ["Soporte vía Account Manager", "Sin Acceso a Founders"]
                };
                break;

            case "HIGH_TICKET":
                routerAction = "AUTHORITY_TRANSFORMATION";
                roadmapData = {
                    gain: "Reingeniería de Autoridad (30 Días)",
                    foundation: "Ecosistema de Poder (90 Días)",
                    transformation: "Soberanía de Mercado (12 Meses)"
                };
                uxContent = {
                    title: "Protocolo: Transformación de Autoridad",
                    message: "Perfil elegible para intervención de alto nivel. Requiere validación presupuestaria.",
                    cta: "Solicitar Intervención",
                    restrictions: ["Requiere Presupuesto >$10k", "Lista de Espera Activa"]
                };
                break;

            case "HIGH_POTENTIAL":
                routerAction = "HIGH_POTENTIAL_PATH";
                roadmapData = {
                    gain: "Monetización de Audiencia (30 Días)",
                    foundation: "Creación de Oferta (60 Días)",
                    transformation: "Imperio Personal (12 Meses)"
                };
                uxContent = {
                    title: "Protocolo: Ambición Controlada",
                    message: "Gran volumen detectado. Riesgo de dilución de marca. Se sugiere refinamiento.",
                    cta: "Sesión Estratégica Limitada",
                    restrictions: ["Solo para dueños de cuenta", "Validación de Identidad"]
                };
                break;

            case "FLAG_REVIEW":
                routerAction = "MANUAL_REVIEW_PATH";
                roadmapData = {
                    gain: "Auditoría de Veracidad (7 Días)",
                    foundation: "???",
                    transformation: "???"
                };
                uxContent = {
                    title: "Alerta: Revisión Contextual Requerida",
                    message: "Los patrones detectados requieren análisis humano para descartar anomalías.",
                    cta: "Solicitar Revisión Manual",
                    restrictions: ["Bloqueo Preventivo de Compra", "Contacto Humano Obligatorio"]
                };
                break;
        }

        const analysisResult = {
            entity_type: entityType,
            history_factor: history,
            indicators,
            impact,
            ticket_class: ticketClass,
            // ROUTER OUTPUTS
            router_action: routerAction,
            roadmap: roadmapData,
            ux_context: uxContent,
            disclaimer: "Estimaciones basadas en benchmarks de industria. No constituyen garantía."
        };

        const finalPayload = { ...normalizedData, ...analysisResult };

        CACHE.set(normalizedHandle, { data: finalPayload, timestamp: Date.now() });
        return NextResponse.json(finalPayload);

    } catch (e) {
        console.error("[FORENSIC_FAILURE]", e);
        // FALLBACK: ANALYSIS_LITE_MODE / MANUAL REVIEW
        return NextResponse.json({
            status: 'restricted',
            message: 'Visual data under forensic verification protocol.',
            router_action: 'MANUAL_REVIEW_PATH',
            ux_context: {
                title: "Protocolo de Seguridad Activo",
                message: "No se pudo completar el escaneo automático. Se requiere revisión manual.",
                cta: "Solicitar Soporte",
                restrictions: ["Error de Conexión Seguro"]
            },
            debug: e instanceof Error ? e.message : String(e)
        });
    }
}
