-- TDT Community Pivot Migration
-- Adds community-specific fields and academy resources table

-- 1. Add community profile fields to existing users table
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS telegram_username TEXT,
  ADD COLUMN IF NOT EXISTS bingx_uid TEXT,
  ADD COLUMN IF NOT EXISTS bingx_verified BOOLEAN DEFAULT FALSE NOT NULL,
  ADD COLUMN IF NOT EXISTS community_role TEXT DEFAULT 'member' 
    CHECK (community_role IN ('admin', 'member'));

-- 2. Academy resources table (PDFs managed by admin)
CREATE TABLE IF NOT EXISTS academy_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'general' 
    CHECK (category IN ('novatos', 'estrategia', 'marca_personal')),
  file_url TEXT NOT NULL,
  thumbnail_url TEXT,
  order_index INT DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable RLS on academy_resources
ALTER TABLE academy_resources ENABLE ROW LEVEL SECURITY;

-- Members can read published resources
CREATE POLICY "Members can view published resources"
  ON academy_resources FOR SELECT
  USING (is_published = TRUE);

-- Only admins can manage resources
CREATE POLICY "Admins can manage resources"
  ON academy_resources FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.community_role = 'admin'
    )
  );

-- 4. Seed placeholder resources for the 3 pillars
INSERT INTO academy_resources (title, description, category, file_url, order_index)
VALUES 
  (
    'Guía de Inicio: Cómo crear tu cuenta BingX',
    'Paso a paso para registrarte en BingX, verificar tu identidad y hacer tu primer depósito.',
    'novatos',
    'https://www.w3.org/WAI/WCAG21/Techniques/pdf/pdf-sample.pdf',
    1
  ),
  (
    'Conceptos Base: Futuros y Spot',
    'Diferencias entre trading spot y futuros. Gestión de riesgo para principiantes.',
    'novatos',
    'https://www.w3.org/WAI/WCAG21/Techniques/pdf/pdf-sample.pdf',
    2
  ),
  (
    'Reading del Mercado: Estructura de Precios',
    'Cómo leer los movimientos institucionales y encontrar puntos de entrada de alto valor.',
    'estrategia',
    'https://www.w3.org/WAI/WCAG21/Techniques/pdf/pdf-sample.pdf',
    1
  ),
  (
    'Gestión de Capital: El Sistema TDT',
    'El framework de sizing de posiciones y gestión de drawdown utilizado en TDT.',
    'estrategia',
    'https://www.w3.org/WAI/WCAG21/Techniques/pdf/pdf-sample.pdf',
    2
  ),
  (
    'Tu Marca Personal en el Mundo Digital',
    'Cómo construir tu presencia online y monetizar tu conocimiento como trader.',
    'marca_personal',
    'https://www.w3.org/WAI/WCAG21/Techniques/pdf/pdf-sample.pdf',
    1
  ),
  (
    'Sistema de Referidos TDT',
    'Cómo invitar miembros a la comunidad y generar ingresos pasivos con el programa de referidos.',
    'marca_personal',
    'https://www.w3.org/WAI/WCAG21/Techniques/pdf/pdf-sample.pdf',
    2
  )
ON CONFLICT DO NOTHING;
