-- =============================================
-- V16: Scheduled Actions Dedup + Lead Assignment
-- =============================================

-- 1. D4: Prevent duplicate pending renewal reminders
-- We use a partial unique index to only care about 'pending' status
CREATE UNIQUE INDEX IF NOT EXISTS idx_scheduled_actions_renewal_dedup 
ON public.scheduled_actions (client_id, action_type) 
WHERE (status = 'pending' AND action_type = 'renewal_reminder');

-- 2. D2: Role-based access field for leads
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES auth.users(id);

-- Create index for fast filtering by setter
CREATE INDEX IF NOT EXISTS idx_leads_assigned_to ON public.leads(assigned_to);

-- 3. Ensure daily_reports has necessary fields for D5 sync (if missing)
-- (They should exist but let's be safe)
ALTER TABLE public.daily_reports ADD COLUMN IF NOT EXISTS dms_sent INTEGER DEFAULT 0;
ALTER TABLE public.daily_reports ADD COLUMN IF NOT EXISTS replies INTEGER DEFAULT 0;
ALTER TABLE public.daily_reports ADD COLUMN IF NOT EXISTS conversations INTEGER DEFAULT 0;
ALTER TABLE public.daily_reports ADD COLUMN IF NOT EXISTS closes INTEGER DEFAULT 0;
ALTER TABLE public.daily_reports ADD COLUMN IF NOT EXISTS daily_revenue NUMERIC(10, 2) DEFAULT 0.00;
