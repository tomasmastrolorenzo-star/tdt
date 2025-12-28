import { GapAnalysis } from "./gap_engine";
import { RiskAssessment } from "./risk_engine"; // Import RiskAssessment

export type PlaybookID =
    'PROTOCOL_GENESIS' | 'PROTOCOL_ACCELERATOR' | 'PROTOCOL_DOMINION' | // Low Gap
    'STRUCTURE_REBOOT' | 'MOMENTUM_BUILDER' | 'AUTHORITY_SCALE' | // Med Gap
    'REALITY_CHECK_LITE' | 'PIVOT_REQUIRED' | 'EXIT_STRATEGY' | // High Gap
    'FOUNDATION_MEDICAL' | 'MEDICAL_SCALE' | 'REALITY_ALIGNMENT'; // Medical Specific

export interface PlaybookSelection {
    id: PlaybookID;
    name: string;
    focus: string;
}

export function selectPlaybook(
    gap: GapAnalysis,
    risk: RiskAssessment
): PlaybookSelection {

    const isMedical = risk.factors.includes('HIGH_REGULATION_VERTICAL') || risk.factors.includes('COMMERCIAL_MEDICAL_FOCUS');

    // 1. DELUSIONAL GAPS (Type B)
    if (gap.classification === 'DELUSIONAL' || risk.level === 'HIGH' && risk.score >= 0.9) {
        if (isMedical) {
            return {
                id: 'REALITY_ALIGNMENT',
                name: "PROTOCOLO DE ALINEACIÓN CLÍNICA",
                focus: "Ajuste estructural de expectativas vs capacidad operativa real."
            };
        }
        return {
            id: 'REALITY_CHECK_LITE',
            name: "PROTOCOLO DE RESTRUCTURACIÓN BASE",
            focus: "Alineación de expectativas y mitigación de riesgo estructural."
        };
    }

    // 2. OPTIMISTIC GAPS
    if (gap.classification === 'OPTIMISTIC') {
        return {
            id: 'MOMENTUM_BUILDER',
            name: "PROTOCOLO DE ACELERACIÓN TÁCTICA",
            focus: "Cierre de brecha operativa mediante inyección de volumen."
        };
    }

    // 3. REALISTIC GAPS (Growth enabled)
    // Low Gap -> We can push hard.

    // Type C: Medical + High Risk (Premium Compliance)
    if (isMedical && risk.score >= 0.7) {
        return {
            id: 'MEDICAL_SCALE',
            name: "PROTOCOLO DE ESCALADO CLÍNICO (COMPLIANCE)",
            focus: "Dominancia de mercado bajo estricto marco regulatorio."
        };
    }

    // Type A: Medical + Low Risk (Conservative)
    if (isMedical) {
        return {
            id: 'FOUNDATION_MEDICAL',
            name: "FUNDAMENTOS DE OPERATIVA MÉDICA",
            focus: "Consolidación de autoridad digital y optimización de flujo de pacientes."
        };
    }

    // Generic
    return {
        id: 'PROTOCOL_DOMINION',
        name: "PROTOCOLO DE DOMINANCIA VERTICAL",
        focus: "Captura agresiva de cuota de mercado."
    };
}
