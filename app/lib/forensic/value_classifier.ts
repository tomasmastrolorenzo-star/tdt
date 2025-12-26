import { DiagnosisObject } from './intelligence';

// --- TYPES ---

export type ValueTier = 'HIGH_VALUE' | 'LOW_VALUE' | 'RISK';
export type GateDecision = 'ALLOW_PLAYBOOK' | 'DOWNGRADE_ONLY' | 'NO_INTERVENIR' | 'BLOCK';

export interface ClassifierResult {
    tier: ValueTier;
    decision: GateDecision;
    rationale: string;
}

// --- CONSTANTS ---

const PREMIUM_KEYWORDS = ['dubai', 'miami', 'london', 'ny', 'nyc', 'investor', 'vc', 'venture', 'equity', 'longevity', 'aesthetic', 'cirugia', 'plastic', 'nba', 'fifa', 'nfl', 'pro', 'elite'];
const VANITY_KEYWORDS = ['influencer', 'collab', 'promo', 'ugc', 'model', 'lifestyle', 'travel', 'fashion', 'beauty', 'tiktok'];

// --- LOGIC ---

export function classifyValueRisk(diagnosis: DiagnosisObject): ClassifierResult {
    const { asset_classification, asset_stage, intent_analysis, problems } = diagnosis;
    const bioLower = ""; // Note: diagnosis object doesn't carry bio text directly in current interface, usually.
    // Wait, DiagnosisObject in intelligence.ts MIGHT NOT have bio text. 
    // Check intelligence.ts interface. 
    // If not, we rely on subtype and intent.
    // The Route passes `rawInput` to pipeline, but pipeline output `DiagnosisObject` might not preserve raw bio.
    // However, `asset_classification` usually has derived data.
    // Let's assume we use what we have in DiagnosisObject.
    // Ideally, we should pass raw bio or context if needed. 
    // BUT classification logic in intelligence.ts already processed kws.
    // Let's rely on Subtype + Stage + Indicators.

    const subtype = asset_classification.subtype;
    const stage = asset_stage.stage;
    const riskScore = asset_stage.dimension_scores.riesgo;

    // 1. CHECK RISK (BLOCKING)
    if (subtype === 'MEDICO_SALUD' && riskScore > 0.7) {
        return { tier: 'RISK', decision: 'BLOCK', rationale: "Sector Salud con Alto Riesgo Visual/Compliance." };
    }
    if (stage === 'HIGH' && asset_stage.dimension_scores.consistencia < 0.3) {
        return { tier: 'RISK', decision: 'NO_INTERVENIR', rationale: "High Stage con Inactividad Critica." };
    }

    // 2. CHECK HIGH VALUE
    // "Segmento premium declarado"
    // We don't have the BIO here easily unless we pass it.
    // Or we assume `intent_analysis` captures "Ambition".
    const ambition = intent_analysis?.declared.ambition;
    const isPremiumSubtype = ['MEDICO_SALUD', 'REAL_ESTATE', 'FOUNDER', 'ATHLETE'].includes(subtype);
    const isMidHigh = ['MID', 'HIGH', 'HIGH_POTENTIAL'].includes(stage);
    const highAmbition = ['LIDERAZGO', 'EXPANSION'].includes(ambition || '');

    if (isPremiumSubtype && isMidHigh && highAmbition) {
        return { tier: 'HIGH_VALUE', decision: 'ALLOW_PLAYBOOK', rationale: "Activo Premium con Estructura y Ambición Coherente." };
    }

    // 3. CHECK LOW VALUE
    const isGenericSubtype = ['INFLUENCER', 'CREATOR', 'OTHER'].includes(subtype);
    const isLowStage = stage === 'LOW';
    // If Stage is Low and Subtype is Generic -> Low Value
    if (isLowStage || (isGenericSubtype && !highAmbition)) {
        return { tier: 'LOW_VALUE', decision: 'DOWNGRADE_ONLY', rationale: "Activo en etapa inicial o enfoque vanity." };
    }

    // Default Fallback
    return { tier: 'LOW_VALUE', decision: 'DOWNGRADE_ONLY', rationale: "Clasificación Estándar." };
}
