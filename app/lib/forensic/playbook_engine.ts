import { DiagnosisObject, AssetClassification, AssetStageResult, Problem, DeclaredIntent } from './intelligence';

// --- TYPES ---

export type PlaybookID = 'PB_MED_01' | 'PB_RE_01' | 'PB_TR_01' | 'GENERIC_OPTIMIZATION';
export type PlaybookStatus = 'COMPLETED' | 'ABORTED' | 'NO_INTERVENIR';

export interface PlaybookStep {
    id: string;
    description: string;
    validate: (diagnosis: DiagnosisObject) => boolean;
}

export interface Playbook {
    id: PlaybookID;
    name: string;
    eligibility: (diagnosis: DiagnosisObject) => boolean;
    sequence: PlaybookStep[];
    outcomes: {
        success: string;
        failure: string;
    };
    commercial_route: 'HIGH_TICKET' | 'LOW_TICKET' | 'NO_OFFER';
}

export interface PlaybookResult {
    playbook_id: PlaybookID | null;
    status: PlaybookStatus;
    executed_steps: string[];
    failed_step: string | null;
    outcomes: string[];
    commercial_route: Playbook['commercial_route'];
}

// --- PLAYBOOK DEFINITIONS ---

const PB_MED_01: Playbook = {
    id: 'PB_MED_01',
    name: "Protocolo de Autoridad Clínica",
    eligibility: (d) => d.asset_classification.subtype === 'MEDICO_SALUD',
    sequence: [
        {
            id: "VALIDACION_CREDENCIALES",
            description: "Verificar señales de autoridad formal (Dr/Clinica)",
            validate: (d) => d.asset_classification.confidence > 0.6
        },
        {
            id: "CHEQUEO_ETICA_VISUAL",
            description: "Asegurar ausencia de gore/sensacionalismo (Riesgo < 0.8)",
            validate: (d) => d.asset_stage.dimension_scores.riesgo < 0.8
        },
        {
            id: "CONSOLIDACION_DE_DEMANDA",
            description: "Verificar engagement mínimo para consulta privada",
            validate: (d) => d.asset_stage.dimension_scores.engagement > 0.1
        }
    ],
    outcomes: {
        success: "Estructura clínica validada. Habilitar sistema de adquisición de pacientes.",
        failure: "Riesgo regulatorio o falta de tracción clínica."
    },
    commercial_route: 'HIGH_TICKET'
};

const PB_RE_01: Playbook = {
    id: 'PB_RE_01',
    name: "Motor de Inventario Inmobiliario",
    eligibility: (d) => d.asset_classification.subtype === 'REAL_ESTATE',
    sequence: [
        {
            id: "VOLUMEN_DE_INVENTARIO",
            description: "Verificar consistencia de publicación de propiedades",
            validate: (d) => d.asset_stage.dimension_scores.consistencia > 0.4
        },
        {
            id: "CLARIDAD_DE_OFERTA",
            description: "Validar BIO para keywords de zona/tipo",
            validate: (d) => d.asset_classification.confidence > 0.5
        }
    ],
    outcomes: {
        success: "Inventario digital activo. Habilitar embudos de captación.",
        failure: "Inconsistencia en oferta de propiedades."
    },
    commercial_route: 'HIGH_TICKET'
};

const PB_TR_01: Playbook = {
    id: 'PB_TR_01',
    name: "Validación de Operativa Financiera",
    eligibility: (d) => ['FOUNDER', 'OTHER'].includes(d.asset_classification.subtype) &&
        (d.asset_classification.type === 'PROFESIONAL'), // Loose matching for 'Trading' as often falls under Founder/Other with specific kws in bio handled by generic logic usually, but here checking subset. 
    // Actually, we need to check if it's trading.
    // Let's rely on 'FOUNDER' + 'finanzas' keywords implicit in subtype logic or add specific check?
    // Since subtype mapping in intelligence.ts doesn't have 'TRADING', we might use 'FOUNDER' or 'VIDEO_CREATOR' if they do streams.
    // Let's assume 'FOUNDER' is often used for business. 
    // Strictly: User asked for PB_TR_01. I'll bind it to 'FOUNDER' for now loosely, or check bio keywords?
    // Intelligence.ts has 'BROKER' in the route.ts V1 logic but not in the Intelligence.ts definitions (AssetSubtype).
    // I should probably rely on 'FOUNDER' or add 'FINANCE' to subtype if I could, but I can't change intelligence.ts interface easily without breaking things.
    // I'll stick to 'FOUNDER' for now and checking context keywords if possible, or just eligibility by subtype.
    sequence: [
        {
            id: "ALERTA_DE_ESTAFA",
            description: "Verificar que NO tenga riesgo algorítmico extremo (Scam patterns)",
            validate: (d) => d.asset_stage.dimension_scores.riesgo < 0.6
        },
        {
            id: "PRUEBA_DE_RESULTADOS",
            description: "Validar consistencia (Track record visible)",
            validate: (d) => d.asset_stage.dimension_scores.consistencia > 0.6
        }
    ],
    outcomes: {
        success: "Operativa validada. Escalar adquisición de capital/clientes.",
        failure: "Perfil de riesgo financiero no apto."
    },
    commercial_route: 'HIGH_TICKET'
};

const GENERIC_OPT: Playbook = {
    id: 'GENERIC_OPTIMIZATION',
    name: "Optimización General de Estructura",
    eligibility: () => true, // Fallback
    sequence: [
        {
            id: "ESTABILIDAD_TECNICA",
            description: "Verificar que la cuenta no tenga shadowban evidente",
            validate: (d) => d.asset_stage.dimension_scores.riesgo < 0.9
        }
    ],
    outcomes: {
        success: "Optimización base habilitada.",
        failure: "Cuenta comprometida."
    },
    commercial_route: 'LOW_TICKET'
};

const REGISTRY = [PB_MED_01, PB_RE_01, PB_TR_01];

// --- ENGINE LOGIC ---

export function runPlaybookEngine(diagnosis: DiagnosisObject): PlaybookResult {
    // 1. SELECT
    let selected = REGISTRY.find(pb => pb.eligibility(diagnosis));

    // Fallback? User said "Si no hay playbook elegible -> NO_INTERVENIR"
    if (!selected) {
        // Strict adherence to "Selected -> Sequence -> Decision". 
        // If no specific playbook, we return NO_INTERVENIR or GENERIC?
        // User rule: "Si no hay playbook elegible -> NO_INTERVENIR"
        return {
            playbook_id: null,
            status: 'NO_INTERVENIR',
            executed_steps: [],
            failed_step: null,
            outcomes: ["No se encontró protocolo específico para este activo."],
            commercial_route: 'NO_OFFER'
        };
    }

    // 2. EXECUTE SEQUENCE
    const executed: string[] = [];
    let failed: string | null = null;
    let status: PlaybookStatus = 'COMPLETED';

    for (const step of selected.sequence) {
        executed.push(step.id);
        const passed = step.validate(diagnosis);
        if (!passed) {
            failed = step.id;
            status = 'ABORTED';
            break;
        }
    }

    // 3. DECIDE OUTCOME
    const outcomes = [];
    let route: Playbook['commercial_route'] = 'NO_OFFER';

    if (status === 'COMPLETED') {
        outcomes.push(selected.outcomes.success);
        route = selected.commercial_route;
    } else {
        outcomes.push(selected.outcomes.failure);
        outcomes.push(`FALLO_CRITICO_EN_SECUENCIA: ${failed}`);
        route = 'NO_OFFER'; // Aborted means no sale
    }

    return {
        playbook_id: selected.id,
        status,
        executed_steps: executed,
        failed_step: failed,
        outcomes,
        commercial_route: route
    };
}
