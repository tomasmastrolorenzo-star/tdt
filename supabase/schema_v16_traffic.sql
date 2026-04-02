-- DDL: Actualizaciones a marketing_content para Bloque 3 (Traffic Module Kanban)

-- 1. Renombrar columnas existentes si aplicaba (ignorar errores si ya no existen o se crearon así)
DO $$
BEGIN
  IF EXISTS(SELECT *
    FROM information_schema.columns
    WHERE table_name='marketing_content' and column_name='title')
  THEN
      ALTER TABLE "public"."marketing_content" RENAME COLUMN "title" TO "titulo";
  END IF;

  IF EXISTS(SELECT *
    FROM information_schema.columns
    WHERE table_name='marketing_content' and column_name='status')
  THEN
      ALTER TABLE "public"."marketing_content" RENAME COLUMN "status" TO "estado";
  END IF;
  
  IF EXISTS(SELECT *
    FROM information_schema.columns
    WHERE table_name='marketing_content' and column_name='format')
  THEN
      ALTER TABLE "public"."marketing_content" RENAME COLUMN "format" TO "tipo";
  END IF;
END $$;

-- 2. Agregar columnas estructurales
ALTER TABLE marketing_content
ADD COLUMN IF NOT EXISTS tipo text CHECK (tipo IN ('reel','carrusel','story','foto')),
ADD COLUMN IF NOT EXISTS nicho text CHECK (nicho IN ('fitness','emprendedor','modelo','general')),
ADD COLUMN IF NOT EXISTS semana_programada date,
ADD COLUMN IF NOT EXISTS hook text,
ADD COLUMN IF NOT EXISTS cta text,
ADD COLUMN IF NOT EXISTS resultado_alcance integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS resultado_leads integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS es_winner boolean DEFAULT false;

-- 3. Banco Inicial de Contenidos (Run only once)
INSERT INTO marketing_content (titulo, tipo, nicho, estado, hook, cta) VALUES
('Mejor before/after — resultado real', 'reel', 'general', 'Ideas', '47,000 followers in 60 days.', 'DM me GROW if you want the same for your profile.'),
('Por qué tus reels mueren a las 200 vistas', 'carrusel', 'emprendedor', 'Ideas', 'Stop blaming the algorithm. You are doing this wrong.', 'Save this post for your next upload.'),
('De 5K a 100K (Entrevista fitness)', 'reel', 'fitness', 'Ideas', 'This is exactly how my client jumped to 100K while training.', 'DM me FITNESS.'),
('Construyendo el funnel (Behind the scenes)', 'reel', 'general', 'Ideas', 'Come with me to build a high conversion setter protocol.', 'Drop a 🚀 if you are ready to scale.'),
('El error de estética en perfiles de modelos', 'carrusel', 'modelo', 'Ideas', 'Your pictures are great, but your grid strategy is ruining your reach.', 'Link in bio to audit your grid.'),
('Anuncio directo (Venta)', 'story', 'general', 'Ideas', 'Looking for 3 business owners to scale this month.', 'Reply with SCALE to start.'),
('La anatomía de una historia que vende', 'carrusel', 'emprendedor', 'Ideas', 'Don''t post a story until you read these 4 rules.', 'Follow for more agency secrets.');
