export type VerticalID = 'FINANCE_TRADING' | 'EDUCATION_INFO' | 'INFLUENCER_GENERAL' | 'UNKNOWN';
export type InterventionType = 'OPTIMIZACION_TECNICA' | 'INTERVENCION_ESTRUCTURAL_LIMITADA' | 'GROWTH_AGRESIVO' | 'PROMESAS_DE_RENDIMIENTO' | 'AUTOMATIZACION_DE_MENSAJES' | 'OPTIMIZACION' | 'INTERVENCION_ESTRUCTURAL' | 'VIRALIZACION_VANITY' | 'PROMESAS_DE_RESULTADO' | 'ESCALADO_SIN_PRODUCTO_VALIDO' | 'OPTIMIZACION_BASICA' | 'AUDITORIA_PROFUNDA';
export type DecisionBias = 'BLOCK_IF_LOW_STAGE' | 'DOWNGRADE_IF_GENERIC' | 'DOWNGRADE_ALWAYS' | 'NONE';

export interface VerticalDefinition {
    vertical: VerticalID;
    risk_level: 'HIGH' | 'MEDIUM_HIGH' | 'MEDIUM' | 'LOW';
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
    // Simple heuristic mapping
    if (subtype === 'TRADING' || subtype === 'FINANCE' || intentNature === 'MARCA_COMERCIAL' && subtype === 'CRYPTO') {
        return VERTICALS.FINANCE_TRADING;
    }
    if (subtype === 'COACH' || subtype === 'EDUCATION' || intentNature === 'MARCA_PERSONAL' && subtype === 'MENTOR') {
        return VERTICALS.EDUCATION_INFO;
    }
    if (subtype === 'INFLUENCER' || subtype === 'CREATOR' || intentNature === 'MEDIO_PUBLICACION') {
        return VERTICALS.INFLUENCER_GENERAL;
    }

    // Fallback based on Subtype alone if not matched
    if (['MEDICO_SALUD'].includes(subtype)) return VERTICALS.EDUCATION_INFO; // Treat Medical as Edu for now or new vertical later
    if (['REAL_ESTATE'].includes(subtype)) return VERTICALS.FINANCE_TRADING; // High risk sales similar to finance

    return VERTICALS.UNKNOWN;
}
