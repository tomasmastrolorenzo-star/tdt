-- ==========================================
-- TDT V14 MODULES (6-END-TO-END SCHEMA)
-- ==========================================

-- 1. ALTER CLIENTS TABLE (MÓDULO 3)
-- Adapting dynamically to the existing English schema preventing data loss.
ALTER TABLE public.clients
ADD COLUMN IF NOT EXISTS delivery_status TEXT DEFAULT 'pending' CHECK (delivery_status IN ('pending', 'processing', 'delivered', 'issue')),
ADD COLUMN IF NOT EXISTS delivery_notes TEXT,
ADD COLUMN IF NOT EXISTS delivery_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS renewal_date TIMESTAMP WITH TIME ZONE; -- Ensure renewal_date exists

-- 2. SCHEDULED ACTIONS (MÓDULO 4)
CREATE TABLE IF NOT EXISTS public.scheduled_actions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    action_type TEXT NOT NULL DEFAULT 'retention_message',
    client_id TEXT NOT NULL,
    execute_at TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
    message_payload TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. DAILY REPORTS (MÓDULO 6)
CREATE TABLE IF NOT EXISTS public.daily_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    report_date DATE UNIQUE NOT NULL DEFAULT CURRENT_DATE,
    dms_sent INTEGER DEFAULT 0,
    replies INTEGER DEFAULT 0,
    conversations INTEGER DEFAULT 0,
    closes INTEGER DEFAULT 0,
    daily_revenue NUMERIC(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- TRIGGERS & FUNCTIONS
-- ==========================================

-- A) Trigger: Lead to Client (Delivery - Módulo 3)
CREATE OR REPLACE FUNCTION public.handle_lead_closed()
RETURNS trigger AS $$
DECLARE
    est_value NUMERIC(10,2);
BEGIN
    IF NEW.status = 'closed' AND OLD.status != 'closed' THEN
        est_value := COALESCE(NULLIF(NEW.metadata->'sales_context'->>'estimated_value', ''), '0')::NUMERIC(10,2);

        INSERT INTO public.clients (
            lead_id,
            instagram_username, 
            payment_amount,
            status,
            renewal_date,
            delivery_status
        ) VALUES (
            NEW.id,
            NEW.instagram_username,
            est_value,
            'active',
            NOW() + interval '30 days',
            'pending'
        );

        INSERT INTO public.notifications (type, message)
        VALUES ('new_delivery', 'New client converted. Delivery SLA 48h for @' || NEW.instagram_username);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_lead_closed_to_client ON public.leads;
CREATE TRIGGER trg_lead_closed_to_client
    AFTER UPDATE OF status ON public.leads
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_lead_closed();


-- B) Trigger: Delivery to Retention (Módulo 4)
CREATE OR REPLACE FUNCTION public.handle_client_delivered()
RETURNS trigger AS $$
BEGIN
    -- Only trigger when delivery_status strictly transitions to 'delivered'
    IF NEW.delivery_status = 'delivered' AND OLD.delivery_status != 'delivered' THEN
        
        -- Log delivery timestamp safely
        NEW.delivery_date := NOW();

        -- Queue extreme retention scheduled action 24h into the future natively
        INSERT INTO public.scheduled_actions (
            action_type,
            client_id,
            execute_at,
            status,
            message_payload
        ) VALUES (
            'retention_message',
            NEW.instagram_username,
            NOW() + interval '24 hours',
            'pending',
            'How are you feeling with the results so far?'
        );

    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_client_delivered ON public.clients;
CREATE TRIGGER trg_client_delivered
    BEFORE UPDATE OF delivery_status ON public.clients
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_client_delivered();

-- ==========================================
-- RLS POLICIES (Bypassing for internal Admin)
-- ==========================================

ALTER TABLE public.scheduled_actions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_reports DISABLE ROW LEVEL SECURITY;
