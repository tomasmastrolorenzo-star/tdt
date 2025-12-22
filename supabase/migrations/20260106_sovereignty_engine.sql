-- TDT AUTHORITY ENGINE - FAT-V6 CORE SCHEMA
-- Updated for Zero Roleplay Logic

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Enums
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'asset_tier') THEN
        CREATE TYPE asset_tier AS ENUM ('SILVER', 'GOLD', 'BLACK', 'LAZARUS');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'nda_status') THEN
        CREATE TYPE nda_status AS ENUM ('PENDING', 'SIGNED');
    END IF;
    -- Payment status helpful to keep
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
        CREATE TYPE payment_status AS ENUM ('PENDING', 'PAID', 'FAILED');
    END IF;
END $$;

-- 2. Digital Assets (The Master Table)
CREATE TABLE IF NOT EXISTS public.digital_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT now(),
    handle TEXT UNIQUE NOT NULL,
    niche_id TEXT NOT NULL,
    
    -- Core Metrics (Input)
    followers INTEGER NOT NULL,
    
    -- Calculated Metrics (The Deity Logic)
    trusted_multiplier DECIMAL(6,4),
    human_entropy_score DECIMAL(4,2),
    
    -- Status Flags
    is_lazarus BOOLEAN DEFAULT FALSE,
    tier asset_tier DEFAULT 'SILVER',
    
    -- Closing Ritual
    nda_status nda_status DEFAULT 'PENDING',
    payment_status TEXT DEFAULT 'PENDING',
    
    -- The Product
    forensic_report_json JSONB
);

-- 3. Recovery Logs (The Lazarus Progress)
CREATE TABLE IF NOT EXISTS public.recovery_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID REFERENCES public.digital_assets(id) ON DELETE CASCADE,
    recorded_at TIMESTAMPTZ DEFAULT now(),
    reach_delta INTEGER,
    entropy_gain DECIMAL(4,2)
);

-- Indices
CREATE INDEX IF NOT EXISTS idx_digital_assets_handle ON public.digital_assets(handle);
CREATE INDEX IF NOT EXISTS idx_digital_assets_tier ON public.digital_assets(tier);
