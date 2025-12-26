import { NextResponse } from 'next/server';

// --- TYPES ---

export type AssetType = 'PROFESIONAL' | 'CREADOR' | 'EMPRESA' | 'UNK';
export type AssetSubtype = 'MEDICO_SALUD' | 'ARTISTA_VISUAL' | 'VIDEO_CREATOR' | 'MARCA_ESTABLECIDA' | 'REAL_ESTATE' | 'FOUNDER' | 'OTHER';
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

// --- INTERVENTION ENGINE (PHASE 34) ---

export function decideIntervention(
    classification: AssetClassification,
    stage: AssetStageResult,
    problems: { critical: Problem[], tolerable: Problem[] }
): InterventionDecision {

    let recommendation: InterventionType = 'NO_INTERVENIR';
    let rationale = "El activo opera dentro de parámetros aceptables.";
    let complexity: InterventionDecision['complexity_level'] = 'baja';
    let avoidance: InterventionType[] = [];

    const criticalCount = problems.critical.length;
    const isHighStage = stage.stage === 'HIGH';
    const isMedical = classification.subtype === 'MEDICO_SALUD';

    const hasCapacity = stage.dimension_scores.consistencia > 0.6 && stage.composite_score > 0.4;

    if (criticalCount === 0) {
        if (stage.stage === 'LOW') {
            recommendation = 'OPTIMIZACION_GUIADA';
            rationale = "Sin fallos críticos. Fase de expansión habilitada.";
        } else {
            recommendation = 'NO_INTERVENIR';
            rationale = "Estructura estable y madura. No se requiere intervención.";
        }
    } else {
        if (isHighStage) {
            recommendation = 'AUDITORIA_PROFUNDA';
            complexity = 'critica';
            rationale = "Activo de alto valor con riesgos críticos detectados. Requiere diagnóstico forense profundo.";
        } else if (stage.stage === 'MID') {
            recommendation = 'INTERVENCION_ESTRUCTURAL';
            complexity = 'alta';
            rationale = "Fricción estructural en etapa de consolidación. Requiere reingeniería.";
        } else {
            recommendation = 'AJUSTE_TECNICO_PUNTUAL';
            complexity = 'media';
            rationale = "Iniciando tracción. Corregir bloqueo técnico específico.";
        }
    }

    if (isMedical && ['OPTIMIZACION_GUIADA'].includes(recommendation)) {
        recommendation = 'AJUSTE_TECNICO_PUNTUAL';
        rationale += " [LIMITACION REGULATORIA: INTERVENCION MINIMA]";
        avoidance.push('INTERVENCION_ESTRUCTURAL', 'OPTIMIZACION_GUIADA');
    }

    if (stage.stage === 'LOW' && recommendation === 'AUDITORIA_PROFUNDA') {
        recommendation = 'INTERVENCION_ESTRUCTURAL';
        complexity = 'alta';
        rationale = "Ajuste de alcance por madurez del activo.";
    }

    return {
        recommended_intervention: recommendation,
        complexity_level: complexity,
        investment_coherence: hasCapacity,
        intervention_risk: isMedical ? 'alto' : 'bajo',
        do_not_recommend: avoidance,
        rationale: rationale
    };
}

export function runForensicPipeline(input: RawInputData): DiagnosisObject {
    const classification = classifyAsset(input);
    const stage = detectStage(input, classification);
    const problems = prioritizeProblems(stage, classification);
    const context = getMetricsContext(classification);
    const intervention = decideIntervention(classification, stage, problems);

    return {
        asset_classification: classification,
        asset_stage: stage,
        problems,
        metrics_context: context,
        intervention_decision: intervention
    };
}
