-- =============================================
-- TREND DIGITAL TRADE - Database Schema (Corrected & Re-runnable)
-- =============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =============================================
-- 1. TABLES
-- =============================================

-- PROFILES (Extends Supabase Auth)
create table if not exists public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  role text default 'VENDOR' check (role in ('CEO', 'OPERATOR', 'VENDOR')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- SERVICES
create table if not exists public.services (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  base_price numeric(10, 2) not null default 0.00,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- CREDITS (User Balances)
create table if not exists public.credits (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null unique,
  balance numeric(10, 2) default 0.00 not null check (balance >= 0),
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ORDERS
create table if not exists public.orders (
  id uuid default uuid_generate_v4() primary key,
  seller_id uuid references public.profiles(id) not null,
  service_id uuid references public.services(id),
  client_name text not null,
  client_email text,
  link text,
  price_final numeric(10, 2) not null default 0.00,
  seller_commission numeric(10, 2) not null default 0.00,
  margin_trenzo numeric(10, 2) not null default 0.00,
  status text default 'PENDING_PAYMENT' check (status in ('PENDING_PAYMENT', 'PAYMENT_REJECTED', 'PAYMENT_CONFIRMED', 'PROCESSING', 'COMPLETED')),
  notes text,
  jap_order_id integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- TRANSACTIONS (History)
create table if not exists public.transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  amount numeric(10, 2) not null,
  type text not null check (type in ('deposit', 'purchase', 'refund', 'adjustment')),
  description text,
  reference_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =============================================
-- 2. ROW LEVEL SECURITY (RLS)
-- =============================================

alter table public.profiles enable row level security;
alter table public.services enable row level security;
alter table public.credits enable row level security;
alter table public.orders enable row level security;
alter table public.transactions enable row level security;

-- PROFILES
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- SERVICES
drop policy if exists "Public read access to active services" on public.services;
create policy "Public read access to active services" on public.services
  for select using (is_active = true);

-- CREDITS
drop policy if exists "Users can view own balance" on public.credits;
create policy "Users can view own balance" on public.credits
  for select using (auth.uid() = user_id);

-- ORDERS
drop policy if exists "Users can view own orders" on public.orders;
create policy "Users can view own orders" on public.orders
  for select using (auth.uid() = seller_id);

drop policy if exists "Users can create orders" on public.orders;
create policy "Users can create orders" on public.orders
  for insert with check (auth.uid() = seller_id);

drop policy if exists "Users can update own orders" on public.orders;
create policy "Users can update own orders" on public.orders
  for update using (auth.uid() = seller_id);

-- TRANSACTIONS
drop policy if exists "Users can view own transactions" on public.transactions;
create policy "Users can view own transactions" on public.transactions
  for select using (auth.uid() = user_id);

-- =============================================
-- 3. FUNCTIONS & TRIGGERS
-- =============================================

-- Handle New User (Trigger)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name',
    'VENDOR'
  );
  
  insert into public.credits (user_id, balance)
  values (new.id, 0.00);
  
  return new;
end;
$$ language plpgsql security definer;

-- Secure the function
revoke execute on function public.handle_new_user() from public;
revoke execute on function public.handle_new_user() from anon;
revoke execute on function public.handle_new_user() from authenticated;

-- Trigger definition
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =============================================
-- 4. INDEXES
-- =============================================

create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_orders_seller_id on public.orders(seller_id);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_transactions_user_id on public.transactions(user_id);
