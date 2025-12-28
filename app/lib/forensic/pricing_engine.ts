import { GapAnalysis } from "./gap_engine";
import { PlaybookSelection } from "./playbook_matrix";
import { RiskAssessment } from "./risk_engine";

export interface FinalPricing {
    base_price: number;
    modifier: number;
    final_price: number;
    currency: string;
    tier_label: string;
}

export function determinePricing(
    playbook: PlaybookSelection,
    gap: GapAnalysis,
    subvertical: string,
    risk: RiskAssessment
): FinalPricing {

    // 1. BASE PRICE BY SUBVERTICAL (Mocked Bases)
    let base = 1000;
    if (subvertical === 'SALUD_ESTETICA') base = 2500;
    if (subvertical === 'FINANZAS_CRYPTO') base = 3000;
    if (subvertical === 'NUTRICION') base = 1500;

    // 2. GAP MODIFIER (Downgrade logic)
    // Gap Score 0.0 -> Perfect match -> Mod 1.0
    // Gap Score 1.0 -> Huge Gap -> Mod 0.3 (Massive Downgrade)
    // Formula: 1.0 - (Gap Score * 0.7)

    let mod = 1.0 - (gap.score * 0.7);
    mod = Math.max(0.3, parseFloat(mod.toFixed(2))); // Floor at 0.3

    // 3. COMPLIANCE PATH (Medical Hardening)
    // If High Risk (but not Blocked) + Low Gap (Competent) -> Upsell Compliance
    let isCompliance = false;
    if (subvertical === 'SALUD_ESTETICA' || subvertical === 'MEDICO_SALUD') {
        if (risk.score >= 0.7 && risk.score < 0.9) {
            if (gap.score <= 0.3) {
                // COMPLIANCE PATH TRIGGERED
                // Premium Doctor needing legal structuring
                mod = 1.5; // +50% Markup
                isCompliance = true;
            }
        }
    }

    // 4. FINAL CALC
    const final = Math.floor(base * mod);

    // 5. TIER LABELING
    let label = 'STANDARD_ENTRY'; // Covers Type A (Conservative / Operational Foundation)

    if (isCompliance) {
        label = 'COMPLIANCE_PATH'; // Covers Type C (Premium Verified)
    } else if (mod < 0.6) {
        label = 'RESTRICTED_ACCESS'; // Covers Type B (Aspirational/Delusional)
    } else if (mod >= 0.95) {
        label = 'PRIORITY_ACCESS'; // Only for Perfect Matches (top 5%)
    }

    return {
        base_price: base,
        modifier: mod,
        final_price: final,
        currency: 'USD',
        tier_label: label
    };
}
