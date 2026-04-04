-- ==========================================
-- TDT V20: DM Tracking System (tdt-dm-closer)
-- ==========================================
-- Implementa seguimiento de conversaciones DM para el agente DM Closer
-- Tracks: conversations, messages, templates, buying signals

-- 1. CONVERSATIONS TABLE
-- Each conversation belongs to a lead
CREATE TABLE IF NOT EXISTS public.conversations (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    lead_id uuid REFERENCES public.leads(id) ON DELETE CASCADE NOT NULL,
    status text DEFAULT 'active' CHECK (status IN ('active', 'waiting_reply', 'closed', 'nurture')),
    stage text DEFAULT 'discovery' CHECK (stage IN ('discovery', 'pain_deepening', 'solution', 'offer', 'closing', 'nurture')),
    buying_signals jsonb DEFAULT '[]'::jsonb,
    objections jsonb DEFAULT '[]'::jsonb,
    personality_type text CHECK (personality_type IN ('analytical', 'emotional', 'skeptical', 'impulsive')),
    last_message_at timestamp with time zone,
    last_message_type text CHECK (last_message_type IN ('in', 'out')),
    message_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT NOW(),
    updated_at timestamp with time zone DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_conversations_lead_id ON public.conversations(lead_id);
CREATE INDEX IF NOT EXISTS idx_conversations_status ON public.conversations(status);
CREATE INDEX IF NOT EXISTS idx_conversations_stage ON public.conversations(stage);

-- 2. MESSAGES TABLE
-- All messages within a conversation
CREATE TABLE IF NOT EXISTS public.messages (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id uuid REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
    direction text NOT NULL CHECK (direction IN ('in', 'out')),
    content text NOT NULL,
    template_used uuid REFERENCES public.dm_templates(id),
    detected_signals jsonb DEFAULT '[]'::jsonb,
    sentiment text CHECK (sentiment IN ('positive', 'neutral', 'negative')),
    created_at timestamp with time zone DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_direction ON public.messages(direction);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);

-- 3. DM TEMPLATES TABLE
-- Reusable message templates by stage
CREATE TABLE IF NOT EXISTS public.dm_templates (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    stage text NOT NULL CHECK (stage IN ('discovery', 'pain_deepening', 'solution', 'offer', 'closing', 'objection_handling', 'nurture')),
    category text DEFAULT 'general' CHECK (category IN ('general', 'fitness', 'entrepreneur', 'model', 'other')),
    content text NOT NULL,
    variables jsonb DEFAULT '[]'::jsonb, -- e.g., ["name", "goal", "niche"]
    es_ganador boolean DEFAULT false,
    usos integer DEFAULT 0,
    conversiones integer DEFAULT 0,
    created_by uuid REFERENCES public.profiles(id),
    created_at timestamp with time zone DEFAULT NOW(),
    updated_at timestamp with time zone DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dm_templates_stage ON public.dm_templates(stage);
CREATE INDEX IF NOT EXISTS idx_dm_templates_category ON public.dm_templates(category);

-- 4. BUYING SIGNALS DETECTION
-- Signals that indicate purchase intent
CREATE TABLE IF NOT EXISTS public.buying_signals (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id uuid REFERENCES public.conversations(id) ON DELETE CASCADE,
    signal_type text NOT NULL CHECK (signal_type IN (
        'price_inquiry', 'timeline_question', 'feature_question',
        'commitment_phrase', 'objection_overcome', 'enthusiasm',
        'social_proof_request', 'guarantee_question'
    )),
    content text,
    detected_in_message uuid REFERENCES public.messages(id),
    confidence_score numeric DEFAULT 1.0,
    created_at timestamp with time zone DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_buying_signals_conversation ON public.buying_signals(conversation_id);

-- 5. OBJECTIONS TRACKER
CREATE TABLE IF NOT EXISTS public.objections (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id uuid REFERENCES public.conversations(id) ON DELETE CASCADE,
    objection_type text NOT NULL CHECK (objection_type IN (
        'price', 'timing', 'competitor', 'trust', 'need', 'authority'
    )),
    content text,
    resolved boolean DEFAULT false,
    resolution_message uuid REFERENCES public.messages(id),
    created_at timestamp with time zone DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_objections_conversation ON public.objections(conversation_id);

-- 6. FUNCTIONS

-- Get or create conversation for a lead
CREATE OR REPLACE FUNCTION public.get_or_create_conversation(p_lead_id uuid)
RETURNS uuid AS $$
DECLARE
    v_conversation_id uuid;
BEGIN
    -- Check if active conversation exists
    SELECT id INTO v_conversation_id
    FROM public.conversations
    WHERE lead_id = p_lead_id
    AND status IN ('active', 'waiting_reply')
    LIMIT 1;

    -- If not, create new
    IF v_conversation_id IS NULL THEN
        INSERT INTO public.conversations (lead_id, status, stage)
        VALUES (p_lead_id, 'active', 'discovery')
        RETURNING id INTO v_conversation_id;
    END IF;

    RETURN v_conversation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Log a message
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
    -- Insert message
    INSERT INTO public.messages (conversation_id, direction, content, template_used)
    VALUES (p_conversation_id, p_direction, p_content, p_template_id)
    RETURNING id INTO v_message_id;

    -- Detect buying signals if incoming message
    IF p_direction = 'in' THEN
        -- Simple signal detection (can be enhanced with AI)
        IF p_content ~* 'precio|price|costo|cuanto|how much' THEN
            v_signals := v_signals || jsonb_build_object('type', 'price_inquiry', 'content', p_content);
        END IF;
        IF p_content ~* 'cuando|when|empezar|start' THEN
            v_signals := v_signals || jsonb_build_object('type', 'timeline_question', 'content', p_content);
        END IF;
        IF p_content ~* 'incluye|include|que incluye|what includes' THEN
            v_signals := v_signals || jsonb_build_object('type', 'feature_question', 'content', p_content);
        END IF;

        -- Update conversation with signals
        IF jsonb_array_length(v_signals) > 0 THEN
            UPDATE public.conversations
            SET buying_signals = buying_signals || v_signals,
                last_message_at = NOW(),
                last_message_type = 'in',
                message_count = message_count + 1
            WHERE id = p_conversation_id;
        END IF;
    END IF;

    -- Update conversation stats
    UPDATE public.conversations
    SET last_message_at = NOW(),
        last_message_type = p_direction,
        message_count = message_count + 1
    WHERE id = p_conversation_id;

    RETURN v_message_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get conversation stats for DM Closer dashboard
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
        'total_messages_today', (
            SELECT COUNT(*) FROM messages
            WHERE created_at >= CURRENT_DATE
        ),
        'buying_signals_detected', (
            SELECT COUNT(*) FROM buying_signals
            WHERE created_at >= CURRENT_DATE
        )
    ) INTO result;

    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. VIEWS

-- Active conversations view for DM Closer
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

-- 8. RLS POLICIES
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dm_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buying_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.objections ENABLE ROW LEVEL SECURITY;

-- Conversations: Users can view/edit conversations for leads assigned to them
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

-- Messages: Same policy
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

-- Templates: Everyone can read, only admins can write
CREATE POLICY "Users can read templates" ON public.dm_templates
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage templates" ON public.dm_templates
    FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('ceo', 'admin'))
    );

-- ==========================================
-- COMMENTS
-- ==========================================
COMMENT ON TABLE public.conversations IS 'DM conversation threads tracked by tdt-dm-closer';
COMMENT ON TABLE public.messages IS 'Individual DM messages in conversations';
COMMENT ON TABLE public.dm_templates IS 'Reusable DM templates organized by sales stage';
COMMENT ON TABLE public.buying_signals IS 'Detected buying signals in conversations';
COMMENT ON TABLE public.objections IS 'Objections raised and resolution status';
COMMENT ON COLUMN public.conversations.stage IS 'Current sales stage: discovery, pain_deepening, solution, offer, closing, nurture';
COMMENT ON COLUMN public.conversations.personality_type IS 'Detected buyer personality: analytical, emotional, skeptical, impulsive';