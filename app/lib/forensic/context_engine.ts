import { RawInputData } from "./intelligence";
import { AssetStageResult } from "./intelligence";

export interface InferredContext {
    execution_capacity: 'LOW' | 'MEDIUM' | 'HIGH';
    financial_capacity: 'BOOTSTRAP' | 'SEED' | 'SCALING';
    operational_maturity: 'CHAOTIC' | 'STRUCTURED' | 'OPTIMIZED';
    inference_confidence: number;
}

export function inferContext(input: RawInputData, stage: AssetStageResult): InferredContext {

    // 1. EXECUTION CAPACITY (Consistency Proxy)
    // Assuming we had last_post_date and first_post_date to calc frequency.
    // Be conservative for now.
    let execCap: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    if (input.posts_count > 50) execCap = 'MEDIUM';
    if (input.posts_count > 200) execCap = 'HIGH';

    // 2. FINANCIAL CAPACITY (Implicit Signal Proxy)
    // High Verification + High Follower Count usually implies budget.
    let finCap: 'BOOTSTRAP' | 'SEED' | 'SCALING' = 'BOOTSTRAP';
    if (input.followers_count > 50000) finCap = 'SEED';
    if (input.followers_count > 200000 || input.is_verified) finCap = 'SCALING';

    // 3. OPERATIONAL MATURITY (Stage Proxy)
    let opsMat: 'CHAOTIC' | 'STRUCTURED' | 'OPTIMIZED' = 'CHAOTIC';
    if (stage === 'GROWTH') opsMat = 'STRUCTURED';
    if (stage === 'MATURITY') opsMat = 'OPTIMIZED';

    return {
        execution_capacity: execCap,
        financial_capacity: finCap,
        operational_maturity: opsMat,
        inference_confidence: 0.85 // Static high confidence for V3.0 logic
    };
}
