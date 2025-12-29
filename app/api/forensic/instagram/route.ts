import { NextResponse } from 'next/server';
import { runForensicPipeline, RawInputData } from '../../../lib/forensic/intelligence';
import { createHash } from 'crypto';

export const dynamic = 'force-dynamic';

// Simple in-memory cache
const CACHE = new Map<string, { data: any, timestamp: number }>();
const CACHE_DURATION = 168 * 60 * 60 * 1000; // 7 Days (Technical Resilience)

// --- TYPES ---
type SystemVerdict = "APPROVED" | "DOWNGRADED" | "BLOCKED" | "INCONCLUSIVE" | "SYSTEM_ERROR";

interface ClosurePayload {
    system_verdict: SystemVerdict;
    verdict_code: string;
    session_id: string;
    closed_at: string;
    closure_signature: string;
    // Optional Fields (Context)
    forensic_diagnosis?: any; // Only if APPROVED/DOWNGRADED
    ux_controls?: {
        title: string;
        message: string;
        cta: string;
        status_label: string; // For compatibility
    };
}

// Helper to generate signature
function generateSignature(sessionId: string, verdict: string, timestamp: string): string {
    const secret = process.env.CLOSURE_SECRET || "tdt_sovereign_secret_v1";
    return createHash('sha256').update(`${sessionId}:${verdict}:${timestamp}:${secret}`).digest('hex');
}

// Helper to generate Emergency Closure (Rule A/B/C/D safety net)
function generateEmergencyClosure(sessionId: string, code: string = "CRITICAL_CLOSURE_FAILURE"): ClosurePayload {
    const now = new Date().toISOString();
    return {
        system_verdict: "SYSTEM_ERROR",
        verdict_code: code,
        session_id: sessionId,
        closed_at: now,
        closure_signature: generateSignature(sessionId, "SYSTEM_ERROR", now),
        ux_controls: {
            status_label: "SISTEMA EN REVISIÓN",
            title: "CONEXION INTERRUMPIDA",
            message: "Protocolo detenido por seguridad.",
            cta: ""
        }
    };
}

export async function POST(request: Request) {
    const session_id = `SESS-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    const timestamp = new Date().toISOString();

    try {
        const body = await request.json();
        const { handle, intent, mode } = body;

        if (!handle) {
            return NextResponse.json({
                status: 'error',
                closure: generateEmergencyClosure(session_id, "MISSING_HANDLE")
            }, { status: 400 });
        }

        const normalizedHandle = handle.toLowerCase().replace('@', '').trim();

        // 1. CACHE CHECK
        const cached = CACHE.get(normalizedHandle);
        if (cached && (Date.now() - cached.timestamp < CACHE_DURATION) && !intent) {
            console.log(`[FORENSIC_CACHE_HIT] ${normalizedHandle}`);
            return NextResponse.json(cached.data);
        }

        // DEBUG: ENV CHECK
        if (normalizedHandle === 'debug_env') {
            // ... debug logic ...
            return NextResponse.json({ status: 'restricted', message: 'DEBUG' });
        }

        console.log(`[FORENSIC_SCAN_INIT] ${normalizedHandle}`);

        // 2. DATA INGESTION (Apify)
        let apifyToken = process.env.APIFY_TOKEN || process.env.apify_api_;
        if (!process.env.APIFY_TOKEN && !process.env.apify_api_) {
            // Try to find any var starting with apify_api_
            const foundKey = Object.keys(process.env).find(key => process.env[key]?.startsWith('apify_api_'));
            if (foundKey) apifyToken = process.env[foundKey];
        }

        if (!apifyToken) {
            console.error("CRITICAL: APIFY_TOKEN missing");
            return NextResponse.json({
                status: 'error',
                closure: generateEmergencyClosure(session_id, "ENV_TOKEN_MISSING")
            });
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
            return NextResponse.json({
                status: 'error',
                closure: generateEmergencyClosure(session_id, `APIFY_ERROR_${runResponse.status}`)
            });
        }

        const items = await runResponse.json();

        // 3. VALIDATE DATA
        if (!items || items.length === 0) {
            // Private or Not Found
            const now = new Date().toISOString();
            const payload: ClosurePayload = {
                system_verdict: "INCONCLUSIVE",
                verdict_code: "PUBLIC_VECTORS_INACCESSIBLE",
                session_id: session_id,
                closed_at: now,
                closure_signature: generateSignature(session_id, "INCONCLUSIVE", now),
                ux_controls: {
                    status_label: "ANÁLISIS INCONCLUSIVO",
                    title: "VECTORES PÚBLICOS INACCESIBLES",
                    message: "El activo no presenta señales legibles para validación forense.",
                    cta: ""
                }
            };
            return NextResponse.json({ status: 'error', closure: payload });
        }

        // 4. NORMALIZATION (Standardized)
        let profile: any = null;
        let posts: any[] = [];
        // ... (existing normalization logic) ...
        // Re-implementing compact normalization for brevity and robustness
        if (items[0].ownerUsername || items[0].owner) {
            const first = items[0];
            profile = {
                username: first.ownerUsername || first.owner?.username || normalizedHandle,
                profilePicUrl: first.ownerProfilePicUrl || first.owner?.profile_pic_url,
                biography: first.owner?.biography || "",
                followersCount: first.owner?.followersCount || 0,
                followsCount: first.owner?.followsCount || 0,
                postsCount: first.owner?.postsCount || 0,
                isPrivate: first.owner?.isPrivate || false,
                isBusinessAccount: first.owner?.isBusinessAccount || false
            };

            // Capture last 6 posts for grid preview
            if (first.latestPosts) {
                posts = first.latestPosts.slice(0, 6).map((p: any) => ({
                    id: p.id,
                    url: p.displayUrl,
                    likes: p.likesCount,
                    comments: p.commentsCount
                }));
            }
        }

        if (!profile) {
            return NextResponse.json({
                status: 'error',
                closure: generateEmergencyClosure(session_id, "PROFILE_NORMALIZATION_FAILED")
            });
        }

        // --- MODE: PREVIEW (SCREENER) ---
        if (mode === 'preview') {
            console.log(`[FORENSIC_PREVIEW] ${normalizedHandle}`);
            if (profile.isPrivate) {
                return NextResponse.json({
                    status: 'error',
                    closure: {
                        system_verdict: "INCONCLUSIVE",
                        verdict_code: "PRIVATE_PROFILE",
                        session_id: session_id,
                        closed_at: timestamp,
                        closure_signature: generateSignature(session_id, "INCONCLUSIVE", timestamp),
                        ux_controls: {
                            status_label: "PERFIL PRIVADO",
                            title: "ACCESO DENEGADO",
                            message: "El activo no es público.",
                            cta: ""
                        }
                    }
                });
            }
            return NextResponse.json({
                status: 'success',
                mode: 'preview',
                profile: profile,
                posts: posts
            });
        }
        externalUrl: first.owner?.external_url || first.externalUrl || null,
            followersCount: first.owner?.followers_count || first.owner?.edge_followed_by?.count || 0,
                postsCount: first.owner?.edge_owner_to_timeline_media?.count || first.owner?.posts_count || 0,
                    isBusiness: first.owner?.is_business_account || false
    };
    posts = items;
} else if (items[0].username) {
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
    return NextResponse.json({
        status: 'error',
        closure: generateEmergencyClosure(session_id, "PROFILE_STRUCTURE_INVALID")
    });
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
    posts: normalizedPosts,
    followsCount: 0,
    isVerified: false,
    externalUrl: profile.externalUrl
};

// 5. INTENT MAPPING (Phase 61)
// ... (Keep existing intent mapping logic for continuity) ...
let forensicIntent: any = undefined;
if (intent) {
    // ... (Simple map)
    const natureMap: any = { 'PROFESSIONAL': 'MARCA_PERSONAL', 'CREATOR': 'MARCA_PERSONAL', 'BRAND': 'MARCA_COMERCIAL', 'REAL_ESTATE': 'MARCA_COMERCIAL', 'FINANCE': 'MARCA_COMERCIAL' };
    forensicIntent = {
        nature: natureMap[intent.nature] || 'MARCA_COMERCIAL',
        market: 'GLOBAL', // Simplified
        audience: 'MIXTA',
        ambition: 'COMPETENCIA',
        commitment: intent.commitment
    };
}

const rawInput: RawInputData = {
    username: normalizedData.username,
    biography: normalizedData.biography,
    followers_count: normalizedData.followersCount,
    following_count: normalizedData.followsCount || 0,
    posts_count: normalizedData.postsCount,
    recent_posts: normalizedPosts.map(p => ({
        is_video: false,
        caption: p.caption || '',
        likes: 0,
        comments: 0,
        timestamp: p.timestamp / 1000
    })),
    is_verified: normalizedData.isVerified,
    external_url: normalizedData.externalUrl
};


// 6. PIPELINE EXECUTION & DIAGNOSIS
const operatorContext = (body as any).operatorContext;
let diagnosis;
try {
    diagnosis = runForensicPipeline(rawInput, forensicIntent, operatorContext);
} catch (pipelineErr) {
    console.error("[PIPELINE_CRITICAL]", pipelineErr);
    return NextResponse.json({
        status: 'error',
        closure: generateEmergencyClosure(session_id, "PIPELINE_EXECUTION_FAILURE")
    });
}

// 7. VERDICT CONSTRUCTION (STRICT PHASE 67 LOGIC)
const pricing = diagnosis._pricing;
const gap = diagnosis._gap_analysis;

// Default State (Safe)
let system_verdict: SystemVerdict = "INCONCLUSIVE";
let verdict_code = "UNRESOLVED_LOGIC";
let ux_controls = {
    title: "ANALYSIS CONFIRMED",
    message: "Data integrity verified.",
    cta: "PROCEED",
    status_label: "VERIFIED"
};

// LOGIC GATES
// LOGIC GATES (DEFINITIVE COPY)
if (gap?.classification === 'DELUSIONAL' || pricing?.tier_label === 'COMPLIANCE_PATH') {
    // BLOCKED: Risk / Compliance / Medical Violation
    system_verdict = "BLOCKED";
    verdict_code = gap?.classification === 'DELUSIONAL' ? "CRITICAL_DISSONANCE" : "MEDICAL_SAFETY_PROTOCOL";
    ux_controls = {
        status_label: "INTERVENCIÓN DENEGADA",
        title: "CRITERIO DE RIESGO",
        message: "Disonancia estructural detectada. Protocolo abortado.",
        cta: ""
    };
} else if (pricing?.tier_label === 'PRIORITY_ACCESS' || pricing?.tier_label === 'STANDARD_ENTRY') {
    // APPROVED: Structural / High-Ticket
    // We Treat Standard Entry as 'Approved' to ensure revenue path is open, 
    // but copy is strict "Structural Intervention" justified by "Asymmetry".
    system_verdict = "APPROVED";
    verdict_code = pricing.tier_label === 'PRIORITY_ACCESS' ? "PRIORITY_SCALABILITY" : "STANDARD_REALIGNMENT";
    ux_controls = {
        status_label: "INTERVENCIÓN AUTORIZADA",
        title: "ASYMMETRY DETECTED",
        message: "Structural intervention required for high-complexity scale.",
        cta: "ACCEDER A ESPECIFICACIONES"
    };
} else {
    // DOWNGRADED: Foundation / Low-Mid Ticket
    system_verdict = "DOWNGRADED";
    verdict_code = "STRUCTURAL_DEFICIENCY";
    ux_controls = {
        status_label: "INTERVENCIÓN RESTRINGIDA",
        title: "DENSITY INSUFFICIENT",
        message: "Asset requires foundational consolidation phase.",
        cta: "DESCARGAR PROTOCOLO"
    };
}

// 8. FINAL PAYLOAD CONSTRUCTION (Strict Rules)
let closurePayload: ClosurePayload = {
    system_verdict,
    verdict_code,
    session_id,
    closed_at: timestamp,
    closure_signature: generateSignature(session_id, system_verdict, timestamp),
    ux_controls
};

// CRITICAL FIX: POST-CONSTRUCTION INTEGRITY CHECK
const mandatoryFields = ['system_verdict', 'verdict_code', 'session_id', 'closed_at', 'closure_signature'];
const missing = mandatoryFields.filter(f => !closurePayload[f as keyof ClosurePayload]);

if (missing.length > 0) {
    console.error(`[CRITICAL_PAYLOAD_FAILURE] Missing fields: ${missing.join(', ')}`);
    // REBUILD WITH EMERGENCY SAFEGUARDS
    closurePayload = {
        system_verdict: "SYSTEM_ERROR",
        verdict_code: "INCOMPLETE_CLOSURE",
        session_id: session_id,
        closed_at: timestamp,
        closure_signature: generateSignature(session_id, "SYSTEM_ERROR", timestamp),
        ux_controls: {
            status_label: "SISTEMA EN REVISIÓN",
            title: "ERROR DE PROTOCOLO",
            message: "Cierre incompleto.",
            cta: ""
        }
    };
}

// RULE C: Leakage Prevention
if (system_verdict === "APPROVED" || system_verdict === "DOWNGRADED") {
    closurePayload.forensic_diagnosis = diagnosis;
} else {
    // Strip diagnosis for BLOCKED/INCONCLUSIVE/ERROR
    closurePayload.forensic_diagnosis = null;
}

// 9. RESPONSE
const responseData = {
    status: 'success',
    username: normalizedData.username,
    profilePicUrl: normalizedData.profilePicUrl,
    biography: normalizedData.biography,
    closure: closurePayload,
    // Legacy fields for backward compat (if any part of frontend still looks for them)
    ux: ux_controls,
    analysis: diagnosis
};

if (!intent) {
    CACHE.set(normalizedHandle, { data: responseData, timestamp: Date.now() });
}

return NextResponse.json(responseData);

    } catch (e) {
    console.error("[UNDEFINED_SYSTEM_FAILURE]", e);
    return NextResponse.json({
        status: 'error',
        closure: generateEmergencyClosure(session_id, "UNHANDLED_EXCEPTION")
    });
}
}
