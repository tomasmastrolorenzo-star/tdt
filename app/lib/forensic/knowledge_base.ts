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
