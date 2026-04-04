-- ==========================================
-- TDT COMBINED MIGRATIONS (v19 + v20) - FIXED
-- Run this in Supabase SQL Editor
-- ==========================================
-- Run in order, section by section if needed
-- ==========================================

-- ═══════════════════════════════════════════
-- V19: LEAD SCORING SYSTEM
-- ═══════════════════════════════════════════

-- 1. Add columns to leads table (ignore if exists)
DO $$
BEGIN
    -- Add columns one by one to avoid multi-column error
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'score') THEN
        ALTER TABLE public.leads ADD COLUMN score integer DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'temperature') THEN
        ALTER TABLE public.leads ADD COLUMN temperature text DEFAULT 'COLD';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'engagement_proxy') THEN
        ALTER TABLE public.leads ADD COLUMN engagement_proxy numeric DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'followers_count') THEN
        ALTER TABLE public.leads ADD COLUMN followers_count integer DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'is_private') THEN
        ALTER TABLE public.leads ADD COLUMN is_private boolean DEFAULT false;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'profile_data') THEN
        ALTER TABLE public.leads ADD COLUMN profile_data jsonb DEFAULT '{}'::jsonb;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'last_engagement_at') THEN
        ALTER TABLE public.leads ADD COLUMN last_engagement_at timestamp with time zone;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'engagement_count') THEN
        ALTER TABLE public.leads ADD COLUMN engagement_count integer DEFAULT 0;
    END IF;
END $$;

-- 2. Add check constraints (drop first if exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'leads_score_check') THEN
        ALTER TABLE public.leads DROP CONSTRAINT leads_score_check;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'leads_temperature_check') THEN
        ALTER TABLE public.leads DROP CONSTRAINT leads_temperature_check;
    END IF;
END $$;

ALTER TABLE public.leads ADD CONSTRAINT leads_score_check CHECK (score >= 0 AND score <= 100);
ALTER TABLE public.leads ADD CONSTRAINT leads_temperature_check CHECK (temperature IN ('HOT', 'WARM', 'COLD'));

-- 3. Create indexes
CREATE INDEX IF NOT EXISTS idx_leads_temperature ON public.leads(temperature);
CREATE INDEX IF NOT EXISTS idx_leads_score ON public.leads(score DESC);
CREATE INDEX IF NOT EXISTS idx_leads_assigned_to ON public.leads(assigned_to);

-- 4. Scoring function
CREATE OR REPLACE FUNCTION public.calculate_lead_score()
RETURNS TRIGGER AS $$
DECLARE
    calculated_score integer := 0;
BEGIN
    calculated_score := 0;

    -- ENGAGEMENT SIGNALS (Max 40 points)
    IF NEW.profile_data->>'dm_first' = 'true' THEN calculated_score := calculated_score + 25; END IF;
    IF NEW.profile_data->>'asked_pricing' = 'true' THEN calculated_score := calculated_score + 20; END IF;
    IF NEW.profile_data->>'mentioned_goal' = 'true' THEN calculated_score := calculated_score + 15; END IF;
    IF NEW.profile_data->>'followed' = 'true' THEN calculated_score := calculated_score + 10; END IF;
    IF NEW.engagement_count >= 3 THEN calculated_score := calculated_score + 10; END IF;
    IF NEW.profile_data->>'story_reply' = 'true' THEN calculated_score := calculated_score + 10; END IF;

    -- PROFILE SIGNALS (Max 30 points)
    IF NEW.profile_data->>'icp_match' = 'true' THEN calculated_score := calculated_score + 10; END IF;
    IF NEW.followers_count >= 1000 AND NEW.followers_count <= 100000 THEN calculated_score := calculated_score + 10; END IF;
    IF NEW.is_private = false THEN calculated_score := calculated_score + 5; END IF;
    IF NEW.last_engagement_at IS NOT NULL AND NEW.last_engagement_at > NOW() - INTERVAL '7 days' THEN
        calculated_score := calculated_score + 5;
    END IF;

    -- SOURCE SIGNALS (Max 20 points)
    IF NEW.source IN ('dm', 'referral', 'story_reply') THEN calculated_score := calculated_score + 15;
    ELSIF NEW.source IN ('reel', 'carousel') THEN calculated_score := calculated_score + 10;
    ELSIF NEW.source = 'landing' THEN calculated_score := calculated_score + 5;
    END IF;

    -- BEHAVIOR SIGNALS (Max 10 points)
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

-- 5. Trigger for auto-scoring
DROP TRIGGER IF EXISTS trg_lead_auto_score ON public.leads;
CREATE TRIGGER trg_lead_auto_score
    BEFORE INSERT OR UPDATE ON public.leads
    FOR EACH ROW
    EXECUTE FUNCTION public.calculate_lead_score();

-- 6. Lead interactions table (drop and recreate to fix schema)
DROP TABLE IF EXISTS public.lead_interactions CASCADE;
CREATE TABLE public.lead_interactions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    lead_id uuid REFERENCES public.leads(id) ON DELETE CASCADE,
    interaction_type text NOT NULL,
    content jsonb DEFAULT '{}'::jsonb,
    score_delta integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT NOW()
);

-- Add check constraint after table creation
ALTER TABLE public.lead_interactions ADD CONSTRAINT lead_interactions_type_check
    CHECK (interaction_type IN (
        'dm_received', 'dm_sent', 'story_reply', 'comment', 'like',
        'follow', 'profile_visit', 'link_click', 'form_submit'
    ));

CREATE INDEX IF NOT EXISTS idx_lead_interactions_lead_id ON public.lead_interactions(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_interactions_type ON public.lead_interactions(interaction_type);

-- 7. Register interaction function
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

-- 8. Priority leads view
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

-- 9. Get hot leads function
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

-- 10. Scoring stats function
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
        'avg_score', (SELECT ROUND(AVG(score)::numeric, 2) FROM leads)
    ) INTO result;
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ═══════════════════════════════════════════
-- V20: DM TRACKING SYSTEM
-- ═══════════════════════════════════════════

-- 1. DM Templates (must be first due to FK)
DROP TABLE IF EXISTS public.objections CASCADE;
DROP TABLE IF EXISTS public.buying_signals CASCADE;
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.conversations CASCADE;
DROP TABLE IF EXISTS public.dm_templates CASCADE;

CREATE TABLE public.dm_templates (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    stage text NOT NULL,
    category text DEFAULT 'general',
    content text NOT NULL,
    variables jsonb DEFAULT '[]'::jsonb,
    es_ganador boolean DEFAULT false,
    usos integer DEFAULT 0,
    conversiones integer DEFAULT 0,
    created_by uuid REFERENCES public.profiles(id),
    created_at timestamp with time zone DEFAULT NOW(),
    updated_at timestamp with time zone DEFAULT NOW()
);

-- Add constraints after table creation
ALTER TABLE public.dm_templates ADD CONSTRAINT dm_templates_stage_check
    CHECK (stage IN ('discovery', 'pain_deepening', 'solution', 'offer', 'closing', 'objection_handling', 'nurture'));
ALTER TABLE public.dm_templates ADD CONSTRAINT dm_templates_category_check
    CHECK (category IN ('general', 'fitness', 'entrepreneur', 'model', 'other'));

CREATE INDEX IF NOT EXISTS idx_dm_templates_stage ON public.dm_templates(stage);
CREATE INDEX IF NOT EXISTS idx_dm_templates_category ON public.dm_templates(category);

-- 2. Conversations
CREATE TABLE public.conversations (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    lead_id uuid REFERENCES public.leads(id) ON DELETE CASCADE NOT NULL,
    status text DEFAULT 'active',
    stage text DEFAULT 'discovery',
    buying_signals jsonb DEFAULT '[]'::jsonb,
    objections jsonb DEFAULT '[]'::jsonb,
    personality_type text,
    last_message_at timestamp with time zone,
    last_message_type text,
    message_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT NOW(),
    updated_at timestamp with time zone DEFAULT NOW()
);

-- Add constraints
ALTER TABLE public.conversations ADD CONSTRAINT conversations_status_check
    CHECK (status IN ('active', 'waiting_reply', 'closed', 'nurture'));
ALTER TABLE public.conversations ADD CONSTRAINT conversations_stage_check
    CHECK (stage IN ('discovery', 'pain_deepening', 'solution', 'offer', 'closing', 'nurture'));
ALTER TABLE public.conversations ADD CONSTRAINT conversations_personality_check
    CHECK (personality_type IS NULL OR personality_type IN ('analytical', 'emotional', 'skeptical', 'impulsive'));
ALTER TABLE public.conversations ADD CONSTRAINT conversations_msg_type_check
    CHECK (last_message_type IS NULL OR last_message_type IN ('in', 'out'));

CREATE INDEX IF NOT EXISTS idx_conversations_lead_id ON public.conversations(lead_id);
CREATE INDEX IF NOT EXISTS idx_conversations_status ON public.conversations(status);
CREATE INDEX IF NOT EXISTS idx_conversations_stage ON public.conversations(stage);

-- 3. Messages
CREATE TABLE public.messages (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id uuid REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
    direction text NOT NULL,
    content text NOT NULL,
    template_used uuid REFERENCES public.dm_templates(id),
    detected_signals jsonb DEFAULT '[]'::jsonb,
    sentiment text,
    created_at timestamp with time zone DEFAULT NOW()
);

-- Add constraints
ALTER TABLE public.messages ADD CONSTRAINT messages_direction_check
    CHECK (direction IN ('in', 'out'));
ALTER TABLE public.messages ADD CONSTRAINT messages_sentiment_check
    CHECK (sentiment IS NULL OR sentiment IN ('positive', 'neutral', 'negative'));

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_direction ON public.messages(direction);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);

-- 4. Buying signals
CREATE TABLE public.buying_signals (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id uuid REFERENCES public.conversations(id) ON DELETE CASCADE,
    signal_type text NOT NULL,
    content text,
    detected_in_message uuid REFERENCES public.messages(id),
    confidence_score numeric DEFAULT 1.0,
    created_at timestamp with time zone DEFAULT NOW()
);

ALTER TABLE public.buying_signals ADD CONSTRAINT buying_signals_type_check
    CHECK (signal_type IN (
        'price_inquiry', 'timeline_question', 'feature_question',
        'commitment_phrase', 'objection_overcome', 'enthusiasm',
        'social_proof_request', 'guarantee_question'
    ));

CREATE INDEX IF NOT EXISTS idx_buying_signals_conversation ON public.buying_signals(conversation_id);

-- 5. Objections
CREATE TABLE public.objections (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id uuid REFERENCES public.conversations(id) ON DELETE CASCADE,
    objection_type text NOT NULL,
    content text,
    resolved boolean DEFAULT false,
    resolution_message uuid REFERENCES public.messages(id),
    created_at timestamp with time zone DEFAULT NOW()
);

ALTER TABLE public.objections ADD CONSTRAINT objections_type_check
    CHECK (objection_type IN ('price', 'timing', 'competitor', 'trust', 'need', 'authority'));

CREATE INDEX IF NOT EXISTS idx_objections_conversation ON public.objections(conversation_id);

-- 6. Functions

CREATE OR REPLACE FUNCTION public.get_or_create_conversation(p_lead_id uuid)
RETURNS uuid AS $$
DECLARE
    v_conversation_id uuid;
BEGIN
    SELECT id INTO v_conversation_id
    FROM public.conversations
    WHERE lead_id = p_lead_id
    AND status IN ('active', 'waiting_reply')
    LIMIT 1;

    IF v_conversation_id IS NULL THEN
        INSERT INTO public.conversations (lead_id, status, stage)
        VALUES (p_lead_id, 'active', 'discovery')
        RETURNING id INTO v_conversation_id;
    END IF;

    RETURN v_conversation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.log_message(
    p_conversation_id uuid,
    p_direction text,
    p_content text,
    p_template_id uuid DEFAULT NULL
)
RETURNS uuid AS $$
DECLARE
    v_message_id uuid;
    v_signals jsonb := '[]'::jsonb;
BEGIN
    INSERT INTO public.messages (conversation_id, direction, content, template_used)
    VALUES (p_conversation_id, p_direction, p_content, p_template_id)
    RETURNING id INTO v_message_id;

    IF p_direction = 'in' THEN
        IF p_content ~* 'precio|price|costo|cuanto|how much' THEN
            v_signals := v_signals || jsonb_build_object('type', 'price_inquiry', 'content', p_content);
        END IF;
        IF p_content ~* 'cuando|when|empezar|start' THEN
            v_signals := v_signals || jsonb_build_object('type', 'timeline_question', 'content', p_content);
        END IF;
        IF p_content ~* 'incluye|include|que incluye|what includes' THEN
            v_signals := v_signals || jsonb_build_object('type', 'feature_question', 'content', p_content);
        END IF;

        IF jsonb_array_length(v_signals) > 0 THEN
            UPDATE public.conversations
            SET buying_signals = buying_signals || v_signals,
                last_message_at = NOW(),
                last_message_type = 'in',
                message_count = message_count + 1
            WHERE id = p_conversation_id;
        END IF;
    END IF;

    UPDATE public.conversations
    SET last_message_at = NOW(),
        last_message_type = p_direction,
        message_count = message_count + 1
    WHERE id = p_conversation_id;

    RETURN v_message_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_dm_closer_stats()
RETURNS json AS $$
DECLARE
    result json;
BEGIN
    SELECT json_build_object(
        'active_conversations', (SELECT COUNT(*) FROM conversations WHERE status = 'active'),
        'waiting_reply', (SELECT COUNT(*) FROM conversations WHERE status = 'waiting_reply'),
        'in_discovery', (SELECT COUNT(*) FROM conversations WHERE stage = 'discovery'),
        'in_offer', (SELECT COUNT(*) FROM conversations WHERE stage = 'offer'),
        'in_closing', (SELECT COUNT(*) FROM conversations WHERE stage = 'closing'),
        'total_messages_today', (SELECT COUNT(*) FROM messages WHERE created_at >= CURRENT_DATE),
        'buying_signals_detected', (SELECT COUNT(*) FROM buying_signals WHERE created_at >= CURRENT_DATE)
    ) INTO result;
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. View for active conversations
DROP VIEW IF EXISTS public.v_active_conversations CASCADE;
CREATE OR REPLACE VIEW public.v_active_conversations AS
SELECT
    c.id as conversation_id,
    c.lead_id,
    l.instagram_username,
    l.temperature,
    l.score,
    c.stage,
    c.status,
    c.personality_type,
    c.message_count,
    c.last_message_at,
    c.last_message_type,
    c.buying_signals,
    c.objections,
    CASE
        WHEN c.last_message_type = 'in' AND c.last_message_at < NOW() - INTERVAL '1 hour' THEN 'REPLY_NEEDED'
        WHEN c.last_message_type = 'out' AND c.last_message_at < NOW() - INTERVAL '24 hours' THEN 'FOLLOW_UP'
        ELSE 'ON_TRACK'
    END as action_needed,
    CASE
        WHEN l.temperature = 'HOT' THEN 1
        WHEN l.temperature = 'WARM' THEN 2
        ELSE 3
    END as priority_order
FROM public.conversations c
JOIN public.leads l ON c.lead_id = l.id
WHERE c.status IN ('active', 'waiting_reply')
ORDER BY priority_order, c.last_message_at DESC NULLS LAST;

-- 8. RLS
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dm_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buying_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.objections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view assigned conversations" ON public.conversations;
CREATE POLICY "Users can view assigned conversations" ON public.conversations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM leads
            WHERE leads.id = conversations.lead_id
            AND (leads.assigned_to = auth.uid() OR EXISTS (
                SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('ceo', 'admin')
            ))
        )
    );

DROP POLICY IF EXISTS "Users can insert conversations" ON public.conversations;
CREATE POLICY "Users can insert conversations" ON public.conversations
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM leads
            WHERE leads.id = conversations.lead_id
            AND (leads.assigned_to = auth.uid() OR EXISTS (
                SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('ceo', 'admin')
            ))
        )
    );

DROP POLICY IF EXISTS "Users can view assigned messages" ON public.messages;
CREATE POLICY "Users can view assigned messages" ON public.messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM conversations c
            JOIN leads l ON c.lead_id = l.id
            WHERE c.id = messages.conversation_id
            AND (l.assigned_to = auth.uid() OR EXISTS (
                SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('ceo', 'admin')
            ))
        )
    );

DROP POLICY IF EXISTS "Users can read templates" ON public.dm_templates;
CREATE POLICY "Users can read templates" ON public.dm_templates
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage templates" ON public.dm_templates;
CREATE POLICY "Admins can manage templates" ON public.dm_templates
    FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('ceo', 'admin'))
    );

-- ==========================================
-- DONE!
-- Verify with:
-- SELECT * FROM get_lead_scoring_stats();
-- SELECT * FROM get_dm_closer_stats();
-- SELECT * FROM v_priority_leads LIMIT 5;
-- ==========================================