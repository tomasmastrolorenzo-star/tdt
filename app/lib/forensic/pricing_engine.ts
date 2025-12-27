import { DiagnosisObject } from './intelligence';
import { ClassifierResult } from './value_classifier';
import { PlaybookResult } from './playbook_engine';
import { SubverticalID } from './knowledge_base';

export type PricingTier = 'LOW_TICKET' | 'MID_TICKET' | 'HIGH_TICKET' | 'NONE';

export interface PricingResult {
    tier: PricingTier;
    label: string;
    allowed_steps: string[];
    reason: string;
    is_locked: boolean;
    progressive_path: PricingTier[];
}

export function calculateImpliedPricing(
    diagnosis: DiagnosisObject,
    classification: ClassifierResult,
    playbook: PlaybookResult
): PricingResult {

    // 1. HARD BLOCKS (Safety First)
    if (classification.decision === 'BLOCK' || classification.decision === 'NO_INTERVENIR') {
        return {
            tier: 'NONE',
            label: 'BLOQUEADO',
            allowed_steps: [],
            reason: classification.rationale,
            is_locked: true,
            progressive_path: []
        };
    }

    const intent = diagnosis.declared_intent;

    // --- PHASE 61: INTENT-BASED GATES ---

    if (intent) {
        // CASE C: MEDICAL RISK (Medical + Stage Low + Aggressive Ambition)
        if (diagnosis.asset_classification.subtype === 'MEDICO_SALUD') {
            if (diagnosis.asset_stage.stage === 'LOW' && (intent.ambition === 'EXPANSION' || intent.ambition === 'LIDERAZGO')) {
                return {
                    tier: 'NONE',
                    label: 'PROTOCOLO DE SEGURIDAD',
                    allowed_steps: [],
                    reason: "Medical Entity with insufficient digital footprint for aggressive scaling. Risk of malpractice signaling.",
                    is_locked: true,
                    progressive_path: []
                };
            }
        }

        // CASE B: ASPIRATIONAL MISMATCH (Scale Ambition + Low Stage)
        if (intent.ambition === 'EXPANSION' && diagnosis.asset_stage.stage === 'LOW') {
            return {
                tier: 'LOW_TICKET',
                label: 'OPTIMIZACION_BASICA',
                allowed_steps: ['INFRASTRUCTURE_SETUP', 'CONVERSION_OPTIMIZATION'],
                reason: "Ambition (Scale) exceeds current structural capacity. Foundation required.",
                is_locked: true,
                progressive_path: ['LOW_TICKET', 'MID_TICKET']
            };
        }

        // COMMITMENT FILTER (Not Full -> Mid Cap)
        if (intent.commitment !== 'FULL') {
            // Cannot access High Ticket
            if (diagnosis.asset_stage.stage === 'HIGH') {
                // Downgrade High to Mid if no commitment
                return {
                    tier: 'MID_TICKET',
                    label: 'AJUSTE_TECNICO',
                    allowed_steps: playbook.modules.slice(0, 3), // Partial access
                    reason: "High Ticket requires FULL commitment. Scope limited to Technical Adjustments.",
                    is_locked: false,
                    progressive_path: ['MID_TICKET', 'HIGH_TICKET']
                };
            }
        }
    }

    const stage = diagnosis.asset_stage.stage;
    const subvertical = (classification.subvertical_detected || 'GENERIC_SUBVERTICAL') as SubverticalID;
    const nextStep = playbook.next_step;

    // 2. STAGE GATES
    // LOW_STAGE + Any Vertical -> Never HIGH_TICKET
    if (stage === 'LOW') {
        // Exception: If they have huge followers but low engagement? No, Stage LOW usually means <1k or bad metrics.
        // Force Low Ticket
        return {
            tier: 'LOW_TICKET',
            label: 'OPTIMIZACION_GUIADA',
            allowed_steps: ['INFRASTRUCTURE_SETUP', 'CONVERSION_OPTIMIZATION'],
            reason: "Stage LOW requires basic optimization before structural intervention.",
            is_locked: true,
            progressive_path: ['LOW_TICKET', 'MID_TICKET']
        };
    }

    // 3. AUTOMATIC DOWNGRADES

    // ECOMMERCE without CHECKOUT -> LOW_TICKET
    if (subvertical === 'ECOMMERCE_DTC' && nextStep === 'INFRASTRUCTURE_SETUP') {
        return {
            tier: 'LOW_TICKET',
            label: 'OPTIMIZACION_GUIADA',
            allowed_steps: ['INFRASTRUCTURE_SETUP'],
            reason: "Ecommerce requires valid Checkout infrastructure before High Ticket intervention.",
            is_locked: true,
            progressive_path: ['LOW_TICKET', 'HIGH_TICKET']
        };
    }

    // VISUAL_COMPLIANCE blocking -> MID_TICKET (Correction Phase)
    if (nextStep === 'VISUAL_COMPLIANCE') {
        return {
            tier: 'MID_TICKET',
            label: 'AJUSTE_TECNICO',
            allowed_steps: ['VISUAL_COMPLIANCE'],
            reason: "Critical Visual Compliance check required. High Ticket suspended until resolved.",
            is_locked: true,
            progressive_path: ['MID_TICKET', 'HIGH_TICKET']
        };
    }

    // AUTHORITY_POSITIONING blocking -> MID_TICKET or HIGH_TICKET depends on Risk
    if (nextStep === 'AUTHORITY_POSITIONING') {
        // If Risk is Medium/High, start with MID
        if (diagnosis.asset_stage.dimension_scores.riesgo > 0.4) {
            return {
                tier: 'MID_TICKET',
                label: 'AJUSTE_TECNICO',
                allowed_steps: ['AUTHORITY_POSITIONING'],
                reason: "Risk profile suggests establishing Authority before Structural scale.",
                is_locked: true,
                progressive_path: ['MID_TICKET', 'HIGH_TICKET']
            };
        }
    }

    // 4. HIGH TICKET GATES
    const isMidOrHigh = stage === 'MID' || stage === 'HIGH';
    const riskNotHigh = diagnosis.asset_stage.dimension_scores.riesgo < 0.7; // 0.8 is block usually

    if (isMidOrHigh && riskNotHigh) {
        // ELIGIBLE FOR HIGH TICKET
        return {
            tier: 'HIGH_TICKET',
            label: 'INTERVENCION_ESTRUCTURAL',
            allowed_steps: playbook.modules, // Full access
            reason: "Asset qualifies for Structural Intervention.",
            is_locked: false,
            progressive_path: ['HIGH_TICKET']
        };
    }

    // Default Fallback -> MID (Safe middle ground)
    return {
        tier: 'MID_TICKET',
        label: 'AJUSTE_TECNICO',
        allowed_steps: [nextStep],
        reason: "Standard intervention protocol.",
        is_locked: false,
        progressive_path: ['MID_TICKET', 'HIGH_TICKET']
    };
}
