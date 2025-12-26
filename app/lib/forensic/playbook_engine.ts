import { DiagnosisObject } from './intelligence';
import { ClassifierResult } from './value_classifier';
import { getProtocolFor, SubverticalID, VerticalID } from './knowledge_base';

export type PlaybookID = 'PB_MED_01' | 'PB_RE_01' | 'PB_TR_01' | 'PB_GEN_01' | 'PB_BLOCK' | 'PB_DOWNGRADE';

// Phase 52 extended result
export interface PlaybookResult {
    selected_playbook: PlaybookID;
    protocol_id: string; // The specific sequence ID
    next_step: string; // The atomic first step
    eligible: boolean;
    reason: string;
    modules: string[];
    commercial_route: 'HIGH_TICKET' | 'LOW_TICKET' | 'NO_OFFER';
    status: 'COMPLETED' | 'ABORTED' | 'NO_INTERVENIR';
    outcomes: string[];
}

export function runPlaybookEngine(diagnosis: DiagnosisObject, classification: ClassifierResult): PlaybookResult {
    // 1. Check Hard Blocks first
    if (classification.decision === 'BLOCK' || classification.decision === 'NO_INTERVENIR') {
        return {
            selected_playbook: 'PB_BLOCK',
            protocol_id: 'NONE',
            next_step: 'NONE',
            eligible: false,
            reason: classification.rationale,
            modules: [],
            commercial_route: 'NO_OFFER',
            status: 'ABORTED',
            outcomes: [classification.rationale]
        };
    }

    if (classification.decision === 'DOWNGRADE_ONLY') {
        return {
            selected_playbook: 'PB_DOWNGRADE',
            protocol_id: 'STANDARD_PROTOCOL',
            next_step: 'OPTIMIZACION_BASICA',
            eligible: false,
            reason: classification.rationale,
            modules: ['LOW_TICKET_OPTIMIZATION'],
            commercial_route: 'LOW_TICKET',
            status: 'COMPLETED',
            outcomes: ["Downgrade forzado por clasificación."]
        };
    }

    // 2. Select Protocol based on Vertical/Subvertical
    const vertical = (classification.vertical_detected || 'UNKNOWN') as VerticalID;
    const subvertical = (classification.subvertical_detected || 'GENERIC_SUBVERTICAL') as SubverticalID;

    // Safety check for getProtocolFor
    let protocol = getProtocolFor(subvertical, vertical);
    if (!protocol) {
        // Fallback if KB issue
        protocol = {
            id: 'FALLBACK_PROTOCOL',
            verticals: [],
            sequence: [{ step: 'AUTHORITY_POSITIONING', blocking: true, prerequisites: [], reason: 'Fallback' }]
        } as any;
    }

    const firstStep = protocol.sequence[0];

    // 3. Map to Legacy Playbook ID
    let playbookId: PlaybookID = 'PB_GEN_01';
    if (vertical === 'FINANCE_TRADING') playbookId = 'PB_TR_01';
    if (vertical === 'EDUCATION_INFO' && subvertical !== 'MEDICAL_AESTHETICS') playbookId = 'PB_GEN_01';
    if (subvertical === 'MEDICAL_AESTHETICS' || subvertical === 'SURGEON_PRIVATE' || subvertical === 'MEDICAL_CLINIC') playbookId = 'PB_MED_01';
    if (vertical === 'REAL_ESTATE_LUXURY' || vertical === 'REAL_ESTATE') playbookId = 'PB_RE_01';

    // 4. Check Blocking Status of First Step
    // Phase 52: We assume the first step IS the blocking step for now, until we statefully track progress.
    // For V1, the system always recommends STARTING the protocol at step 1.

    return {
        selected_playbook: playbookId,
        protocol_id: protocol.id,
        next_step: firstStep.step,
        eligible: true,
        reason: `Protocolo ${protocol.id} activado. Fase 1: ${firstStep.step}`,
        modules: protocol.sequence.map(s => s.step),
        commercial_route: 'HIGH_TICKET', // Default for protocols
        status: 'COMPLETED', // Logic completed successfully
        outcomes: [`Protocolo ${protocol.id} asignado.`]
    };
}
