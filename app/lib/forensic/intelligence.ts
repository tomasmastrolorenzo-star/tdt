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

export interface DiagnosisObject {
    asset_classification: AssetClassification;
    asset_stage: AssetStageResult;
    problems: {
        critical: Problem[];
        tolerable: Problem[];
    };
    metrics_context: MetricsContext;
}

// --- BLOCK 1: CLASSIFICATION ---

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

    // Heuristic: Check Keywords
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

    // Determine Main Type based on Subtype & Signals
    let type: AssetType = 'UNK';
    if (['MEDICO_SALUD', 'REAL_ESTATE', 'FOUNDER'].includes(bestSubtype)) {
        type = 'PROFESIONAL';
    } else if (['VIDEO_CREATOR', 'ARTISTA_VISUAL'].includes(bestSubtype)) {
        type = 'CREADOR';
    } else {
        // Fallback Heuristics
        if (data.is_verified || data.followers_count > 100000) type = 'MARCA_ESTABLECIDA' as any; // Temporary mapping
        else type = 'CREADOR'; // Default leans to creator on IG
    }

    // Confidence
    const confidence = Math.min(1.0, 0.4 + (maxMatches * 0.1));

    return { type, subtype: bestSubtype, confidence };
}

// --- BLOCK 2: STAGE DETECTION ---

export function detectStage(data: RawInputData, classification: AssetClassification): AssetStageResult {
    // 1. Escala (0-1)
    // Logarithmic scale up to 1M
    const escala = Math.min(1, Math.log10(Math.max(1, data.followers_count)) / 6);

    // 2. Engagement (0-1)
    // Est. Avg Likes / Followers
    let avgLikes = 0;
    if (data.recent_posts.length > 0) {
        avgLikes = data.recent_posts.reduce((acc, p) => acc + (p.likes || 0), 0) / data.recent_posts.length;
    }
    const engRate = data.followers_count > 0 ? (avgLikes / data.followers_count) : 0;
    // Benchmark roughly 5% is great (1.0), 0.5% is poor (0.1)
    const engagement = Math.min(1, engRate * 20);

    // 3. Consistencia (0-1)
    // Deviation of timestamps
    let consistencia = 0.5;
    if (data.recent_posts.length > 1) {
        // Logic: if variance is high, consistency is low. 
        // For mock, lets assume a standard rigidness calculation
        consistencia = 0.7; // Placeholder logic
    }

    // 4. Autoridad (0-1)
    // Verified + Links + specific keywords
    let autoridad = data.is_verified ? 0.8 : 0.3;
    if (classification.confidence > 0.7) autoridad += 0.2;

    // 5. Riesgo (0-1)
    // High Follow/Following ratio might indicate botting?
    // Or low text density.
    let riesgo = 0.2;
    if (data.followers_count > 10000 && engRate < 0.001) riesgo = 0.9; // High risk (Dead account)

    const scores: DimensionScores = { escala, engagement, consistencia, autoridad, riesgo };

    // Composite
    // Weights depend on Type?
    // For Professional: Authority > Scale
    // For Creator: Engagement > Authority
    let composite = 0;

    if (classification.type === 'PROFESIONAL') {
        composite = (scores.autoridad * 0.4) + (scores.escala * 0.2) + (scores.engagement * 0.2) + (scores.consistencia * 0.2);
    } else {
        composite = (scores.engagement * 0.4) + (scores.escala * 0.3) + (scores.consistencia * 0.2) + (scores.autoridad * 0.1);
    }

    // Stage Classification
    let stage: AssetStage = 'LOW';
    if (composite > 0.75) stage = 'HIGH';
    else if (composite > 0.4) stage = 'MID';

    return { stage, composite_score: composite, dimension_scores: scores };
}

// --- BLOCK 3: PRIORITIZATION ---

export function prioritizeProblems(stageRes: AssetStageResult, classification: AssetClassification): { critical: Problem[], tolerable: Problem[] } {
    const critical: Problem[] = [];
    const tolerable: Problem[] = [];

    // Rules Engine

    // Rule 1: High Risk is always Critical
    if (stageRes.dimension_scores.riesgo > 0.7) {
        critical.push({
            code: 'HIGH_ALGORITHM_RISK',
            priority: 1,
            metric: 'riesgo',
            threshold: 0.7,
            type: 'CRITICAL'
        });
    }

    // Rule 2: Low Authority for Professionals is Critical
    if (classification.type === 'PROFESIONAL' && stageRes.dimension_scores.autoridad < 0.4) {
        critical.push({
            code: 'AUTHORITY_GAP',
            priority: 1,
            metric: 'autoridad',
            threshold: 0.4,
            type: 'CRITICAL'
        });
    }

    // Rule 3: Low Engagement for Creators is Critical
    if (classification.type === 'CREADOR' && stageRes.dimension_scores.engagement < 0.3) {
        critical.push({
            code: 'AUDIENCE_DISCONNECT',
            priority: 2,
            metric: 'engagement',
            threshold: 0.3,
            type: 'CRITICAL'
        });
    }

    // Rule 4: Consistency issues are tolerable usually
    if (stageRes.dimension_scores.consistencia < 0.5) {
        tolerable.push({
            code: 'INCONSISTENT_SIGNAL',
            priority: 3,
            metric: 'consistencia',
            threshold: 0.5,
            type: 'TOLERABLE'
        });
    }

    return { critical: critical.slice(0, 3), tolerable }; // Limit top 3
}

// --- BLOCK 4: CONTEXT ---

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

// --- BLOCK 5: PIPELINE ---

export function runForensicPipeline(input: RawInputData): DiagnosisObject {
    // 1. Classify
    const classification = classifyAsset(input);

    // 2. Score
    const stage = detectStage(input, classification);

    // 3. Prioritize
    const problems = prioritizeProblems(stage, classification);

    // 4. Context
    const context = getMetricsContext(classification);

    return {
        asset_classification: classification,
        asset_stage: stage,
        problems,
        metrics_context: context
    };
}
