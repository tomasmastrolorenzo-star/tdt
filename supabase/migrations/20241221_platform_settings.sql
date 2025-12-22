-- Migration: Add platform_settings table
create table if not exists public.platform_settings (
    key text primary key,
    value jsonb not null,
    updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.platform_settings enable row level security;

-- Policies
create policy "Admins can manage platform_settings" 
on public.platform_settings 
for all 
using (
    exists (
        select 1 from public.profiles 
        where id = auth.uid() and role = 'CEO'
    )
);

create policy "Public can read platform_settings"
on public.platform_settings
for select
to anon, authenticated
using (true);

-- Seed initial data
insert into public.platform_settings (key, value) 
values 
('pricing_plans', '[
    {
        "id": "starter",
        "name": "GROWTH STARTER",
        "monthlyPrice": 49,
        "quarterlyPrice": 117,
        "description": "Ideal for new accounts starting from zero authority.",
        "features": ["Foundation Build", "Basic Audience Expansion", "Organic Optimization", "24/7 Support Access"],
        "badge": "Safe Entry"
    },
    {
        "id": "pro",
        "name": "VIRAL MOMENTUM",
        "monthlyPrice": 99,
        "quarterlyPrice": 237,
        "description": "Aggressive growth to trigger algorithm recommendations.",
        "features": ["Accelerated Growth Engine", "AI Viral Strategy", "Viral Hashtag Cluster", "Regional Targeted Audience", "Priority Optimization"],
        "badge": "🔥 BEST FOR AI GROWTH"
    },
    {
        "id": "dominance",
        "name": "BRAND PARTNER",
        "monthlyPrice": 249,
        "quarterlyPrice": 597,
        "description": "Full-scale reputation management & authority building.",
        "features": ["Maximum Velocity", "Dedicated Account Manager", "Full-Scale Reputation Mgmt", "Authority Building", "VIP Support"],
        "badge": "MAXIMUM ROI"
    }
]'::jsonb),
('discounts', '{
    "crypto": 0.10,
    "quarterly": 0.20
}'::jsonb),
('order_bump', '{
    "id": "priority_processing",
    "name": "Priority Processing",
    "price": 4.99,
    "description": "Yes, add priority processing for $4.99."
}'::jsonb)
on conflict (key) do nothing;
