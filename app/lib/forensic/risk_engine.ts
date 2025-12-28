import { AssetClassification } from "./intelligence";
import { RawInputData } from "./intelligence";

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface RiskAssessment {
    level: RiskLevel;
    score: number; // 0.0 to 1.0
    factors: string[];
}

export function assessRisk(
    input: RawInputData,
    classification: AssetClassification
): RiskAssessment {
    let score = 0.0;
    const factors: string[] = [];
    let level: RiskLevel = 'LOW'; // Initialize level

    // 1. VERTICAL RISK (Compliance)
    // Map subtypes to risk verticals
    if (classification.subtype === 'MEDICO_SALUD' || classification.subtype === 'ECOMMERCE_DTC') { // Assuming FINANZAS_CRYPTO mapped to OTHER or new subtype?
        // Checking for Crypto specifically if needed, or if subtype logic covers it.
        // For now, sticking to known subtypes.
        if (classification.subtype === 'MEDICO_SALUD') {
            score += 0.4;
            factors.push("HIGH_REGULATION_VERTICAL");
        }
    }
    // Correction: Previous code checked 'FINANZAS_CRYPTO' but subtype enum has 'ECOMMERCE_DTC', 'REAL_ESTATE'.
    // Use subtype logic.

    // 2. METRICS HEALTH (Anomaly Detection)
    const engagementRatio = (input.likes_average || 0) / (input.followers_count || 1);

    if (input.followers_count > 10000 && engagementRatio < 0.005) {
        score += 0.3;
        factors.push("SUSPICIOUS_LOW_ENGAGEMENT");
    }

    if (input.followers_count > 5000 && input.posts_count < 10) {
        score += 0.2;
        factors.push("LOW_CONTENT_HISTORY");
    }

    // 4. MEDICAL VERTICAL SPECIFIC (Hardening)
    if (classification.subtype === 'MEDICO_SALUD') {
        const bio = (input.biography || '').toLowerCase();
        const content = input.recent_posts.map(p => p.caption.toLowerCase()).join(' ');
        const fullText = bio + ' ' + content;

        // LEVEL 5: LIFE THREATENING / ILLEGAL (Permanent Block)
        const l5_terms = [
            'curar cancer', 'curar cáncer', 'diabetes reversa', 'autismo cura', 'antivacunas', 'sin quimio',
            'curar ansiedad', 'curar depresion', 'curar depresión', 'dejar antidepresivos', 'bipolar cura',
            'inyecciones ilegales', 'biopolimeros', 'biopolímeros'
        ];
        if (l5_terms.some(t => fullText.includes(t))) {
            score = 1.0;
            factors.push("CRITICAL_MEDICAL_MISINFORMATION");
            level = 'HIGH';
            // We need a way to signal PERMANENT_BLOCK. 
            // Since return type is fixed, we will handle this in intelligence.ts based on factor presence.
        }

        // LEVEL 4: SPECIALTY VIOLATIONS (Oncology/Psychiatry False Claims)
        const l4_terms = ['garantizado', 'resultados inmediatos', 'sin dolor', '100% efectivo', 'cura definitiva'];
        if (l4_terms.some(t => fullText.includes(t))) {
            score = Math.max(score, 0.95);
            factors.push("MEDICAL_GUARANTEE_VIOLATION");
            level = 'HIGH';
        }

        // LEVEL 3: EDUCATIONAL vs SALES
        if (fullText.includes('agenda tu cita') || fullText.includes('promo') || fullText.includes('descuento')) {
            // Commercial intent increases risk in medical
            score += 0.15;
            factors.push("COMMERCIAL_MEDICAL_FOCUS");
        }
    }

    // CALCULATION
    const finalScore = Math.min(score, 1.0);
    // level = 'LOW'; // Removed re-declaration, logic below sets it if needed, or keeps 'HIGH' from L5/L4.

    if (finalScore >= 0.9) level = 'HIGH'; // Medical Threshold
    else if (finalScore > 0.6) level = 'HIGH';
    else if (finalScore > 0.3) level = 'MEDIUM';

    return {
        level,
        score: finalScore,
        factors
    };
}
