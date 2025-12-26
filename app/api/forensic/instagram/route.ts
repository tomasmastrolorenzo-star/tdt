import { NextResponse } from 'next/server';
import { runForensicPipeline, RawInputData } from '../../../lib/forensic/intelligence';
import { runPlaybookEngine } from '../../../lib/forensic/playbook_engine';

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

        // 1. CHECK CACHE (Bypass if Intent present to ensure fresh playbook run)
        const cached = CACHE.get(normalizedHandle);
        if (cached && (Date.now() - cached.timestamp < CACHE_DURATION)) {
            if (!intent) {
                console.log(`[FORENSIC_CACHE_HIT] ${normalizedHandle}`);
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
            posts: normalizedPosts,
            followsCount: 0,
            isVerified: false,
            externalUrl: profile.externalUrl
        };


        // --- PIPELINE EXECUTION ---

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

        // 1. FORENSIC DIAGNOSIS (Layer 0 + Intelligence)
        const diagnosis = runForensicPipeline(rawInput, intent);

        // 2. PLAYBOOK ENGINE (Layer 4 - Phase 38)
        const playbookResult = runPlaybookEngine(diagnosis);

        // 3. COMMERCIAL LOGIC MERGE
        let routingTarget = 'CHECKOUT';
        let accessLevel = 0;

        if (playbookResult.status === 'COMPLETED' && playbookResult.commercial_route === 'HIGH_TICKET') {
            routingTarget = 'CALENDAR';
            accessLevel = 2;
        } else if (playbookResult.status === 'ABORTED') {
            routingTarget = 'BLOCK';
            accessLevel = 0;
        } else if (diagnosis.asset_stage.stage === 'HIGH') {
            routingTarget = 'CALENDAR';
            accessLevel = 2;
        }

        // UX - PLAYBOOK AWARE
        let uxMessage = "Análisis completado.";
        if (playbookResult.playbook_id) {
            if (playbookResult.status === 'COMPLETED') {
                uxMessage = `PROTOCOLO ACTIVADO: ${playbookResult.playbook_id}. Secuencia de validación exitosa.`;
            } else {
                uxMessage = `PROTOCOLO ABORTADO: Fallo en etapa ${playbookResult.failed_step}. Infraestructura insuficiente.`;
            }
        } else {
            uxMessage = diagnosis.intervention_decision.rationale;
        }

        const uxContent = {
            title: playbookResult.status === 'ABORTED' ? "Procedimiento Detenido" : "Dictamen Técnico",
            message: uxMessage,
            cta: routingTarget === 'CALENDAR' ? "Solicitar Despliegue" : "Descargar Informe",
            roadmap: { phase1: "Diagnóstico", phase2: "Intervención", phase3: "Escala" },
            disclaimer: "Reporte generado por TDT Playbook Engine v1.0"
        };


        const responsePayload = {
            status: 'success',
            username: normalizedData.username,
            profilePicUrl: normalizedData.profilePicUrl,
            biography: normalizedData.biography,

            // FORENSIC
            asset_type: diagnosis.asset_classification.subtype,
            confidence: diagnosis.asset_classification.confidence,
            last_post_date: normalizedPosts.length > 0 ? new Date(normalizedPosts[0].timestamp).toISOString() : null,
            followers_count: normalizedData.followersCount,
            posts_count: normalizedData.postsCount,
            latest_posts: normalizedPosts.slice(0, 4).map(p => ({ url: p.imageUrl, caption: p.caption, date: p.timestamp })),

            // INTELLIGENCE
            _forensic_diagnosis: diagnosis,

            // PLAYBOOK RESULT (New)
            _playbook_engine: playbookResult,

            // ANALYZER OUTPUT
            narrative_level: diagnosis.asset_stage.stage,
            routing_target: routingTarget,
            access_level: accessLevel,
            human_access: accessLevel > 0,
            sales_alert: accessLevel > 1,
            risk_flags: diagnosis.problems.critical.map(p => p.code),

            ux: uxContent,
            indicators: {
                // Legacy mapping for UI compatibility (Placeholders)
                posicionamiento: { val: 5, label: 'ESTANDAR', evidence: 'Metrics' },
                intencion_comercial: { val: 5, label: 'MEDIA', evidence: 'Metrics' },
                brecha_aspiracional: { val: 5, label: 'MEDIA', evidence: 'Metrics' },
                infraestructura: { val: 5, label: 'MEDIA', evidence: 'Metrics' }
            },

            _meta: { intent_received: !!intent, playbook: playbookResult.playbook_id }
        };

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
