import { NextResponse } from 'next/server';
import crypto from 'crypto';

export const maxDuration = 60; // Attempt to extend timeout for Pro plans

// --- CONFIGURATION ---
const SYSTEM_VERSION = "Phase_75_Patch_5";
const APIFY_ACTOR = "apify/instagram-profile-scraper";

// --- TYPES ---
type Verdict = 'APPROVED' | 'RESTRICTED' | 'DENIED' | 'INCONCLUSIVE' | 'SYSTEM_ERROR' | 'BLOCKED' | 'DOWNGRADED'; // Added DOWNGRADED
type ClosurePayload = {
    system_verdict: Verdict;
    verdict_code: string;
    session_id: string;
    closed_at: number;
    closure_signature: string;
    forensic_diagnosis?: any;
    ux_controls: {
        status_label: string;
        title: string;
        message: string;
        cta?: string;
    }
};

// --- HELPERS ---
function generateSignature(sessionId: string, verdict: string, timestamp: number) {
    const secret = process.env.CLOSURE_SECRET || "TDT_FORENSIC_DEFAULT_KEY_X9";
    return crypto.createHmac('sha256', secret)
        .update(`${sessionId}:${verdict}:${timestamp}`)
        .digest('hex');
}

// EMERGENCY CLOSURE GENERATOR (Safe Fallback)
function generateEmergencyClosure(session_id: string, code: string): ClosurePayload {
    const now = Date.now();
    return {
        system_verdict: "SYSTEM_ERROR",
        verdict_code: code,
        session_id: session_id,
        closed_at: now,
        closure_signature: generateSignature(session_id, "SYSTEM_ERROR", now),
        ux_controls: {
            status_label: "SISTEMA EN REVISIÓN",
            title: "PROTOCOLO DETENIDO",
            message: `Protocolo detenido por seguridad. (CÓDIGO: ${code})`,
            cta: ""
        }
    };
}


// --- MAIN HANDLER ---
export async function POST(req: Request) {
    const session_id = `SESS_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const timestamp = Date.now();

    // CACHE (In-Memory for Lambda Warm Instances)
    // NOTE: In Vercel serverless, this resets often, but helps for hot bursts.
    const globalState = (global as any);
    if (!globalState._CACHE) globalState._CACHE = new Map();
    const CACHE = globalState._CACHE;

    try {
        const body = await req.json();
        const { handle, intent, mode } = body;

        // 1. INPUT SANITIZATION
        if (!handle || typeof handle !== 'string') {
            return NextResponse.json({
                status: 'error',
                closure: generateEmergencyClosure(session_id, "INVALID_INPUT_REFERENCE")
            });
        }

        const normalizedHandle = handle.replace('@', '').toLowerCase().trim();

        // 2. DATA INGESTION (Apify)
        // Robust Token Config Search (Restored Legacy Support)
        let apifyToken = process.env.APIFY_TOKEN;

        // Legacy fallback (User reported this worked before)
        if (!apifyToken && process.env.apify_api_) {
            apifyToken = process.env.apify_api_;
        }

        if (!apifyToken) {
            // Deep search for any key containing 'apify' (case insensitive)
            const potentialKeys = Object.keys(process.env).filter(k => k.toLowerCase().includes('apify'));
            if (potentialKeys.length > 0) {
                apifyToken = process.env[potentialKeys[0]];
            }
        }

        if (apifyToken) {
            apifyToken = apifyToken.trim();
        }

        if (!apifyToken) {
            console.error("CRITICAL: APIFY_TOKEN missing");
            return NextResponse.json({
                status: 'error',
                closure: generateEmergencyClosure(session_id, "ENV_TOKEN_MISSING")
            });
        }

        console.log(`[FORENSIC_SCAN_INIT] ${normalizedHandle}`);


        // --- APIFY FETCH ---
        // Using "apify/instagram-profile-scraper" (Confirmed working by user)
        const apifyUrl = `https://api.apify.com/v2/acts/${APIFY_ACTOR}/run-sync-get-dataset-items?token=${apifyToken}`;

        console.log(`[FORENSIC_DEBUG] Actor: ${APIFY_ACTOR}`);
        console.log(`[FORENSIC_DEBUG] Token Start: ${apifyToken ? apifyToken.substring(0, 4) : 'NULL'}...`);
        console.log(`[FORENSIC_DEBUG] URL: ${apifyUrl.replace(apifyToken || '', '***')}`);

        const apifyRes = await fetch(apifyUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                usernames: [normalizedHandle]
            })
        });

        if (!apifyRes.ok) {
            const errorText = await apifyRes.text();
            console.error(`[APIFY_ERROR] ${apifyRes.status}`, errorText);

            // Handle 401 Unauthorized specifically
            if (apifyRes.status === 401) {
                return NextResponse.json({
                    status: 'error',
                    closure: generateEmergencyClosure(session_id, "APIFY_ERROR_401_INVALID_TOKEN")
                });
            }

            // Rate Limit
            if (apifyRes.status === 429) {
                return NextResponse.json({
                    status: 'error',
                    closure: generateEmergencyClosure(session_id, "VENDOR_RATE_LIMIT_EXCEEDED")
                });
            }

            // EXPOSE REAL ERROR FOR DEBUGGING (As requested ("saca trabas"))
            const safeText = errorText.replace(/[^a-zA-Z0-9_]/g, '_').toUpperCase().substring(0, 30);
            return NextResponse.json({
                status: 'error',
                closure: generateEmergencyClosure(session_id, `VENDOR_${apifyRes.status}_${safeText}`)
            });
        }

        const items = await apifyRes.json();

        // 3. VALIDATION
        if (!Array.isArray(items) || items.length === 0 || (!items[0].username && !items[0].ownerUsername && !items[0].owner)) {
            // Check for explicit "not found" or "private" failure from Apify?
            // Usually empty array = not found.
            // PHASE 67 RULE: If public scan fails, assume the asset is HIDDEN/PROTECTED -> RESTRICTED.
            // We do NOT fail here, we return a RESTRICTED closure.
            const now = Date.now();
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

        const first = items[0];

        // Strategy 1: Owner Object (Standard structure)
        if (first.ownerUsername || first.owner) {
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

        // Strategy 2: Direct Username Object (Fallback / Flat Structure)
        // CRITICAL FIX: Run this IF profile is missing OR if we want to augment.
        // The user's screenshot showed flat fields: followersCount, followsCount, etc.
        // We prioritize this fallback if Strategy 1 failed.
        if (!profile && first.username) {
            profile = {
                username: first.username,
                profilePicUrl: first.profilePicUrl || first.profilePicUrlHD,
                biography: first.biography,
                externalUrl: first.externalUrl || first.externalUrlShimmed || null,
                followersCount: first.followersCount || 0,
                followsCount: first.followsCount || 0, // Added followsCount
                postsCount: first.postsCount || 0,
                isBusinessAccount: first.isBusinessAccount || false,
                isPrivate: first.isPrivate || false,
                isVerified: first.isVerified || false
            };
            posts = first.latestPosts || [];
        }

        // --- FINAL VALIDATION OF PROFILE OBJECT ---
        if (!profile) {
            return NextResponse.json({
                status: 'error',
                closure: generateEmergencyClosure(session_id, "PROFILE_STRUCTURE_INVALID_POST_NORM")
            });
        }

        // --- MODE: PREVIEW (SCREENER) ---
        if (mode === 'preview') {
            console.log(`[FORENSIC_PREVIEW] ${normalizedHandle}`);
            // Safe access now that we know profile exists
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
            // Success response for Screener
            return NextResponse.json({
                status: 'success',
                mode: 'preview',
                profile: profile,
                posts: posts
            });
        }


        // 5. ANALYSIS (Rule Engine) for Full Scan
        // (Only runs if mode !== 'preview')

        const diagnosis = {
            asset_classification: {
                type: "UNK",
                subtype: "UNK",
                risk_level: "LOW"
            },
            problems: {
                critical: [],
                warnings: []
            },
            items: [] as string[], // Added for TS compatibility
            intervention_decision: "APPROVED",
            intervention_risk: "LOW"
        };

        let system_verdict: Verdict = "APPROVED";
        let verdict_code = "VERIFIED_ORGANIC";
        let ux_controls = {
            status_label: "ACTIVO CERTIFICADO",
            title: "APROBADO PARA INTERVENCIÓN",
            message: "El perfil cumple con los estándares de integridad estructural.",
            cta: "PROCEDER A PAGOS"
        };


        // --- RULE 1: INERTIA (Low Engagement) ---
        // Basic heuristic: < 1% ER (Assuming 100 followers per like as a baseline)
        // If posts > 10 and followers > 1000
        const followers = profile.followersCount || 0;
        if (followers > 1000 && posts.length > 0) {
            // Calculate avg likes
            const avgLikes = posts.reduce((acc, p) => acc + (p.likesCount || 0), 0) / posts.length;
            const er = (avgLikes / followers) * 100;

            if (er < 0.5) {
                diagnosis.items = ["HIGH_INERTIA"];
                verdict_code = "INERTIA_DETECTED";
                // We don't block, just note it? Or downgrade?
                // For now, allow but warn.
                system_verdict = "DOWNGRADED";
                ux_controls.status_label = "RIESGO DE INERCIA";
                ux_controls.message = "La audiencia responde por debajo del umbral de vitalidad clínica.";
            }
        }

        // --- RULE 2: ASYMMETRY (Bot Farms) ---
        // Follows > Followers (Ratio > 1.5) and Followers > 500
        const follows = profile.followsCount || 0;
        if (followers > 500 && (follows / followers) > 1.5) {
            diagnosis.items = ["STRUCTURAL_ASYMMETRY"];
            verdict_code = "ASYMMETRY_DETECTED";
            system_verdict = "DOWNGRADED";
            ux_controls.status_label = "ASIMETRÍA ESTRUCTURAL";
            ux_controls.message = "Patrón de seguimiento masivo detectado.";
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
            closure: closurePayload,
            // Legacy fields for backward compat (if any part of frontend still looks for them)
            ux: ux_controls,
            analysis: diagnosis
        };

        if (!intent) {
            CACHE.set(normalizedHandle, { data: normalizedData, timestamp: Date.now() });
        }

        return NextResponse.json(normalizedData);

    } catch (e: any) {
        console.error("[UNDEFINED_SYSTEM_FAILURE]", e);
        // CRITICAL DEBUG: Expose the actual error message safely
        const errorMsg = e instanceof Error ? e.message : String(e);
        const safeMsg = errorMsg.replace(/[^a-zA-Z0-9_]/g, '_').toUpperCase().substring(0, 50);

        return NextResponse.json({
            status: 'error',
            closure: generateEmergencyClosure(session_id, `EXCEPTION_${safeMsg}`)
        });
    }
}
