import { DiagnosisObject } from './intelligence';
import { detectVertical, VERTICALS } from './knowledge_base';

// --- TYPES ---

export type ValueTier = 'HIGH_VALUE' | 'LOW_VALUE' | 'RISK';
export type GateDecision = 'ALLOW_PLAYBOOK' | 'DOWNGRADE_ONLY' | 'NO_INTERVENIR' | 'BLOCK';

export interface ClassifierResult {
    tier: ValueTier;
    decision: GateDecision;
    rationale: string;
    vertical_detected?: string;
}

// --- LOGIC ---

export function classifyValueRisk(diagnosis: DiagnosisObject): ClassifierResult {
    const { asset_classification, asset_stage, intent_analysis } = diagnosis;
    const subtype = asset_classification.subtype;
    const stage = asset_stage.stage;
    const riskScore = asset_stage.dimension_scores.riesgo;
    const intentNature = intent_analysis?.declared.nature || '';
    const ambition = intent_analysis?.declared.ambition || '';

    // 0. DETECT VERTICAL
    const verticalDef = detectVertical(subtype, intentNature);

    // 1. CHECK KB BIAS AND RISKS

    // BIAS: DOWNGRADE_ALWAYS (e.g. Influencers)
    if (verticalDef.decision_bias === 'DOWNGRADE_ALWAYS') {
        return {
            tier: 'LOW_VALUE',
            decision: 'DOWNGRADE_ONLY',
            rationale: `Vertical ${verticalDef.vertical}: Estructura no apta para intervención profunda.`,
            vertical_detected: verticalDef.vertical
        };
    }

    // BIAS: BLOCK_IF_LOW_STAGE (e.g. Finance)
    if (verticalDef.decision_bias === 'BLOCK_IF_LOW_STAGE' && stage === 'LOW') {
        return {
            tier: 'RISK',
            decision: 'BLOCK',
            rationale: `Vertical ${verticalDef.vertical}: Bloqueo por riesgo en etapa inicial sin validación.`,
            vertical_detected: verticalDef.vertical
        };
    }

    // BIAS: DOWNGRADE_IF_NO_FUNNEL (e.g. Ecommerce)
    if (verticalDef.decision_bias === 'DOWNGRADE_IF_NO_FUNNEL' && stage === 'LOW') {
        return {
            tier: 'LOW_VALUE',
            decision: 'DOWNGRADE_ONLY',
            rationale: `Vertical ${verticalDef.vertical}: Infraestructura de conversión no detectada (Funnel/Checkout).`,
            vertical_detected: verticalDef.vertical
        };
    }

    // 2. CHECK LEGACY / HARD RISK (Fallback)
    if (subtype === 'MEDICO_SALUD' && riskScore > 0.7) {
        return { tier: 'RISK', decision: 'BLOCK', rationale: "Sector Salud con Alto Riesgo Visual/Compliance.", vertical_detected: verticalDef.vertical };
    }
    if (stage === 'HIGH' && asset_stage.dimension_scores.consistencia < 0.3) {
        return { tier: 'RISK', decision: 'NO_INTERVENIR', rationale: "High Stage con Inactividad Critica.", vertical_detected: verticalDef.vertical };
    }

    // 3. CHECK HIGH VALUE
    const isPremiumSubtype = ['MEDICO_SALUD', 'REAL_ESTATE', 'FOUNDER', 'ATHLETE', 'FINANCE', 'TRADING', 'SAAS', 'TECH', 'CONSULTING', 'AGENCY'].includes(subtype);
    const isMidHigh = ['MID', 'HIGH', 'HIGH_POTENTIAL'].includes(stage);
    const highAmbition = ['LIDERAZGO', 'EXPANSION'].includes(ambition);

    // Allow SaaS/B2B Services if Stable/Real Product (Stage >= MID)
    if ((verticalDef.decision_bias === 'ALLOW_IF_REAL_PRODUCT' || verticalDef.decision_bias === 'ALLOW_STABLE') && isMidHigh) {
        return {
            tier: 'HIGH_VALUE',
            decision: 'ALLOW_PLAYBOOK',
            rationale: `Vertical ${verticalDef.vertical}: Activo Validado y Estructura Detectada.`,
            vertical_detected: verticalDef.vertical
        };
    }

    // Legacy Finance Check
    if (verticalDef.vertical === 'FINANCE_TRADING' && isMidHigh && highAmbition) {
        return { tier: 'HIGH_VALUE', decision: 'ALLOW_PLAYBOOK', rationale: "Activo Premium con Estructura y Ambición Coherente.", vertical_detected: verticalDef.vertical };
    }

    // General Premium
    if (isPremiumSubtype && isMidHigh && highAmbition) {
        return { tier: 'HIGH_VALUE', decision: 'ALLOW_PLAYBOOK', rationale: "Activo Premium con Estructura y Ambición Coherente.", vertical_detected: verticalDef.vertical };
    }

    // 4. CHECK GENERIC/LOW VALUE
    // If bias is DOWNGRADE_IF_GENERIC
    if (verticalDef.decision_bias === 'DOWNGRADE_IF_GENERIC' && !highAmbition) {
        return { tier: 'LOW_VALUE', decision: 'DOWNGRADE_ONLY', rationale: "Vertical requiere ambición probada para escalado.", vertical_detected: verticalDef.vertical };
    }

    // Default Fallback
    return { tier: 'LOW_VALUE', decision: 'DOWNGRADE_ONLY', rationale: "Clasificación Estándar.", vertical_detected: verticalDef.vertical };
}
