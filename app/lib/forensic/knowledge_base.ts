export type VerticalID = 'FINANCE_TRADING' | 'EDUCATION_INFO' | 'INFLUENCER_GENERAL' | 'ECOMMERCE_DTC' | 'SAAS_B2B' | 'B2B_SERVICES' | 'UNKNOWN';
export type InterventionType = 'OPTIMIZACION_TECNICA' | 'INTERVENCION_ESTRUCTURAL_LIMITADA' | 'GROWTH_AGRESIVO' | 'PROMESAS_DE_RENDIMIENTO' | 'AUTOMATIZACION_DE_MENSAJES' | 'OPTIMIZACION' | 'INTERVENCION_ESTRUCTURAL' | 'VIRALIZACION_VANITY' | 'PROMESAS_DE_RESULTADO' | 'ESCALADO_SIN_PRODUCTO_VALIDO' | 'OPTIMIZACION_BASICA' | 'AUDITORIA_PROFUNDA' | 'CRECIMIENTO_SIN_FUNNEL' | 'VIRALIZACION_GENERALISTA';
export type DecisionBias = 'BLOCK_IF_LOW_STAGE' | 'DOWNGRADE_IF_GENERIC' | 'DOWNGRADE_ALWAYS' | 'DOWNGRADE_IF_NO_FUNNEL' | 'ALLOW_IF_REAL_PRODUCT' | 'ALLOW_STABLE' | 'NONE';

export interface VerticalDefinition {
    vertical: VerticalID;
    risk_level: 'HIGH' | 'MEDIUM_HIGH' | 'MEDIUM' | 'LOW_MEDIUM' | 'LOW';
    compliance_required: boolean;
    primary_value_driver: string;
    allowed_interventions: InterventionType[];
    forbidden_interventions: InterventionType[];
    critical_risks: string[];
    key_metrics: string[];
    ignore_metrics: string[];
    decision_bias: DecisionBias;
    default_block_conditions: string[];
}

export const VERTICALS: Record<VerticalID, VerticalDefinition> = {
    'FINANCE_TRADING': {
        vertical: 'FINANCE_TRADING',
        risk_level: 'HIGH',
        compliance_required: true,
        primary_value_driver: 'credibilidad_y_gestion_de_riesgo',
        allowed_interventions: ['OPTIMIZACION_TECNICA', 'INTERVENCION_ESTRUCTURAL_LIMITADA'],
        forbidden_interventions: ['GROWTH_AGRESIVO', 'PROMESAS_DE_RENDIMIENTO', 'AUTOMATIZACION_DE_MENSAJES'],
        critical_risks: ['promesas_implicitas', 'lenguaje_financiero_engañoso', 'audiencia_fake', 'shadowban_por_reportes'],
        key_metrics: ['calidad_de_audiencia', 'ratio_guardados', 'engagement_no_emocional', 'consistencia_disclaimer'],
        ignore_metrics: ['likes', 'views_virales', 'followers_growth'],
        decision_bias: 'BLOCK_IF_LOW_STAGE',
        default_block_conditions: ['expectativa_resultados_inmediatos', 'perfil_low_stage_con_claims', 'lenguaje_garantizado']
    },
    'EDUCATION_INFO': {
        vertical: 'EDUCATION_INFO',
        risk_level: 'MEDIUM_HIGH',
        compliance_required: true,
        primary_value_driver: 'autoridad_y_transformacion_real',
        allowed_interventions: ['OPTIMIZACION', 'INTERVENCION_ESTRUCTURAL'],
        forbidden_interventions: ['VIRALIZACION_VANITY', 'PROMESAS_DE_RESULTADO', 'ESCALADO_SIN_PRODUCTO_VALIDO'],
        critical_risks: ['saturacion_del_nicho', 'disonancia_promesa_contenido', 'producto_no_validado'],
        key_metrics: ['conversion_rate', 'retencion', 'ratio_guardados', 'claridad_propuesta'],
        ignore_metrics: ['likes', 'views_totales', 'followers_count'],
        decision_bias: 'DOWNGRADE_IF_GENERIC',
        default_block_conditions: ['producto_inexistente', 'expectativa_rapida', 'perfil_low_stage_saturado']
    },
    'INFLUENCER_GENERAL': {
        vertical: 'INFLUENCER_GENERAL',
        risk_level: 'LOW',
        compliance_required: false,
        primary_value_driver: 'atencion_y_consistencia',
        allowed_interventions: ['OPTIMIZACION_BASICA'],
        forbidden_interventions: ['INTERVENCION_ESTRUCTURAL', 'AUDITORIA_PROFUNDA'],
        critical_risks: ['dependencia_viral', 'audiencia_no_comercial'],
        key_metrics: ['watch_time', 'consistencia_publicacion', 'retencion'],
        ignore_metrics: ['conversion', 'ventas', 'leads'],
        decision_bias: 'DOWNGRADE_ALWAYS',
        default_block_conditions: ['solicitud_high_ticket', 'expectativa_ventas_directas']
    },
    'ECOMMERCE_DTC': {
        vertical: 'ECOMMERCE_DTC',
        risk_level: 'MEDIUM',
        compliance_required: false,
        primary_value_driver: 'conversion_and_traffic_quality',
        allowed_interventions: ['OPTIMIZACION', 'INTERVENCION_ESTRUCTURAL'],
        forbidden_interventions: ['VIRALIZACION_VANITY', 'CRECIMIENTO_SIN_FUNNEL'],
        critical_risks: ['low_intent_traffic', 'ads_dependency', 'unvalidated_offer'],
        key_metrics: ['conversion_rate', 'traffic_quality', 'retention'],
        ignore_metrics: ['likes', 'views', 'followers_count'],
        decision_bias: 'DOWNGRADE_IF_NO_FUNNEL',
        default_block_conditions: ['no_checkout_detected', 'sales_expectation_without_infrastructure']
    },
    'SAAS_B2B': {
        vertical: 'SAAS_B2B',
        risk_level: 'LOW_MEDIUM',
        compliance_required: false,
        primary_value_driver: 'technical_authority_and_lead_quality',
        allowed_interventions: ['OPTIMIZACION', 'INTERVENCION_ESTRUCTURAL', 'AUDITORIA_PROFUNDA'],
        forbidden_interventions: ['VIRALIZACION_GENERALISTA'],
        critical_risks: ['non_technical_messaging', 'product_audience_misalignment'],
        key_metrics: ['lead_quality', 'demo_requests', 'website_referrals'],
        ignore_metrics: ['likes', 'story_views'],
        decision_bias: 'ALLOW_IF_REAL_PRODUCT',
        default_block_conditions: ['no_product_detected', 'vague_pitch']
    },
    'B2B_SERVICES': {
        vertical: 'B2B_SERVICES',
        risk_level: 'LOW',
        compliance_required: false,
        primary_value_driver: 'trust_and_positioning',
        allowed_interventions: ['OPTIMIZACION', 'INTERVENCION_ESTRUCTURAL'],
        forbidden_interventions: ['VIRALIZACION_VANITY'],
        critical_risks: ['brand_voice_inconsistency', 'low_relevant_social_proof'],
        key_metrics: ['lead_quality', 'website_referrals', 'case_studies'],
        ignore_metrics: ['likes', 'followers_growth'],
        decision_bias: 'ALLOW_STABLE',
        default_block_conditions: ['no_clear_offer']
    },
    'UNKNOWN': {
        vertical: 'UNKNOWN',
        risk_level: 'MEDIUM',
        compliance_required: false,
        primary_value_driver: 'visibilidad',
        allowed_interventions: ['OPTIMIZACION_BASICA'],
        forbidden_interventions: [],
        critical_risks: [],
        key_metrics: [],
        ignore_metrics: [],
        decision_bias: 'NONE',
        default_block_conditions: []
    }
};

export function detectVertical(subtype: string, intentNature: string): VerticalDefinition {
    // 1. Finance & Trading
    if (subtype === 'TRADING' || subtype === 'FINANCE' || (intentNature === 'MARCA_COMERCIAL' && subtype === 'CRYPTO')) {
        return VERTICALS.FINANCE_TRADING;
    }
    // 2. Education & Coaching
    if (subtype === 'COACH' || subtype === 'EDUCATION' || (intentNature === 'MARCA_PERSONAL' && subtype === 'MENTOR')) {
        return VERTICALS.EDUCATION_INFO;
    }
    // 3. Influencer
    if (['INFLUENCER', 'CREATOR'].includes(subtype) || intentNature === 'MEDIO_PUBLICACION') {
        return VERTICALS.INFLUENCER_GENERAL;
    }
    // 4. Ecommerce
    if (subtype === 'ECOMMERCE' || subtype === 'BRAND' || intentNature === 'MARCA_COMERCIAL') {
        // Simple heuristic: if it's a Brand but not Tech, default Ecom
        return VERTICALS.ECOMMERCE_DTC;
    }
    // 5. SaaS / B2B Tech
    if (subtype === 'SAAS' || subtype === 'STARTUP' || subtype === 'TECH') {
        return VERTICALS.SAAS_B2B;
    }
    // 6. B2B Services
    if (subtype === 'AGENCY' || subtype === 'CONSULTING' || subtype === 'SERVICE') {
        return VERTICALS.B2B_SERVICES;
    }

    // Fallbacks
    if (['MEDICO_SALUD'].includes(subtype)) return VERTICALS.EDUCATION_INFO;
    if (['REAL_ESTATE'].includes(subtype)) return VERTICALS.FINANCE_TRADING;

    return VERTICALS.UNKNOWN;
}

// --- SUBVERTICALS (Phase 51) ---

export type SubverticalID =
    | 'MEDICAL_AESTHETICS' | 'MEDICAL_CLINIC' | 'LONGEVITY_SPECIALIST' | 'SURGEON_PRIVATE'
    | 'REAL_ESTATE_LUXURY' | 'REAL_ESTATE_DEVELOPER' | 'REAL_ESTATE_AGENT_GENERAL'
    | 'TRADING_EDUCATOR' | 'TRADING_FUND' | 'CRYPTO_PUBLIC_FIGURE'
    | 'GENERIC_SUBVERTICAL';

export interface SubverticalDefinition {
    subvertical: SubverticalID;
    parent_vertical: VerticalID;
    risk_multiplier: number;
    authority_expectation: 'MEDIUM' | 'HIGH' | 'VERY_HIGH';
    visual_severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'MAX' | 'CRITICAL';
    notes: string;
}

export const SUBVERTICALS: Record<SubverticalID, SubverticalDefinition> = {
    // HEALTH / MEDICAL
    'MEDICAL_AESTHETICS': {
        subvertical: 'MEDICAL_AESTHETICS',
        parent_vertical: 'EDUCATION_INFO', // Usually fits here or specialized Health
        risk_multiplier: 1.2,
        authority_expectation: 'HIGH',
        visual_severity: 'CRITICAL',
        notes: "Alta sensibilidad reputacional y regulatoria. Cualquier inconsistencia visual penaliza."
    },
    'MEDICAL_CLINIC': {
        subvertical: 'MEDICAL_CLINIC',
        parent_vertical: 'EDUCATION_INFO',
        risk_multiplier: 1.1,
        authority_expectation: 'HIGH',
        visual_severity: 'HIGH',
        notes: "Importa coherencia institucional más que branding personal."
    },
    'LONGEVITY_SPECIALIST': {
        subvertical: 'LONGEVITY_SPECIALIST',
        parent_vertical: 'EDUCATION_INFO',
        risk_multiplier: 1.3,
        authority_expectation: 'VERY_HIGH',
        visual_severity: 'CRITICAL',
        notes: "Zona gris regulatoria. Tolerancia cero a claims implícitos."
    },
    'SURGEON_PRIVATE': {
        subvertical: 'SURGEON_PRIVATE',
        parent_vertical: 'EDUCATION_INFO',
        risk_multiplier: 1.4,
        authority_expectation: 'VERY_HIGH',
        visual_severity: 'MAX',
        notes: "Cualquier error visual = riesgo legal directo."
    },

    // REAL ESTATE
    'REAL_ESTATE_LUXURY': {
        subvertical: 'REAL_ESTATE_LUXURY',
        parent_vertical: 'FINANCE_TRADING', // Fits high risk sales profile
        risk_multiplier: 1.0,
        authority_expectation: 'HIGH',
        visual_severity: 'HIGH',
        notes: "Alta expectativa estética y narrativa aspiracional coherente."
    },
    'REAL_ESTATE_DEVELOPER': {
        subvertical: 'REAL_ESTATE_DEVELOPER',
        parent_vertical: 'FINANCE_TRADING',
        risk_multiplier: 0.9,
        authority_expectation: 'VERY_HIGH',
        visual_severity: 'MEDIUM',
        notes: "Infraestructura y credibilidad pesan más que estética."
    },
    'REAL_ESTATE_AGENT_GENERAL': {
        subvertical: 'REAL_ESTATE_AGENT_GENERAL',
        parent_vertical: 'FINANCE_TRADING',
        risk_multiplier: 0.8,
        authority_expectation: 'MEDIUM',
        visual_severity: 'LOW',
        notes: "No apto para High Ticket estructural sin escala previa."
    },

    // FINANCE / TRADING
    'TRADING_EDUCATOR': {
        subvertical: 'TRADING_EDUCATOR',
        parent_vertical: 'FINANCE_TRADING',
        risk_multiplier: 1.2,
        authority_expectation: 'HIGH',
        visual_severity: 'HIGH',
        notes: "Educación permitida, pero cero promesas implícitas."
    },
    'TRADING_FUND': {
        subvertical: 'TRADING_FUND',
        parent_vertical: 'FINANCE_TRADING',
        risk_multiplier: 1.5,
        authority_expectation: 'VERY_HIGH',
        visual_severity: 'CRITICAL',
        notes: "Riesgo legal extremo. BLOCK por defecto si no hay compliance."
    },
    'CRYPTO_PUBLIC_FIGURE': {
        subvertical: 'CRYPTO_PUBLIC_FIGURE',
        parent_vertical: 'FINANCE_TRADING',
        risk_multiplier: 1.3,
        authority_expectation: 'HIGH',
        visual_severity: 'HIGH',
        notes: "Alta volatilidad reputacional. No apto para crecimiento agresivo."
    },

    'GENERIC_SUBVERTICAL': {
        subvertical: 'GENERIC_SUBVERTICAL',
        parent_vertical: 'UNKNOWN',
        risk_multiplier: 1.0,
        authority_expectation: 'MEDIUM',
        visual_severity: 'MEDIUM',
        notes: "Standard."
    }
};

export function detectSubvertical(subtype: string, intentNature: string, rawHandle: string = ""): SubverticalDefinition {
    // Basic Keyword Heuristics
    // MEDICAL
    if (subtype === 'MEDICO_SALUD') {
        if (rawHandle.includes('dr') || rawHandle.includes('cirujan') || rawHandle.includes('plastic')) return SUBVERTICALS.SURGEON_PRIVATE;
        if (rawHandle.includes('clinic') || rawHandle.includes('centro') || intentNature === 'ENTIDAD') return SUBVERTICALS.MEDICAL_CLINIC;
        if (rawHandle.includes('estetic') || rawHandle.includes('beauty')) return SUBVERTICALS.MEDICAL_AESTHETICS;
        if (rawHandle.includes('long') || rawHandle.includes('bio')) return SUBVERTICALS.LONGEVITY_SPECIALIST;
        return SUBVERTICALS.MEDICAL_CLINIC; // Default fallback for Medical
    }

    // REAL ESTATE
    if (subtype === 'REAL_ESTATE') {
        if (rawHandle.includes('lux') || rawHandle.includes('exclusive') || intentNature === 'MARCA_PERSONAL') return SUBVERTICALS.REAL_ESTATE_LUXURY;
        if (rawHandle.includes('group') || rawHandle.includes('desarroll') || intentNature === 'ENTIDAD' || intentNature === 'MARCA_COMERCIAL') return SUBVERTICALS.REAL_ESTATE_DEVELOPER;
        return SUBVERTICALS.REAL_ESTATE_AGENT_GENERAL;
    }

    // FINANCE
    if (subtype === 'TRADING' || subtype === 'FINANCE' || subtype === 'CRYPTO') {
        if (rawHandle.includes('fund') || rawHandle.includes('cap') || intentNature === 'ENTIDAD') return SUBVERTICALS.TRADING_FUND;
        if (subtype === 'CRYPTO') return SUBVERTICALS.CRYPTO_PUBLIC_FIGURE;
        return SUBVERTICALS.TRADING_EDUCATOR;
    }

    return SUBVERTICALS.GENERIC_SUBVERTICAL;
}
