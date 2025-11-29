-- Enable Row Level Security
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Services policies (public read, admin write)
CREATE POLICY "Anyone can view active services"
ON services FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage services"
ON services FOR ALL
USING (auth.jwt() ->> 'role' = 'admin');

-- Packages policies (public read, admin write)
CREATE POLICY "Anyone can view active packages"
ON packages FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage packages"
ON packages FOR ALL
USING (auth.jwt() ->> 'role' = 'admin');

-- Orders policies
CREATE POLICY "Users can view their own orders"
ON orders FOR SELECT
USING (
    customer_email = auth.jwt() ->> 'email'
    OR auth.jwt() ->> 'role' IN ('admin', 'operator', 'finance')
);

CREATE POLICY "Anyone can create orders"
ON orders FOR INSERT
WITH CHECK (true);

CREATE POLICY "Operators and admins can update orders"
ON orders FOR UPDATE
USING (auth.jwt() ->> 'role' IN ('admin', 'operator', 'finance'));
