-- =============================================
-- TREND DIGITAL TRADE - Database Schema (idempotent)
-- =============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =============================================
-- TABLES
-- =============================================

-- PROFILES (Extends Supabase Auth)
create table if not exists public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  role text default 'user' check (role in ('user', 'admin', 'reseller')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- CREDITS (User Balances)
create table if not exists public.credits (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null unique,
  balance decimal(10, 2) default 0.00 not null check (balance >= 0),
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- TRANSACTIONS (History of all movements)
create table if not exists public.transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  amount decimal(10, 2) not null,
  type text not null check (type in ('deposit', 'purchase', 'refund', 'adjustment')),
  description text,
  reference_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ORDERS (Service Orders)
create table if not exists public.orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  service_id integer not null,
  service_name text,
  link text not null,
  quantity integer not null,
  cost decimal(10, 2) not null,
  status text default 'pending' check (status in ('pending', 'processing', 'completed', 'partial', 'canceled', 'refunded')),
  jap_order_id integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

alter table public.profiles enable row level security;
alter table public.credits enable row level security;
alter table public.transactions enable row level security;
alter table public.orders enable row level security;

-- Profiles policies (idempotent)
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile" on public.profiles for select using ((SELECT auth.uid()) = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles for update using ((SELECT auth.uid()) = id);

-- Credits policies (idempotent)
drop policy if exists "Users can view own balance" on public.credits;
create policy "Users can view own balance" on public.credits for select using ((SELECT auth.uid()) = user_id);

-- Transactions policies (idempotent)
drop policy if exists "Users can view own transactions" on public.transactions;
create policy "Users can view own transactions" on public.transactions for select using ((SELECT auth.uid()) = user_id);

-- Orders policies (idempotent)
drop policy if exists "Users can view own orders" on public.orders;
create policy "Users can view own orders" on public.orders for select using ((SELECT auth.uid()) = user_id);

drop policy if exists "Users can create orders" on public.orders;
create policy "Users can create orders" on public.orders for insert with check ((SELECT auth.uid()) = user_id);

-- =============================================
-- FUNCTIONS & TRIGGERS
-- =============================================

-- Auto-create profile and credit entry on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;

  insert into public.credits (user_id, balance)
  values (new.id, 0.00)
  on conflict (user_id) do nothing;

  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =============================================
-- INDEXES (Performance)
-- =============================================

create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_credits_user_id on public.credits(user_id);
create index if not exists idx_transactions_user_id on public.transactions(user_id);
create index if not exists idx_orders_user_id on public.orders(user_id);
create index if not exists idx_orders_status on public.orders(status);

-- =============================================
-- ATOMIC FUNCTIONS (Financial Integrity)
-- =============================================

-- Function to safely deduct balance
create or replace function public.deduct_balance(
  p_user_id uuid,
  p_amount decimal,
  p_description text,
  p_service_id integer default null,
  p_order_id uuid default null
)
returns boolean
language plpgsql
security definer
as $$
declare
  current_bal decimal;
begin
  select balance into current_bal from public.credits where user_id = p_user_id for update;

  if not found then
    raise exception 'User credits not found';
  end if;

  if current_bal < p_amount then
    return false;
  end if;

  update public.credits
  set balance = balance - p_amount,
      updated_at = now()
  where user_id = p_user_id;

  insert into public.transactions (user_id, amount, type, description, reference_id)
  values (p_user_id, -p_amount, 'purchase', p_description, p_order_id::text);

  return true;
end;
$$;

-- Function to add balance
create or replace function public.add_balance(
  p_user_id uuid,
  p_amount decimal,
  p_description text,
  p_type text default 'deposit',
  p_reference_id text default null
)
returns boolean
language plpgsql
security definer
as $$
begin
  update public.credits
  set balance = balance + p_amount,
      updated_at = now()
  where user_id = p_user_id;

  if not found then
    return false;
  end if;

  insert into public.transactions (user_id, amount, type, description, reference_id)
  values (p_user_id, p_amount, p_type, p_description, p_reference_id);

  return true;
end;
$$;
