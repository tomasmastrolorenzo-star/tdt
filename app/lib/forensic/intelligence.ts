import { NextResponse } from 'next/server';

// --- TYPES ---

export type AssetType = 'PROFESIONAL' | 'CREADOR' | 'EMPRESA' | 'UNK';
export type AssetSubtype = 'MEDICO_SALUD' | 'ARTISTA_VISUAL' | 'VIDEO_CREATOR' | 'MARCA_ESTABLECIDA' | 'REAL_ESTATE' | 'FOUNDER' | 'ECOMMERCE_DTC' | 'OTHER';
export type AssetStage = 'LOW' | 'MID' | 'HIGH';

export interface RawInputData {
    username: string;
    biography: string;
    followers_count: number;
    following_count: number;
    posts_count: number;
    recent_posts: {
        is_video: boolean;
        caption: string;
        likes: number;
        comments: number;
        timestamp: number;
    }[];
    external_url?: string;
    is_verified?: boolean;
}

export interface AssetClassification {
    type: AssetType;
    subtype: AssetSubtype;
    confidence: number;
    rationale: string;
    decision: 'BLOCK' | 'DOWNGRADE' | 'ALLOW' | 'NO_INTERVENIR';
}

export interface DimensionScores {
    escala: number;
    engagement: number;
    consistencia: number;
    autoridad: number;
    riesgo: number;
}

export interface AssetStageResult {
    stage: AssetStage;
    composite_score: number;
    dimension_scores: DimensionScores;
}

export interface Problem {
    code: string;
    priority: 1 | 2 | 3;
    metric: keyof DimensionScores;
    threshold: number;
    type: 'CRITICAL' | 'TOLERABLE';
}

export interface MetricsContext {
    focus_metrics: string[];
    ignore_metrics: string[];
}

// --- BLOCK 1: TAXONOMY (INTERVENTION) ---

export type InterventionType =
    'NO_INTERVENIR' |
    'AJUSTE_TECNICO_PUNTUAL' |
    'OPTIMIZACION_GUIADA' |
    'INTERVENCION_ESTRUCTURAL' |
    'AUDITORIA_PROFUNDA';

export interface InterventionDecision {
    recommended_intervention: InterventionType;
    complexity_level: 'baja' | 'media' | 'alta' | 'critica';
    investment_coherence: boolean;
    intervention_risk: 'bajo' | 'medio' | 'alto';
    do_not_recommend: InterventionType[];
    rationale: string;
}

export interface DiagnosisObject {
    asset_classification: AssetClassification;
    asset_stage: AssetStageResult;
    problems: {
        critical: Problem[];
        tolerable: Problem[];
    };
    metrics_context: MetricsContext;
    intervention_decision: InterventionDecision;
    intent_analysis?: IntentAnalysis;
    declared_intent?: DeclaredIntent; // Added for Pricing Engine visibility
}

// --- LAYER 0: INTENT DEFINITIONS ---

export type AssetNature = 'MARCA_PERSONAL' | 'MARCA_COMERCIAL' | 'EVENTO_PROYECTO' | 'ENTIDAD_INSTITUCIONAL' | 'MEDIO_PUBLICACION';
export type TargetMarket = 'NORTEAMERICA' | 'LATAM' | 'EUROPA' | 'ASIA_PACIFICO' | 'MENA' | 'GLOBAL';
export type TargetAudience = 'B2C' | 'B2B' | 'B2G' | 'MIXTA';
export type OperativeAmbition = 'SOBREVIVENCIA' | 'COMPETENCIA' | 'LIDERAZGO' | 'EXPANSION';

export interface DeclaredIntent {
    nature: AssetNature;
    market: TargetMarket;
    audience: TargetAudience;
    ambition: OperativeAmbition;
    commitment?: 'TACTICAL' | 'STRUCTURAL' | 'FULL'; // Added for Phase 61
}

export interface IntentAnalysis {
    coherence: 'ALTA' | 'MEDIA' | 'BAJA' | 'CRITICA';
    flags: string[];
    risk_multipliers: {
        latency: number;
        conversion: number;
    };
}

const KEYWORDS = {
    MEDICO_SALUD: ['dr', 'dra', 'medicina', 'cirugia', 'salud', 'clinica', 'doctor', 'pacientes', 'estetica', 'dental', 'odontologo'],
    REAL_ESTATE: ['inmobiliaria', 'bienes raices', 'real estate', 'propiedades', 'venta', 'alquiler', 'inversion', 'realtor', 'broker'],
    FOUNDER: ['founder', 'ceo', 'co-founder', 'emprendedor', 'startup', 'dueño', 'director', 'business'],
    VIDEO_CREATOR: ['vlog', 'youtube', 'creator', 'video', 'streamer', 'twitch'],
    ARTISTA_VISUAL: ['arte', 'artist', 'design', 'diseño', 'foto', 'photo', 'gallery']
};

export function classifyAsset(data: RawInputData): AssetClassification {
    const bio = data.biography?.toLowerCase() || "";
    const username = data.username?.toLowerCase() || "";

    let bestSubtype: AssetSubtype = 'OTHER';
    let maxMatches = 0;

    for (const [subtype, terms] of Object.entries(KEYWORDS)) {
        let matches = 0;
        terms.forEach(term => {
            if (bio.includes(term)) matches += 2;
            if (username.includes(term)) matches += 3;
        });

        if (matches > maxMatches) {
            maxMatches = matches;
            bestSubtype = subtype as AssetSubtype;
        }
    }

    let type: AssetType = 'UNK';
    if (['MEDICO_SALUD', 'REAL_ESTATE', 'FOUNDER'].includes(bestSubtype)) {
        type = 'PROFESIONAL';
    } else if (['VIDEO_CREATOR', 'ARTISTA_VISUAL'].includes(bestSubtype)) {
        type = 'CREADOR';
    } else {
        if (data.is_verified || data.followers_count > 100000) type = 'MARCA_ESTABLECIDA' as any;
        else type = 'CREADOR';
    }

    const confidence = Math.min(1.0, 0.4 + (maxMatches * 0.1));

    return { type, subtype: bestSubtype, confidence };
}

export function detectStage(data: RawInputData, classification: AssetClassification): AssetStageResult {
    const escala = Math.min(1, Math.log10(Math.max(1, data.followers_count)) / 6);

    let avgLikes = 0;
    if (data.recent_posts.length > 0) {
        avgLikes = data.recent_posts.reduce((acc, p) => acc + (p.likes || 0), 0) / data.recent_posts.length;
    }
    const engRate = data.followers_count > 0 ? (avgLikes / data.followers_count) : 0;
    const engagement = Math.min(1, engRate * 20);

    let consistencia = 0.5;
    if (data.recent_posts.length > 1) {
        consistencia = 0.7;
    }

    let autoridad = data.is_verified ? 0.8 : 0.3;
    if (classification.confidence > 0.7) autoridad += 0.2;

    let riesgo = 0.2;
    if (data.followers_count > 10000 && engRate < 0.001) riesgo = 0.9;

    const scores: DimensionScores = { escala, engagement, consistencia, autoridad, riesgo };

    let composite = 0;

    if (classification.type === 'PROFESIONAL') {
        composite = (scores.autoridad * 0.4) + (scores.escala * 0.2) + (scores.engagement * 0.2) + (scores.consistencia * 0.2);
    } else {
        composite = (scores.engagement * 0.4) + (scores.escala * 0.3) + (scores.consistencia * 0.2) + (scores.autoridad * 0.1);
    }

    let stage: AssetStage = 'LOW';
    if (composite > 0.75) stage = 'HIGH';
    else if (composite > 0.4) stage = 'MID';

    return { stage, composite_score: composite, dimension_scores: scores };
}

export function prioritizeProblems(stageRes: AssetStageResult, classification: AssetClassification): { critical: Problem[], tolerable: Problem[] } {
    const critical: Problem[] = [];
    const tolerable: Problem[] = [];

    if (stageRes.dimension_scores.riesgo > 0.7) {
        critical.push({ code: 'HIGH_ALGORITHM_RISK', priority: 1, metric: 'riesgo', threshold: 0.7, type: 'CRITICAL' });
    }

    if (classification.type === 'PROFESIONAL' && stageRes.dimension_scores.autoridad < 0.4) {
        critical.push({ code: 'AUTHORITY_GAP', priority: 1, metric: 'autoridad', threshold: 0.4, type: 'CRITICAL' });
    }

    if (classification.type === 'CREADOR' && stageRes.dimension_scores.engagement < 0.3) {
        critical.push({ code: 'AUDIENCE_DISCONNECT', priority: 2, metric: 'engagement', threshold: 0.3, type: 'CRITICAL' });
    }

    if (stageRes.dimension_scores.consistencia < 0.5) {
        tolerable.push({ code: 'INCONSISTENT_SIGNAL', priority: 3, metric: 'consistencia', threshold: 0.5, type: 'TOLERABLE' });
    }

    return { critical: critical.slice(0, 3), tolerable };
}

export function getMetricsContext(classification: AssetClassification): MetricsContext {
    if (classification.type === 'PROFESIONAL') {
        return {
            focus_metrics: ['authority_signals', 'conversion_infrastructure', 'professional_credibility'],
            ignore_metrics: ['viral_coefficient', 'daily_story_volume']
        };
    } else {
        return {
            focus_metrics: ['community_retention', 'viral_coefficient'],
            ignore_metrics: ['formal_credentials', 'linkedin_cross_ref']
        };
    }
}

// --- LAYER 0 LOGIC: CROSS-REFERENCE ---

export function analyzeIntent(intent: DeclaredIntent, stage: AssetStageResult, classification: AssetClassification): IntentAnalysis {
    const flags: string[] = [];
    let coherence: IntentAnalysis['coherence'] = 'ALTA';
    let risk_latency = 1.0;

    // 1. Ambition vs Stage Incoherence
    if (intent.ambition === 'EXPANSION' && stage.stage === 'LOW') {
        // High ambition, low reality -> Friction
        flags.push("DISONANCIA: AMBICION_NO_SOPORTADA_POR_ESTRUCTURA");
        coherence = 'MEDIA';
        risk_latency = 1.5;
    }

    if (intent.ambition === 'LIDERAZGO' && stage.stage !== 'HIGH') {
        flags.push("BRECHA_DE_AUTORIDAD: LIDERAZGO_REQUIERE_VALIDACION_ALTA");
        coherence = 'BAJA';
    }

    // 2. Nature vs Audience (Invalid cases)
    if (intent.nature === 'MARCA_PERSONAL' && intent.audience === 'B2G') {
        flags.push("ERROR_TACTICO: PERSONAL_BRAND_EN_SECTOR_GOBIERNO");
        coherence = 'CRITICA'; // Blocks advance often
    }

    // 3. Market Expansion Risks
    if (intent.market === 'GLOBAL' && stage.stage === 'LOW') {
        flags.push("RIESGO_DILUCION: ALCANCE_GLOBAL_SIN_BASE_LOCAL");
        risk_latency = 2.0;
    }

    return {
        coherence,
        flags,
        risk_multipliers: {
            latency: risk_latency,
            conversion: 1.0 // Placeholder
        }
    };
}

// --- INTERVENTION ENGINE (UPDATED) ---

export function decideIntervention(
    classification: AssetClassification,
    stage: AssetStageResult,
    problems: { critical: Problem[], tolerable: Problem[] },
    intent?: DeclaredIntent // Optional for backward compatibility, but required for Layer 0
): InterventionDecision {

    let recommendation: InterventionType = 'NO_INTERVENIR';
    let rationale = "El activo opera dentro de parámetros aceptables.";
    let complexity: InterventionDecision['complexity_level'] = 'baja';
    let avoidance: InterventionType[] = [];

    const criticalCount = problems.critical.length;
    const isHighStage = stage.stage === 'HIGH';
    const isMedical = classification.subtype === 'MEDICO_SALUD';

    // --- SENSITIVITY ADJUSTMENT (LAYER 0) ---
    // If ambition is HIGH, we are stricter.
    const strictMode = intent?.ambition === 'LIDERAZGO' || intent?.ambition === 'EXPANSION';

    // --- BLOCK 2: COHERENCE MATRIX ---

    if (criticalCount === 0) {
        if (stage.stage === 'LOW') {
            if (strictMode) {
                recommendation = 'OPTIMIZACION_GUIADA'; // Must grow to meet ambition
                rationale = "Estructura sana pero insuficiente para ambición declarada. Requiere aceleración vectorizada.";
            } else {
                recommendation = 'NO_INTERVENIR'; // Fine for Survival/Competition
                rationale = "Alineación correcta para objetivos de mantenimiento.";
            }
        } else {
            // High Stage + No Problems
            if (intent?.ambition === 'EXPANSION') {
                recommendation = 'INTERVENCION_ESTRUCTURAL'; // Scaling is hard
                complexity = 'alta';
                rationale = "La expansión agresiva requiere refactorización de arquitectura de retención.";
            } else {
                recommendation = 'NO_INTERVENIR';
                rationale = "Posición dominante consolidada. No se requiere intervención.";
            }
        }
    } else {
        // Has Critical Problems
        if (isHighStage) {
            recommendation = 'AUDITORIA_PROFUNDA';
            complexity = 'critica';
            rationale = "Activo de alto valor con riesgos críticos detectados. Requiere diagnóstico forense profundo.";
        } else if (stage.stage === 'MID') {
            recommendation = 'INTERVENCION_ESTRUCTURAL';
            complexity = 'alta';
            rationale = "Fricción estructural en etapa de consolidación. Requiere reingeniería.";
        } else {
            // Low Stage
            recommendation = 'AJUSTE_TECNICO_PUNTUAL';
            complexity = 'media';
            rationale = "Iniciando tracción. Corregir bloqueo técnico específico.";
        }
    }

    // --- BLOCK 3: PROTECTION & VALIDATION rules ---

    // Rule: Regulatory Block (Medical)
    if (isMedical && ['OPTIMIZACION_GUIADA'].includes(recommendation)) {
        recommendation = 'AJUSTE_TECNICO_PUNTUAL';
        rationale += " [LIMITACION REGULATORIA: INTERVENCION MINIMA]";
        avoidance.push('INTERVENCION_ESTRUCTURAL', 'OPTIMIZACION_GUIADA');
    }

    // Rule: Incoherence Block (Layer 0)
    // If Intent is Critically Incoherent, we might enforce Structural Intervention to fix strategy
    if (intent && AnalyzeIntentHelper(intent, stage, classification).coherence === 'CRITICA') {
        recommendation = 'INTERVENCION_ESTRUCTURAL';
        complexity = 'critica';
        rationale = "DISONANCIA ESTRATÉGICA TOTAL. La configuración operativa contradice la naturaleza del activo.";
    }

    // Rule: Over-intervention (Low Stage getting Deep Audit)
    if (stage.stage === 'LOW' && recommendation === 'AUDITORIA_PROFUNDA') {
        recommendation = 'INTERVENCION_ESTRUCTURAL'; // Downgrade
        complexity = 'alta';
        rationale = "Ajuste de alcance por madurez del activo.";
    }

    return {
        recommended_intervention: recommendation,
        complexity_level: complexity,
        investment_coherence: stage.dimension_scores.consistencia > 0.6 && stage.composite_score > 0.4,
        intervention_risk: isMedical ? 'alto' : 'bajo',
        do_not_recommend: avoidance,
        rationale: rationale
    };
}

// Helper because I can't call exported function easily inside another exported function in the same var scope sometimes depending on bundler, but here it's fine.
// using a local wrapper just in case.
function AnalyzeIntentHelper(intent: DeclaredIntent, stage: AssetStageResult, classification: AssetClassification) {
    return analyzeIntent(intent, stage, classification);
}

export function runForensicPipeline(input: RawInputData, intent?: DeclaredIntent): DiagnosisObject {
    const classification = classifyAsset(input);
    const stage = detectStage(input, classification);
    const problems = prioritizeProblems(stage, classification);
    const context = getMetricsContext(classification);

    // Analyze Intent if provided
    let intentAnalysis: IntentAnalysis | undefined;
    if (intent) {
        intentAnalysis = analyzeIntent(intent, stage, classification);
    }

    // Decide based on all inputs
    const intervention = decideIntervention(classification, stage, problems, intent);

    return {
        asset_classification: classification,
        asset_stage: stage,
        problems,
        metrics_context: context,
        intervention_decision: intervention,
        intent_analysis: intentAnalysis,
        declared_intent: intent
    };
}
