-- ==========================================
-- TDT V19: LEAD SCORING - SIMPLE VERSION
-- No complex CHECK constraints - just columns and functions
-- ==========================================

-- STEP 1: Add columns to leads table
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS score integer DEFAULT 0;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS temperature text DEFAULT 'COLD';
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS engagement_proxy numeric DEFAULT 0;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS followers_count integer DEFAULT 0;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS is_private boolean DEFAULT false;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS profile_data jsonb DEFAULT '{}'::jsonb;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS last_engagement_at timestamp with time zone;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS engagement_count integer DEFAULT 0;

-- STEP 2: Create indexes
CREATE INDEX IF NOT EXISTS idx_leads_temperature ON public.leads(temperature);
CREATE INDEX IF NOT EXISTS idx_leads_score ON public.leads(score DESC);

-- STEP 3: Drop old interactions table if exists with wrong schema
DROP TABLE IF EXISTS public.lead_interactions CASCADE;

-- STEP 4: Create lead_interactions table (simple version)
CREATE TABLE public.lead_interactions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    lead_id uuid REFERENCES public.leads(id) ON DELETE CASCADE,
    interaction_type text NOT NULL,
    content jsonb DEFAULT '{}'::jsonb,
    score_delta integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lead_interactions_lead_id ON public.lead_interactions(lead_id);

-- STEP 5: Scoring function
CREATE OR REPLACE FUNCTION public.calculate_lead_score()
RETURNS TRIGGER AS $$
DECLARE
    calculated_score integer := 0;
BEGIN
    calculated_score := 0;

    -- ENGAGEMENT SIGNALS
    IF NEW.profile_data->>'dm_first' = 'true' THEN calculated_score := calculated_score + 25; END IF;
    IF NEW.profile_data->>'asked_pricing' = 'true' THEN calculated_score := calculated_score + 20; END IF;
    IF NEW.profile_data->>'mentioned_goal' = 'true' THEN calculated_score := calculated_score + 15; END IF;
    IF NEW.profile_data->>'followed' = 'true' THEN calculated_score := calculated_score + 10; END IF;
    IF NEW.engagement_count >= 3 THEN calculated_score := calculated_score + 10; END IF;
    IF NEW.profile_data->>'story_reply' = 'true' THEN calculated_score := calculated_score + 10; END IF;

    -- PROFILE SIGNALS
    IF NEW.profile_data->>'icp_match' = 'true' THEN calculated_score := calculated_score + 10; END IF;
    IF NEW.followers_count >= 1000 AND NEW.followers_count <= 100000 THEN calculated_score := calculated_score + 10; END IF;
    IF NEW.is_private = false THEN calculated_score := calculated_score + 5; END IF;
    IF NEW.last_engagement_at IS NOT NULL AND NEW.last_engagement_at > NOW() - INTERVAL '7 days' THEN
        calculated_score := calculated_score + 5;
    END IF;

    -- SOURCE SIGNALS
    IF NEW.source IN ('dm', 'referral', 'story_reply') THEN calculated_score := calculated_score + 15;
    ELSIF NEW.source IN ('reel', 'carousel') THEN calculated_score := calculated_score + 10;
    ELSIF NEW.source = 'landing' THEN calculated_score := calculated_score + 5;
    END IF;

    -- BEHAVIOR SIGNALS
    IF NEW.engagement_count >= 5 THEN calculated_score := calculated_score + 10;
    ELSIF NEW.engagement_count >= 3 THEN calculated_score := calculated_score + 5;
    END IF;

    -- Cap at 100
    IF calculated_score > 100 THEN calculated_score := 100; END IF;

    NEW.score := calculated_score;

    IF calculated_score >= 80 THEN NEW.temperature := 'HOT';
    ELSIF calculated_score >= 50 THEN NEW.temperature := 'WARM';
    ELSE NEW.temperature := 'COLD';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- STEP 6: Trigger
DROP TRIGGER IF EXISTS trg_lead_auto_score ON public.leads;
CREATE TRIGGER trg_lead_auto_score
    BEFORE INSERT OR UPDATE ON public.leads
    FOR EACH ROW
    EXECUTE FUNCTION public.calculate_lead_score();

-- STEP 7: Register interaction function
CREATE OR REPLACE FUNCTION public.register_interaction(
    p_lead_id uuid,
    p_type text,
    p_content jsonb DEFAULT '{}'::jsonb
)
RETURNS void AS $$
DECLARE
    v_score_delta integer := 0;
BEGIN
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

    INSERT INTO public.lead_interactions (lead_id, interaction_type, content, score_delta)
    VALUES (p_lead_id, p_type, p_content, v_score_delta);

    UPDATE public.leads
    SET engagement_count = engagement_count + 1,
        last_engagement_at = NOW()
    WHERE id = p_lead_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- STEP 8: Stats function
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
        'avg_score', (SELECT COALESCE(ROUND(AVG(score)::numeric, 2), 0) FROM leads)
    ) INTO result;
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- STEP 9: Priority view
DROP VIEW IF EXISTS public.v_priority_leads CASCADE;
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

-- VERIFY V19:
SELECT * FROM get_lead_scoring_stats();