-- =============================================
-- 1. Create Funnel Event Table
-- =============================================
create table if not exists public.funnel_events (
    id uuid default uuid_generate_v4() primary key,
    event_type text not null,
    ip_address text,
    niche text,
    location text,
    email text,
    metadata jsonb default '{}'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.funnel_events enable row level security;

-- Policies
create policy "Admins can view funnel_events"
on public.funnel_events
for select
using (
    exists (
        select 1 from public.profiles
        where id = auth.uid() and role = 'CEO'
    )
);

create policy "Public can insert funnel_events"
on public.funnel_events
for insert
with check (true);

-- Indexes for performance
create index if not exists idx_funnel_event_type on public.funnel_events(event_type);
create index if not exists idx_funnel_ip on public.funnel_events(ip_address);
create index if not exists idx_funnel_created_at on public.funnel_events(created_at);
