import { InferredContext } from "./context_engine";
import { DeclaredIntent } from "@/components/protocol-calibration";
import { RawInputData } from "./intelligence";

export type GapClassification = 'REALISTIC' | 'OPTIMISTIC' | 'DELUSIONAL';

export interface GapAnalysis {
    score: number; // 0.0 (No Gap) to 1.0 (Huge Gap)
    classification: GapClassification;
    reason: string;
}

export function calculateGap(intent: DeclaredIntent, context: InferredContext, input: RawInputData): GapAnalysis {

    // NORMALIZE AMBITION (1-4)
    const ambitionWeight: Record<string, number> = {
        'SOBREVIVENCIA': 1,
        'COMPETENCIA': 2,
        'LIDERAZGO': 3,
        'EXPANSION': 4
    };
    const objKey = intent.objective || 'COMPETENCIA';
    const ambitionScore = ambitionWeight[objKey] || 2;

    // NORMALIZE CAPACITY (1-3)
    const capacityWeight: Record<string, number> = {
        'LOW': 1,
        'MEDIUM': 2,
        'HIGH': 3
    };
    // Fix: Ensure we match the key type 'LOW' | 'MEDIUM' | 'HIGH' or use string index
    const capKey = context.execution_capacity || 'LOW';
    const capacityScore = capacityWeight[capKey] || 1;

    // NORMALIZE MATURITY (1-3)
    const maturityWeight: Record<string, number> = {
        'CHAOTIC': 1,
        'STRUCTURED': 2,
        'OPTIMIZED': 3
    };
    const matKey = context.operational_maturity || 'CHAOTIC';
    const maturityScore = maturityWeight[matKey] || 1;

    const totalCapacity = (capacityScore + maturityScore) / 2; // Max 3

    // GAP CALCULATION
    const rawGap = ambitionScore - totalCapacity;
    let score = Math.max(0, rawGap / 3);

    // --- PHASE 67: MEDICAL CREDENTIAL MODIFIERS ---
    // Prevent blocking high-value offline doctors with low social maturity.
    const bio = (input.biography || '').toLowerCase();
    let credentialMod = 0;

    if (bio.includes('dr.') || bio.includes('dra.') || bio.includes('md') || bio.includes('especialista')) {
        credentialMod += 0.3; // Verified Specialty Proxy
    }
    if (bio.includes('hospital') || bio.includes('clinica') || bio.includes('centro') || bio.includes('board')) {
        credentialMod += 0.2; // Institutional Affiliation
    }
    if (bio.includes('años') || bio.includes('years') || bio.includes('exp') || bio.includes('fundador')) {
        credentialMod += 0.2; // Experience Proxy
    }
    // Scientific validation
    if (bio.includes('phd') || bio.includes('msc') || bio.includes('universidad')) {
        credentialMod += 0.1;
    }

    // Apply Modifier (Max -0.8 reduction of gap)
    if (credentialMod > 0) {
        const reduction = Math.min(credentialMod, 0.8);
        score = Math.max(0, score - reduction);
    }

    let classification: GapClassification = 'REALISTIC';
    let reason = "Capacity aligns with ambition.";

    if (score > 0.6) {
        classification = 'DELUSIONAL';
        reason = "Declared ambition exceeds structural capacity by a critical margin.";
    } else if (score > 0.2) {
        classification = 'OPTIMISTIC';
        reason = "Ambition is high relative to current execution metrics. Requires acceleration.";
    }

    return {
        score,
        classification,
        reason
    };
}
