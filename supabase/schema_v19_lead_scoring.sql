-- ==========================================
-- TDT V19: Lead Scoring System (tdt-lead-qualifier)
-- ==========================================
-- Implementa scoring automático para leads basado en engagement
-- Score: 0-100 | Temperature: HOT/WARM/COLD

-- 1. EXTENDER TABLA LEADS CON CAMPOS DE SCORING
ALTER TABLE public.leads
ADD COLUMN IF NOT EXISTS score integer DEFAULT 0 CHECK (score >= 0 AND score <= 100),
ADD COLUMN IF NOT EXISTS temperature text DEFAULT 'COLD' CHECK (temperature IN ('HOT', 'WARM', 'COLD')),
ADD COLUMN IF NOT EXISTS engagement_proxy numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS followers_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_private boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS profile_data jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS last_engagement_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS engagement_count integer DEFAULT 0;

-- 2. CREAR ÍNDICES PARA FILTRADO RÁPIDO
CREATE INDEX IF NOT EXISTS idx_leads_temperature ON public.leads(temperature);
CREATE INDEX IF NOT EXISTS idx_leads_score ON public.leads(score DESC);
CREATE INDEX IF NOT EXISTS idx_leads_assigned_to ON public.leads(assigned_to);

-- 3. FUNCIÓN DE SCORING AUTOMÁTICO
CREATE OR REPLACE FUNCTION public.calculate_lead_score()
RETURNS TRIGGER AS $$
DECLARE
    calculated_score integer := 0;
    temp_score integer := 0;
BEGIN
    -- Reset score
    calculated_score := 0;

    -- ENGAGEMENT SIGNALS (Max 40 points)
    -- DM sent first (+25)
    IF NEW.profile_data->>'dm_first' = 'true' THEN
        calculated_score := calculated_score + 25;
    END IF;

    -- Asked about pricing (+20)
    IF NEW.profile_data->>'asked_pricing' = 'true' THEN
        calculated_score := calculated_score + 20;
    END IF;

    -- Mentioned specific goal (+15)
    IF NEW.profile_data->>'mentioned_goal' = 'true' THEN
        calculated_score := calculated_score + 15;
    END IF;

    -- Followed account (+10)
    IF NEW.profile_data->>'followed' = 'true' THEN
        calculated_score := calculated_score + 10;
    END IF;

    -- Engaged with 3+ posts (+10)
    IF NEW.engagement_count >= 3 THEN
        calculated_score := calculated_score + 10;
    END IF;

    -- Story reply (+10)
    IF NEW.profile_data->>'story_reply' = 'true' THEN
        calculated_score := calculated_score + 10;
    END IF;

    -- PROFILE SIGNALS (Max 30 points)
    -- Bio matches ICP (business/entrepreneur) (+10)
    IF NEW.profile_data->>'icp_match' = 'true' THEN
        calculated_score := calculated_score + 10;
    END IF;

    -- Followers in target range (1K-100K) (+10)
    IF NEW.followers_count >= 1000 AND NEW.followers_count <= 100000 THEN
        calculated_score := calculated_score + 10;
    END IF;

    -- Not private account (+5)
    IF NEW.is_private = false THEN
        calculated_score := calculated_score + 5;
    END IF;

    -- Active account (+5)
    IF NEW.last_engagement_at IS NOT NULL THEN
        IF NEW.last_engagement_at > NOW() - INTERVAL '7 days' THEN
            calculated_score := calculated_score + 5;
        END IF;
    END IF;

    -- SOURCE SIGNALS (Max 20 points)
    -- Came from high-intent source (+15)
    IF NEW.source IN ('dm', 'referral', 'story_reply') THEN
        calculated_score := calculated_score + 15;
    ELSIF NEW.source IN ('reel', 'carousel') THEN
        calculated_score := calculated_score + 10;
    ELSIF NEW.source = 'landing' THEN
        calculated_score := calculated_score + 5;
    END IF;

    -- BEHAVIOR SIGNALS (Max 10 points)
    -- Multiple engagement events
    IF NEW.engagement_count >= 5 THEN
        calculated_score := calculated_score + 10;
    ELSIF NEW.engagement_count >= 3 THEN
        calculated_score := calculated_score + 5;
    END IF;

    -- Cap score at 100
    IF calculated_score > 100 THEN
        calculated_score := 100;
    END IF;

    -- Assign score
    NEW.score := calculated_score;

    -- Determine temperature based on score
    IF calculated_score >= 80 THEN
        NEW.temperature := 'HOT';
    ELSIF calculated_score >= 50 THEN
        NEW.temperature := 'WARM';
    ELSE
        NEW.temperature := 'COLD';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. TRIGGER PARA AUTO-SCORING
DROP TRIGGER IF EXISTS trg_lead_auto_score ON public.leads;
CREATE TRIGGER trg_lead_auto_score
    BEFORE INSERT OR UPDATE ON public.leads
    FOR EACH ROW
    EXECUTE FUNCTION public.calculate_lead_score();

-- 5. TABLA DE INTERACCIONES PARA TRACKING
CREATE TABLE IF NOT EXISTS public.lead_interactions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    lead_id uuid REFERENCES public.leads(id) ON DELETE CASCADE,
    interaction_type text NOT NULL CHECK (interaction_type IN (
        'dm_received', 'dm_sent', 'story_reply', 'comment', 'like',
        'follow', 'profile_visit', 'link_click', 'form_submit'
    )),
    content jsonb DEFAULT '{}'::jsonb,
    score_delta integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lead_interactions_lead_id ON public.lead_interactions(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_interactions_type ON public.lead_interactions(interaction_type);

-- 6. FUNCIÓN PARA REGISTRAR INTERACCIONES
CREATE OR REPLACE FUNCTION public.register_interaction(
    p_lead_id uuid,
    p_type text,
    p_content jsonb DEFAULT '{}'::jsonb
)
RETURNS void AS $$
DECLARE
    v_score_delta integer := 0;
BEGIN
    -- Calculate score delta based on interaction type
    CASE p_type
        WHEN 'dm_sent' THEN v_score_delta := 25;
        WHEN 'dm_received' THEN v_score_delta := 15;
        WHEN 'story_reply' THEN v_score_delta := 10;
        WHEN 'comment' THEN v_score_delta := 8;
        WHEN 'like' THEN v_score_delta := 5;
        WHEN 'follow' THEN v_score_delta := 10;
        WHEN 'profile_visit' THEN v_score_delta := 3;
        WHEN 'link_click' THEN v_score_delta := 7;
        WHEN 'form_submit' THEN v_score_delta := 20;
        ELSE v_score_delta := 0;
    END CASE;

    -- Insert interaction record
    INSERT INTO public.lead_interactions (lead_id, interaction_type, content, score_delta)
    VALUES (p_lead_id, p_type, p_content, v_score_delta);

    -- Update lead engagement count and last engagement
    UPDATE public.leads
    SET engagement_count = engagement_count + 1,
        last_engagement_at = NOW()
    WHERE id = p_lead_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. VISTA PARA LEADS PRIORIZADOS
CREATE OR REPLACE VIEW public.v_priority_leads AS
SELECT
    l.id,
    l.instagram_username,
    l.status,
    l.temperature,
    l.score,
    l.source,
    l.followers_count,
    l.engagement_count,
    l.last_engagement_at,
    l.created_at,
    l.assigned_to,
    p.full_name as assigned_name,
    CASE
        WHEN l.temperature = 'HOT' THEN 'IMMEDIATE'
        WHEN l.temperature = 'WARM' THEN 'NURTURE'
        ELSE 'MONITOR'
    END as priority_action
FROM public.leads l
LEFT JOIN public.profiles p ON l.assigned_to = p.id
ORDER BY l.score DESC, l.created_at DESC;

-- 8. FUNCIÓN PARA OBTENER LEADS CALIENTES
CREATE OR REPLACE FUNCTION public.get_hot_leads()
RETURNS TABLE (
    id uuid,
    instagram_username text,
    score integer,
    source text,
    last_engagement timestamp with time zone
) AS $$
BEGIN
    RETURN QUERY
    SELECT l.id, l.instagram_username, l.score, l.source, l.last_engagement_at
    FROM public.leads l
    WHERE l.temperature = 'HOT'
      AND l.status NOT IN ('closed', 'perdido')
    ORDER BY l.score DESC, l.last_engagement_at DESC NULLS LAST;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. FUNCIÓN PARA OBTENER ESTADÍSTICAS DE SCORING
CREATE OR REPLACE FUNCTION public.get_lead_scoring_stats()
RETURNS json AS $$
DECLARE
    result json;
BEGIN
    SELECT json_build_object(
        'total_leads', (SELECT COUNT(*) FROM leads),
        'hot_count', (SELECT COUNT(*) FROM leads WHERE temperature = 'HOT'),
        'warm_count', (SELECT COUNT(*) FROM leads WHERE temperature = 'WARM'),
        'cold_count', (SELECT COUNT(*) FROM leads WHERE temperature = 'COLD'),
        'avg_score', (SELECT ROUND(AVG(score)::numeric, 2) FROM leads),
        'conversion_rate_hot', (
            SELECT ROUND(
                (COUNT(CASE WHEN status = 'closed' THEN 1 END)::numeric /
                NULLIF(COUNT(CASE WHEN temperature = 'HOT' THEN 1 END), 0)) * 100, 2
            )
            FROM leads WHERE temperature = 'HOT'
        )
    ) INTO result;

    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. RLS PARA INTERACTIONS
ALTER TABLE public.lead_interactions DISABLE ROW LEVEL SECURITY;

-- ==========================================
-- COMENTARIOS PARA DOCUMENTACIÓN
-- ==========================================
COMMENT ON COLUMN public.leads.score IS 'Lead score 0-100 based on engagement and profile signals';
COMMENT ON COLUMN public.leads.temperature IS 'HOT (80-100), WARM (50-79), COLD (0-49)';
COMMENT ON COLUMN public.leads.engagement_proxy IS 'Calculated engagement rate from Instagram data';
COMMENT ON TABLE public.lead_interactions IS 'Tracks all interactions with leads for scoring and analytics';