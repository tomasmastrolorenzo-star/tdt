-- Phase 23: SMM Gateway Ledger (Bloque 3)

-- 1. Ampliacion de la tabla Clients para encolar ordenes
ALTER TABLE clients 
ADD COLUMN IF NOT EXISTS smm_order_id text,
ADD COLUMN IF NOT EXISTS smm_status text DEFAULT 'pending';

-- Notas: smm_status puede ser 'pending', 'processing', 'completed', 'failed', 'canceled'
