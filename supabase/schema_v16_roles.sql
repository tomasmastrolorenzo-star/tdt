-- Script configurativo de Roles y Onboarding de Setters

-- 1. Asignamos o aseguramos la existencia de la columna de Role en Profiles (mapeado de auth.users)
-- (Usamos profiles porque el middleware.ts consulta esta tabla pública para ruteo RBAC)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role text DEFAULT 'vendor' CHECK (role IN ('ceo', 'vendor', 'admin'));

-- 2. Conectamos los leads a los Setters para la distribución en Bucket
ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS assigned_to uuid REFERENCES profiles(id) ON DELETE SET NULL;
