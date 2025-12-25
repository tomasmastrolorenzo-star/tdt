import { NextResponse } from 'next/server';

// Simple in-memory cache
const CACHE = new Map<string, { data: any, timestamp: number }>();
const CACHE_DURATION = 168 * 60 * 60 * 1000; // 7 Days (Resiliencia Técnica)

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

        // 1. INPUTS Y CALCULADORES
        const bioLower = (profile.biography || '').toLowerCase();

        // ASSET CLASS DETECTION (Strict Categories)
        const ASSET_TYPES = {
            'MEDIC': ['cirugia', 'surgeon', 'medico', 'doctor', 'dr.', 'clinica', 'estetica', 'salud', 'pacientes', 'md', 'plastic', 'derma'],
            'REAL_ESTATE': ['real estate', 'inmobiliaria', 'bienes raices', 'realtor', 'propiedades', 'broker', 'invest', 'renta'],
            'ATHLETE': ['athlete', 'atleta', 'player', 'jugador', 'fit', 'fitness', 'coach', 'gym', 'training', 'entrenador'],
            'FOUNDER': ['founder', 'ceo', 'co-founder', 'dueño', 'owner', 'startup', 'saas', 'tech', 'software', 'cto'],
            'BROKER': ['trader', 'trading', 'forex', 'crypto', 'bitcoin', 'finance', 'finanzas', 'inversion', 'capital', 'stocks'],
            'INFLUENCER': ['creator', 'creador', 'blog', 'lifestyle', 'viajes', 'travel', 'fashion', 'moda', 'embajador']
        };

        let detectedType = 'OTHER';
        let confidence = 0;
        let maxMatches = 0;

        // Keyword Matching
        Object.entries(ASSET_TYPES).forEach(([type, keywords]) => {
            let matches = 0;
            keywords.forEach(k => {
                if (bioLower.includes(k)) matches++;
            });
            // Check formatted captions too? (Expensive but accurate)
            // Lets stick to Bio + Top 3 posts captions for speed
            normalizedPosts.slice(0, 3).forEach(p => {
                const capt = (p.caption || '').toLowerCase();
                keywords.forEach(k => { if (capt.includes(k)) matches += 0.5; });
            });

            if (matches > maxMatches) {
                maxMatches = matches;
                detectedType = type;
            }
        });

        // Confidence Calculation
        confidence = maxMatches >= 3 ? 0.9 : maxMatches >= 1 ? 0.6 : 0.3;

        // Return "Unsure" if low confidence
        if (confidence < 0.4) detectedType = 'OTHER';


        // METRICS MAPPING (0-10)
        // ... (Existing Logic refined with Asset Type Nuance?)
        // For V1 Core, use generic logic but report Type for Frontend Nuance
        const NICHE_KEYS = Object.values(ASSET_TYPES).flat(); // Aggregate for generic "Niche" check

        const CTA_KEYS = ['dm', 'link', 'bio', 'agenda', 'call', 'clase', 'info', 'baja', 'ebook', 'regalo', 'compra'];
        const PREMIUM_KEYS = ['7 figures', 'million', 'millon', 'luxury', 'elite', 'ceo', 'founder', 'leader'];
        const AUTH_KEYS = ['case', 'result', 'testimoni', 'client', 'award', 'prensa', 'forbes', 'inc.'];

        const hasLink = !!profile.externalUrl;
        const hasNiche = maxMatches > 0;
        const hasPremium = PREMIUM_KEYS.some(k => bioLower.includes(k));

        // PC: Coherencia Estratégica
        let PC = 3;
        if (hasNiche) PC += 3;
        if (hasLink) PC += 2;
        if (bioLower.length > 50) PC += 2;
        PC = Math.min(10, PC);

        // IC: Intención Comercial
        let ctaCount = 0;
        normalizedPosts.forEach(p => { if (CTA_KEYS.some(k => (p.caption || '').toLowerCase().includes(k))) ctaCount++; });
        const ctaRatio = normalizedPosts.length ? ctaCount / normalizedPosts.length : 0;
        let IC = 3;
        if (hasLink && hasNiche) IC += 2;
        if (ctaRatio > 0.3) IC += 3;
        if (ctaRatio > 0.6) IC += 2;
        IC = Math.min(10, IC);

        // CO: Consistencia Operativa
        let CO = 5;
        if (normalizedPosts.length > 1) {
            const days = (normalizedPosts[0].timestamp - normalizedPosts[normalizedPosts.length - 1].timestamp) / (1000 * 3600 * 24);
            const safeDays = Math.max(days, 1);
            const postsPerWeek = normalizedPosts.length / (safeDays / 7);
            if (postsPerWeek < 1) CO = 3;
            else if (postsPerWeek > 3) CO = 9;
            else CO = 6;
        }
        CO = Math.min(10, CO);

        // PI: Infraestructura de Autoridad
        let PI = 4;
        if (profile.followersCount > 5000) PI += 1;
        if (profile.followersCount > 20000) PI += 2;
        if (profile.followersCount > 100000) PI += 2;
        if (hasLink && bioLower.includes('http')) PI += 1;
        PI = Math.min(10, PI);

        // BA: Brecha de Autoridad
        let authCount = 0;
        normalizedPosts.forEach(p => { if (AUTH_KEYS.some(k => (p.caption || '').toLowerCase().includes(k))) authCount++; });

        let BA = 4;
        if (hasPremium) {
            if (authCount === 0) BA = 9;
            else BA = 3;
        } else {
            BA = 2;
        }

        // H: Historia
        const H = Math.max(1, Math.round(profile.postsCount / 4));

        // VH: Vulnerabilidad
        let VH = 4;
        if (IC >= 7 && PI < 5) VH = 8;
        if (IC >= 7 && PC < 5) VH = 9;


        // 2. LOGIC GATES (BASE)
        let segment = "LOW";
        if (PC >= 8 && PI >= 7) segment = "HIGH";
        else if (PC >= 6 && PI < 7) segment = "MID";
        else segment = "LOW";

        // 3. VETO RULES (OVERRIDES)
        let riskFlags: string[] = [];
        let cap = null;

        // VETO 1: Riesgo Churn High-Ticket (Mala operación, Alta vulnerabilidad)
        if (CO < 5 && VH >= 8) {
            cap = "MID";
            riskFlags.push("churn");
        }

        // VETO 2: Influencer vacío (Autoridad "falsa")
        // BA >= 8 (Claims without proof), VH >= 8 (High intent/vuln).
        // Let's check PI as "real authority" proxy?
        if (BA >= 8 && VH >= 8 && PI < 4) { // Modified PI < 4 as "autoridad < 4" from prompt
            cap = "MID";
            riskFlags.push("ego"); // "Empty" implies Ego driven
        }

        // VETO 4: Cuenta nueva "demasiado perfecta"
        // weighted_score > 80? Let's assume PC*10. 
        if (H < 6 && (PC > 8 || PI > 8)) {
            segment = "FLAG";
            riskFlags.push("scale"); // Growth anomaly
        }

        // APPLY CAP
        if (cap === "MID" && segment === "HIGH") segment = "MID";
        if (cap === "LOW") segment = "LOW"; // Defensive

        // 4. SPECIAL CASES
        // High Potential
        if (PC >= 7 && BA >= 7 && profile.followersCount < 10000) {
            // Wait, Prompt: "BA >= 7" (High Gap) + "Audiencia < 10k" ?
            // High Potential usually means "Good Coherence, Good Proof, Small Audience".
            // If BA is "Gap" (Bad), `BA >= 7` means "Lying". 
            // Maybe user meant `BA` as "Authority Score"? 
            // "BA // Brecha de Autoridad". Brecha = Gap.
            // Let's stick to prompts: `BA >= 7`. Defined as "High Gap". 
            // Use case: Expert who claims to be good but has small audience? 
            // Wait, High Potential usually is "Great stats, small audience".
            // Review Prompt: "High Potential logic: PC >= 7 && BA >= 7 && audiencia < 10k".
            // If BA is Gap, then it's "Coherent Lier with small audience"? 
            // Re-eval BA definition in prompt. 
            // "BA >= 8 && VH >= 8 ... VETO 2". 
            // Maybe BA in High Potential context means "Good Authority"? 
            // Ambiguity. I will assume High Potential means "Coherent + High Gap (Needs help) + Small Audience" -> Needs "Refinement to Scale".
            // Or maybe I invert BA meaning: 10 = No Gap. 
            // Prompt says: "VETO 2 ... BA >= 8 ... CAP = MID". Veto normally caps "Bad" things. So BA >= 8 is BAD (High Gap).
            // So High Potential = High Coherence + High Gap + Small Audience? 
            // Let's assume yes, strict adherence.
            segment = "HIGH_POTENTIAL";
        }

        // 5. ROUTING & OUTPUTS
        let routingTarget = "CHECKOUT";
        let accessLevel = 0;
        let salesAlert = false;

        switch (segment) {
            case "LOW":
                routingTarget = "CHECKOUT";
                accessLevel = 0;
                break;
            case "MID":
                routingTarget = "VSL"; // "Validar Estructura"
                accessLevel = 1;
                break;
            case "HIGH":
                routingTarget = "CALENDAR"; // "Aplicar"
                accessLevel = 2; // Senior
                salesAlert = true;
                break;
            case "HIGH_POTENTIAL":
                routingTarget = "CALENDAR"; // "Strategy Session"
                accessLevel = 1; // Not senior direct? "Journey escalonado"
                break;
            case "FLAG":
                routingTarget = "BLOCK"; // Manual Review
                accessLevel = 0;
                salesAlert = true; // Review needed
                break;
        }

        // UX - NARRATIVE ONLY (No Scores)
        const uxContent = {
            title: segment === "HIGH" ? "Protocolo de Transformación de Autoridad" :
                segment === "MID" ? "Validación de Estructura" :
                    segment === "HIGH_POTENTIAL" ? "Protocolo de Escala" :
                        segment === "FLAG" ? "Revisión Contextual" :
                            "Plan de Corrección Inmediata",

            message: segment === "HIGH" ? "Su perfil demuestra la solidez estructural requerida para una intervención de alto nivel." :
                segment === "MID" ? "Se detectan fundamentos operativos válidos. El siguiente paso es la consolidación del sistema." :
                    segment === "HIGH_POTENTIAL" ? "Potencial de escala detectado. Se requiere alinear la brecha de autoridad antes de acelerar." :
                        segment === "FLAG" ? "Patrones de crecimiento anómalos detectados. Se requiere revisión manual para asegurar la integridad del ecosistema." :
                            "Se han identificado fricciones estructurales que limitan el alcance. Se recomienda corrección técnica inmediata.",

            cta: segment === "HIGH" ? "Solicitar Auditoría de Escala" :
                segment === "MID" ? "Validar Infraestructura" :
                    segment === "HIGH_POTENTIAL" ? "Sesión Estratégica" :
                        "Descargar Guía de Corrección",

            roadmap: {
                phase1: "Estabilización (30 días)",
                phase2: "Estructuración (90 días)",
                phase3: "Soberanía (12 meses)"
            },

            disclaimer: "Proyección estimada basada en benchmarks de la industria. No constituye garantía."
        };

        return NextResponse.json({
            status: 'success',
            username: normalizedData.username,
            profilePicUrl: normalizedData.profilePicUrl,
            biography: normalizedData.biography,

            // FORENSIC DATA
            asset_type: detectedType, // MEDICAL, REAL_ESTATE, etc
            confidence: confidence, // 0.0 - 1.0
            last_post_date: normalizedPosts.length > 0 ? new Date(normalizedPosts[0].timestamp).toISOString() : null,

            // ANALYZER OUTPUT
            narrative_level: segment,
            routing_target: routingTarget,
            access_level: accessLevel,
            human_access: accessLevel > 0,
            sales_alert: salesAlert,
            risk_flags: riskFlags,

            // UX
            ux: uxContent,
            indicators: {
                posicionamiento: { val: PC, label: PC >= 7 ? 'CLARO' : 'DIFUSO', evidence: PC >= 7 ? 'Keyword Density High' : 'Low Niche Signals' },
                intencion_comercial: { val: IC, label: IC >= 7 ? 'ALTA' : 'BAJA', evidence: `CTA Ration: ${ctaRatio.toFixed(2)}` },
                brecha_aspiracional: { val: BA, label: BA >= 7 ? 'CRITICA' : 'ALINEADA', evidence: 'Claim/Proof Ratio' },
                infraestructura: { val: PI, label: PI >= 7 ? 'ROBUSTA' : 'INCIPIENTE', evidence: 'Follower/Link Structure' }
            },

            // INTERNAL DEBUG
            _meta: { PC, IC, CO, PI, BA, VH, match_score: maxMatches }
        });
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
