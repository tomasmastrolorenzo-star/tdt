-- Phase 23: Sales Ledger & Accounting Agent (Bloque 2)

-- 1. Ampliacion de la matriz financiera en la tabla Clients
ALTER TABLE clients 
ADD COLUMN IF NOT EXISTS payment_method text,
ADD COLUMN IF NOT EXISTS payment_proof_url text,
ADD COLUMN IF NOT EXISTS before_profile_url text,
ADD COLUMN IF NOT EXISTS net_revenue numeric;

-- 2. Creacion del Storage Bucket para los Assets (Comprobantes y Fotos Antes)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('sales_assets', 'sales_assets', true)
ON CONFLICT (id) DO NOTHING;

-- Configuracion de politicas agresivas para lectura publica y escritura administrativa
CREATE POLICY "Public Assets View" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'sales_assets');

CREATE POLICY "Admin Uploads" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'sales_assets' AND auth.role() = 'authenticated');
