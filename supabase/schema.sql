-- TABLAS EXISTENTES EN SUPABASE:

-- 1. LEVELS (5 registros)
CREATE TABLE levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,           -- 'Novato', 'Intermedio', 'Avanzado', 'Experto', 'Master'
  min_sales INTEGER NOT NULL,   -- 0, 10, 50, 100, 500
  commission_rate DECIMAL(5,2), -- 10.00, 15.00, 20.00, 25.00, 30.00
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. USERS (1 registro - Tomas como OPERATOR)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,           -- 'CEO', 'OPERATOR', 'VENDOR'
  level_id UUID REFERENCES levels(id),
  referral_code TEXT UNIQUE,
  referred_by UUID REFERENCES users(id),
  total_sales INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. WALLETS (1 registro)
CREATE TABLE wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  balance DECIMAL(10,2) DEFAULT 0,
  pending_balance DECIMAL(10,2) DEFAULT 0,
  total_earned DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. WALLET_MOVEMENTS
CREATE TABLE wallet_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID REFERENCES wallets(id),
  type TEXT NOT NULL,           -- 'COMMISSION', 'WITHDRAWAL', 'ADJUSTMENT', 'AFFILIATE_BONUS'
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  order_id UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. SERVICES (6 registros)
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  base_price DECIMAL(10,2) NOT NULL,
  category TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. ORDERS (0 registros)
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID REFERENCES users(id),
  service_id UUID REFERENCES services(id),
  client_name TEXT NOT NULL,
  client_email TEXT,
  client_phone TEXT,
  sale_price DECIMAL(10,2) NOT NULL,
  cost_price DECIMAL(10,2) NOT NULL,
  vendor_commission DECIMAL(10,2),
  trenzo_margin DECIMAL(10,2),
  status TEXT DEFAULT 'PENDING', -- 'PENDING', 'CONFIRMED', 'PAID', 'CANCELLED'
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  confirmed_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ
);

-- 7. COMMISSIONS
CREATE TABLE commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  user_id UUID REFERENCES users(id),
  type TEXT NOT NULL,           -- 'SALE', 'AFFILIATE', 'BONUS'
  amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'PENDING',-- 'PENDING', 'APPROVED', 'PAID'
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. AFFILIATES
CREATE TABLE affiliates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID REFERENCES users(id),
  referred_id UUID REFERENCES users(id),
  first_sale_commission DECIMAL(10,2),
  is_first_sale_paid BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. RANKINGS
CREATE TABLE rankings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  period TEXT NOT NULL,         -- '2024-01', '2024-W01'
  total_sales INTEGER DEFAULT 0,
  total_revenue DECIMAL(10,2) DEFAULT 0,
  total_commission DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- TRIGGERS & FUNCTIONS
-- =============================================

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
declare
  default_level_id uuid;
begin
  -- Get the ID for the 'Novato' level
  select id into default_level_id from public.levels where name = 'Novato' limit 1;

  -- Insert into public.users
  insert into public.users (id, email, name, role, level_id)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', 'New User'),
    coalesce(new.raw_user_meta_data->>'role', 'VENDOR'),
    default_level_id
  );

  -- Create a wallet for the user
  insert into public.wallets (user_id)
  values (new.id);

  return new;
end;
$$ language plpgsql security definer;

-- Trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
