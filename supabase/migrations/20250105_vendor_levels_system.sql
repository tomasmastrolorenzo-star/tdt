-- Vendor Levels System Migration
-- This creates the foundation for the vendor motivation system

-- Create vendor_levels table
CREATE TABLE IF NOT EXISTS vendor_levels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  min_sales DECIMAL NOT NULL,
  max_sales DECIMAL,
  commission_rate INTEGER NOT NULL,
  badge_color TEXT NOT NULL,
  display_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default levels
INSERT INTO vendor_levels (name, min_sales, max_sales, commission_rate, badge_color, display_order) VALUES
  ('Novato', 0, 999.99, 10, '#64748b', 1),
  ('Pro', 1000, 4999.99, 15, '#3b82f6', 2),
  ('Experto', 5000, 14999.99, 20, '#8b5cf6', 3),
  ('Elite', 15000, NULL, 25, '#f59e0b', 4);

-- Create vendor_achievements table
CREATE TABLE IF NOT EXISTS vendor_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_type TEXT NOT NULL,
  achievement_data JSONB,
  achieved_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(vendor_id, achievement_type)
);

-- Add new columns to profiles table for vendor stats
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS current_level_id UUID REFERENCES vendor_levels(id),
ADD COLUMN IF NOT EXISTS total_sales DECIMAL DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_level_update TIMESTAMPTZ;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_profiles_total_sales ON profiles(total_sales DESC);
CREATE INDEX IF NOT EXISTS idx_vendor_achievements_vendor_id ON vendor_achievements(vendor_id);

-- Function to update vendor level based on sales
CREATE OR REPLACE FUNCTION update_vendor_level()
RETURNS TRIGGER AS $$
DECLARE
  v_total_sales DECIMAL;
  v_new_level_id UUID;
  v_old_level_id UUID;
BEGIN
  -- Calculate total sales for this vendor
  SELECT COALESCE(SUM(price_final), 0)
  INTO v_total_sales
  FROM orders
  WHERE seller_id = NEW.seller_id
    AND status = 'COMPLETED';

  -- Get current level
  SELECT current_level_id INTO v_old_level_id
  FROM profiles
  WHERE id = NEW.seller_id;

  -- Determine new level based on total sales
  SELECT id INTO v_new_level_id
  FROM vendor_levels
  WHERE v_total_sales >= min_sales
    AND (max_sales IS NULL OR v_total_sales <= max_sales)
  ORDER BY min_sales DESC
  LIMIT 1;

  -- Update profile with new stats
  UPDATE profiles
  SET 
    total_sales = v_total_sales,
    current_level_id = v_new_level_id,
    last_level_update = CASE 
      WHEN v_old_level_id IS DISTINCT FROM v_new_level_id THEN NOW()
      ELSE last_level_update
    END
  WHERE id = NEW.seller_id;

  -- If level changed, create achievement
  IF v_old_level_id IS DISTINCT FROM v_new_level_id AND v_new_level_id IS NOT NULL THEN
    INSERT INTO vendor_achievements (vendor_id, achievement_type, achievement_data)
    VALUES (
      NEW.seller_id,
      'level_up',
      jsonb_build_object(
        'new_level_id', v_new_level_id,
        'old_level_id', v_old_level_id,
        'total_sales', v_total_sales
      )
    )
    ON CONFLICT (vendor_id, achievement_type) DO UPDATE
    SET 
      achievement_data = EXCLUDED.achievement_data,
      achieved_at = NOW();
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update vendor level when order is completed
DROP TRIGGER IF EXISTS trigger_update_vendor_level ON orders;
CREATE TRIGGER trigger_update_vendor_level
  AFTER INSERT OR UPDATE OF status ON orders
  FOR EACH ROW
  WHEN (NEW.status = 'COMPLETED' AND NEW.seller_id IS NOT NULL)
  EXECUTE FUNCTION update_vendor_level();

-- Initialize levels for existing vendors
DO $$
DECLARE
  vendor_record RECORD;
  v_total_sales DECIMAL;
  v_level_id UUID;
BEGIN
  FOR vendor_record IN 
    SELECT id FROM profiles WHERE role = 'VENDOR'
  LOOP
    -- Calculate total sales
    SELECT COALESCE(SUM(price_final), 0)
    INTO v_total_sales
    FROM orders
    WHERE seller_id = vendor_record.id
      AND status = 'COMPLETED';

    -- Get appropriate level
    SELECT id INTO v_level_id
    FROM vendor_levels
    WHERE v_total_sales >= min_sales
      AND (max_sales IS NULL OR v_total_sales <= max_sales)
    ORDER BY min_sales DESC
    LIMIT 1;

    -- Update vendor
    UPDATE profiles
    SET 
      total_sales = v_total_sales,
      current_level_id = v_level_id,
      last_level_update = NOW()
    WHERE id = vendor_record.id;
  END LOOP;
END $$;

-- RLS Policies for vendor_levels (public read)
ALTER TABLE vendor_levels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view vendor levels"
  ON vendor_levels FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for vendor_achievements
ALTER TABLE vendor_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vendors can view their own achievements"
  ON vendor_achievements FOR SELECT
  TO authenticated
  USING (vendor_id = auth.uid());

CREATE POLICY "Admins can view all achievements"
  ON vendor_achievements FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('CEO', 'OPERATOR')
    )
  );

COMMENT ON TABLE vendor_levels IS 'Defines vendor level tiers with sales requirements and commission rates';
COMMENT ON TABLE vendor_achievements IS 'Tracks vendor milestones and achievements';
COMMENT ON FUNCTION update_vendor_level() IS 'Automatically updates vendor level when orders are completed';
