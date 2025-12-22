-- TDT AUTHORITY ENGINE - FAT-V6 CORE SCHEMA
-- ACTUALIZACIÓN FINAL: FASE 12 - CRISTALIZACIÓN
-- SEVERITY: MISSION_CRITICAL

-- 1. EXTENSIONES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TIPOS DE ESTATUS (ELITE STANDARDS)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'asset_tier') THEN
        CREATE TYPE asset_tier AS ENUM ('SILVER', 'GOLD', 'BLACK', 'LAZARUS');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'nda_status') THEN
        CREATE TYPE nda_status AS ENUM ('PENDING', 'SIGNED');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
        CREATE TYPE payment_status AS ENUM ('PENDING', 'PAID', 'FAILED');
    END IF;
END $$;

-- 3. TABLA MAESTRA DE ACTIVOS (CEREBRO FORENSE)
CREATE TABLE IF NOT EXISTS public.digital_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT now(),
    handle TEXT UNIQUE NOT NULL,
    niche_id TEXT NOT NULL,
    followers INTEGER NOT NULL,
    trusted_multiplier DECIMAL(6,4), -- Lógica: (Likes + Comms*2) / Followers
    human_entropy_score DECIMAL(4,2), -- Lógica: Deterministic Variance
    is_lazarus BOOLEAN DEFAULT FALSE,
    tier asset_tier DEFAULT 'SILVER',
    nda_status nda_status DEFAULT 'PENDING',
    payment_status TEXT DEFAULT 'PENDING',
    forensic_report_json JSONB, -- Estructura de Reporte de $25,000
    last_audit_at TIMESTAMPTZ DEFAULT now()
);

-- 4. LOGS DE RECUPERACIÓN (TRAZABILIDAD LÁZARO)
CREATE TABLE IF NOT EXISTS public.recovery_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID REFERENCES public.digital_assets(id) ON DELETE CASCADE,
    recorded_at TIMESTAMPTZ DEFAULT now(),
    reach_delta INTEGER,
    entropy_gain DECIMAL(4,2)
);

-- 5. SEGURIDAD Y PERMISOS
ALTER TABLE public.digital_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access for authenticated handles" ON public.digital_assets FOR SELECT USING (true);
CREATE POLICY "System insert access" ON public.digital_assets FOR INSERT WITH CHECK (true);

-- COMENTARIO DE CIERRE
COMMENT ON TABLE public.digital_assets IS 'Repositorio central de activos de alta capitalización TDT.';