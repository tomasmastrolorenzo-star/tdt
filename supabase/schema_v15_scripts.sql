-- =============================================
-- V15: Script Library + Lead Interactions
-- Paste this in Supabase SQL Editor and run
-- =============================================

-- 1. LEAD INTERACTIONS TABLE
create table if not exists public.lead_interactions (
  id uuid default gen_random_uuid() primary key,
  lead_id uuid references public.leads(id) on delete cascade,
  tipo text not null check (tipo in ('nota', 'estado_cambio', 'mensaje', 'sistema')),
  contenido text,
  created_at timestamp with time zone default now()
);

-- Index for fast lead queries
create index if not exists idx_lead_interactions_lead_id on lead_interactions(lead_id);
create index if not exists idx_lead_interactions_created_at on lead_interactions(created_at desc);

-- 2. SCRIPTS TABLE (spec schema)
drop table if exists public.scripts cascade;

create table if not exists public.scripts (
  id uuid default gen_random_uuid() primary key,
  nicho text not null default 'todos' check (nicho in ('fitness', 'emprendedor', 'modelo', 'otro', 'todos')),
  etapa text not null default 'cold_dm' check (etapa in ('cold_dm', 'followup_1', 'followup_2', 'oferta', 'cierre', 'reengagement')),
  contenido text not null,
  es_ganador boolean default false,
  usos integer default 0,
  conversiones integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Winners first, then by creation date
create index if not exists idx_scripts_nicho_etapa on scripts(nicho, etapa);
create index if not exists idx_scripts_es_ganador on scripts(es_ganador desc, created_at desc);

-- 3. PATCH MISSING COLUMNS on existing tables
alter table public.clients add column if not exists delivery_notes text;
alter table public.clients add column if not exists delivery_started_at timestamp with time zone;
alter table public.scheduled_actions add column if not exists completed_at timestamp with time zone;

-- 4. Disable RLS for internal admin tables
alter table public.lead_interactions disable row level security;
alter table public.scripts disable row level security;

-- =============================================
-- DONE. Tables: lead_interactions, scripts
-- =============================================
