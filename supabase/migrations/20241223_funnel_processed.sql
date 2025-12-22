
-- Add processed_at to track if a webhook has been sent for this event
alter table public.funnel_events 
add column if not exists processed_at timestamp with time zone;

-- Index for cron performance
create index if not exists idx_funnel_processed_at on public.funnel_events(processed_at) where processed_at is null;
