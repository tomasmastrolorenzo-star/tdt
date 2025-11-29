-- Create services table for individual services
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    platform TEXT NOT NULL CHECK (platform IN ('INSTAGRAM', 'TIKTOK')),
    service_type TEXT NOT NULL CHECK (service_type IN ('FOLLOWERS', 'LIKES', 'VIEWS')),
    quality TEXT NOT NULL CHECK (quality IN ('ACTIVE', 'PREMIUM', 'VIP')),
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    bonus_percentage INTEGER DEFAULT 0,
    actual_quantity INTEGER NOT NULL, -- quantity + bonus
    description TEXT,
    features JSONB,
    delivery_time TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create packages table for bundles
CREATE TABLE IF NOT EXISTS packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    platform TEXT NOT NULL CHECK (platform IN ('INSTAGRAM', 'TIKTOK')),
    name TEXT NOT NULL,
    level INTEGER NOT NULL,
    followers INTEGER NOT NULL,
    likes INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    comments_posts INTEGER DEFAULT 0,
    price DECIMAL(10, 2) NOT NULL,
    is_best_seller BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT UNIQUE NOT NULL,
    customer_email TEXT NOT NULL,
    customer_username TEXT NOT NULL,
    
    -- Service or Package reference
    service_id UUID REFERENCES services(id),
    package_id UUID REFERENCES packages(id),
    
    -- Order details
    platform TEXT NOT NULL,
    service_type TEXT, -- FOLLOWERS, LIKES, VIEWS, or PACKAGE
    quality TEXT, -- ACTIVE, PREMIUM, VIP (null for packages)
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    
    -- Status tracking
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PROCESSING', 'COMPLETED', 'REJECTED')),
    payment_status TEXT NOT NULL DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'CONFIRMED', 'REJECTED')),
    
    -- Assignment
    assigned_operator_id UUID REFERENCES auth.users(id),
    provider_name TEXT,
    notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_services_platform_type ON services(platform, service_type, quality);
CREATE INDEX idx_packages_platform ON packages(platform);

-- Insert FOLLOWERS services (Instagram & TikTok - same prices)
INSERT INTO services (platform, service_type, quality, quantity, price, bonus_percentage, actual_quantity, delivery_time) VALUES
-- 100 Followers
('INSTAGRAM', 'FOLLOWERS', 'ACTIVE', 100, 1.00, 0, 100, '24-48 hours'),
('INSTAGRAM', 'FOLLOWERS', 'PREMIUM', 100, 2.00, 0, 100, '12-24 hours'),
('INSTAGRAM', 'FOLLOWERS', 'VIP', 100, 3.00, 0, 100, '6-12 hours'),
-- 500 Followers
('INSTAGRAM', 'FOLLOWERS', 'ACTIVE', 500, 5.00, 0, 500, '24-48 hours'),
('INSTAGRAM', 'FOLLOWERS', 'PREMIUM', 500, 10.00, 0, 500, '12-24 hours'),
('INSTAGRAM', 'FOLLOWERS', 'VIP', 500, 15.00, 0, 500, '6-12 hours'),
-- 1,200 Followers
('INSTAGRAM', 'FOLLOWERS', 'ACTIVE', 1200, 10.00, 0, 1200, '24-48 hours'),
('INSTAGRAM', 'FOLLOWERS', 'PREMIUM', 1200, 20.00, 0, 1200, '12-24 hours'),
('INSTAGRAM', 'FOLLOWERS', 'VIP', 1200, 30.00, 0, 1200, '6-12 hours'),
-- 5,000 Followers
('INSTAGRAM', 'FOLLOWERS', 'ACTIVE', 5000, 49.49, 0, 5000, '24-48 hours'),
('INSTAGRAM', 'FOLLOWERS', 'PREMIUM', 5000, 98.98, 0, 5000, '12-24 hours'),
('INSTAGRAM', 'FOLLOWERS', 'VIP', 5000, 148.47, 0, 5000, '6-12 hours'),
-- 10,000 Followers
('INSTAGRAM', 'FOLLOWERS', 'ACTIVE', 10000, 99.99, 0, 10000, '24-48 hours'),
('INSTAGRAM', 'FOLLOWERS', 'PREMIUM', 10000, 199.98, 0, 10000, '12-24 hours'),
('INSTAGRAM', 'FOLLOWERS', 'VIP', 10000, 299.97, 0, 10000, '6-12 hours'),
-- 25,000 Followers
('INSTAGRAM', 'FOLLOWERS', 'ACTIVE', 25000, 199.00, 0, 25000, '24-48 hours'),
('INSTAGRAM', 'FOLLOWERS', 'PREMIUM', 25000, 398.00, 0, 25000, '12-24 hours'),
('INSTAGRAM', 'FOLLOWERS', 'VIP', 25000, 597.00, 0, 597000, '6-12 hours'),
-- 50,000 Followers
('INSTAGRAM', 'FOLLOWERS', 'ACTIVE', 50000, 389.00, 0, 50000, '24-48 hours'),
('INSTAGRAM', 'FOLLOWERS', 'PREMIUM', 50000, 778.00, 0, 50000, '12-24 hours'),
('INSTAGRAM', 'FOLLOWERS', 'VIP', 50000, 1167.00, 0, 50000, '6-12 hours'),
-- 100,000 Followers
('INSTAGRAM', 'FOLLOWERS', 'ACTIVE', 100000, 799.00, 0, 100000, '24-48 hours'),
('INSTAGRAM', 'FOLLOWERS', 'PREMIUM', 100000, 1598.00, 0, 100000, '12-24 hours'),
('INSTAGRAM', 'FOLLOWERS', 'VIP', 100000, 2397.00, 0, 100000, '6-12 hours');

-- Insert LIKES services (Instagram & TikTok - same prices)
INSERT INTO services (platform, service_type, quality, quantity, price, bonus_percentage, actual_quantity, delivery_time) VALUES
-- 100 Likes
('INSTAGRAM', 'LIKES', 'ACTIVE', 100, 0.50, 0, 100, '1-6 hours'),
('INSTAGRAM', 'LIKES', 'PREMIUM', 100, 1.00, 0, 100, '1-3 hours'),
('INSTAGRAM', 'LIKES', 'VIP', 100, 1.50, 0, 100, '30min-1h'),
-- 500 Likes
('INSTAGRAM', 'LIKES', 'ACTIVE', 500, 2.50, 0, 500, '1-6 hours'),
('INSTAGRAM', 'LIKES', 'PREMIUM', 500, 5.00, 0, 500, '1-3 hours'),
('INSTAGRAM', 'LIKES', 'VIP', 500, 7.50, 0, 500, '30min-1h'),
-- 1,200 Likes (20% BONUS)
('INSTAGRAM', 'LIKES', 'ACTIVE', 1200, 5.00, 20, 1440, '1-6 hours'),
('INSTAGRAM', 'LIKES', 'PREMIUM', 1200, 10.00, 20, 1440, '1-3 hours'),
('INSTAGRAM', 'LIKES', 'VIP', 1200, 15.00, 20, 1440, '30min-1h'),
-- 5,000 Likes (20% BONUS)
('INSTAGRAM', 'LIKES', 'ACTIVE', 5000, 24.75, 20, 6000, '1-6 hours'),
('INSTAGRAM', 'LIKES', 'PREMIUM', 5000, 49.50, 20, 6000, '1-3 hours'),
('INSTAGRAM', 'LIKES', 'VIP', 5000, 74.25, 20, 6000, '30min-1h'),
-- 10,000 Likes (20% BONUS)
('INSTAGRAM', 'LIKES', 'ACTIVE', 10000, 50.00, 20, 12000, '1-6 hours'),
('INSTAGRAM', 'LIKES', 'PREMIUM', 10000, 100.00, 20, 12000, '1-3 hours'),
('INSTAGRAM', 'LIKES', 'VIP', 10000, 150.00, 20, 12000, '30min-1h'),
-- 25,000 Likes (20% BONUS)
('INSTAGRAM', 'LIKES', 'ACTIVE', 25000, 99.50, 20, 30000, '1-6 hours'),
('INSTAGRAM', 'LIKES', 'PREMIUM', 25000, 199.00, 20, 30000, '1-3 hours'),
('INSTAGRAM', 'LIKES', 'VIP', 25000, 298.50, 20, 30000, '30min-1h'),
-- 50,000 Likes (20% BONUS)
('INSTAGRAM', 'LIKES', 'ACTIVE', 50000, 194.50, 20, 60000, '1-6 hours'),
('INSTAGRAM', 'LIKES', 'PREMIUM', 50000, 389.00, 20, 60000, '1-3 hours'),
('INSTAGRAM', 'LIKES', 'VIP', 50000, 583.50, 20, 60000, '30min-1h'),
-- 100,000 Likes (20% BONUS)
('INSTAGRAM', 'LIKES', 'ACTIVE', 100000, 399.50, 20, 120000, '1-6 hours'),
('INSTAGRAM', 'LIKES', 'PREMIUM', 100000, 799.00, 20, 120000, '1-3 hours'),
('INSTAGRAM', 'LIKES', 'VIP', 100000, 1198.50, 20, 120000, '30min-1h');

-- Insert VIEWS services (Instagram & TikTok - same prices)
INSERT INTO services (platform, service_type, quality, quantity, price, bonus_percentage, actual_quantity, delivery_time) VALUES
-- 100 Views
('INSTAGRAM', 'VIEWS', 'ACTIVE', 100, 0.35, 0, 100, '1-6 hours'),
('INSTAGRAM', 'VIEWS', 'PREMIUM', 100, 0.70, 0, 100, '1-3 hours'),
('INSTAGRAM', 'VIEWS', 'VIP', 100, 1.05, 0, 100, '30min-1h'),
-- 500 Views
('INSTAGRAM', 'VIEWS', 'ACTIVE', 500, 1.00, 0, 500, '1-6 hours'),
('INSTAGRAM', 'VIEWS', 'PREMIUM', 500, 2.00, 0, 500, '1-3 hours'),
('INSTAGRAM', 'VIEWS', 'VIP', 500, 3.00, 0, 500, '30min-1h'),
-- 1,200 Views (20% BONUS)
('INSTAGRAM', 'VIEWS', 'ACTIVE', 1200, 2.50, 20, 1440, '1-6 hours'),
('INSTAGRAM', 'VIEWS', 'PREMIUM', 1200, 5.00, 20, 1440, '1-3 hours'),
('INSTAGRAM', 'VIEWS', 'VIP', 1200, 7.50, 20, 1440, '30min-1h'),
-- 5,000 Views (20% BONUS)
('INSTAGRAM', 'VIEWS', 'ACTIVE', 5000, 5.00, 20, 6000, '1-6 hours'),
('INSTAGRAM', 'VIEWS', 'PREMIUM', 5000, 10.00, 20, 6000, '1-3 hours'),
('INSTAGRAM', 'VIEWS', 'VIP', 5000, 15.00, 20, 6000, '30min-1h'),
-- 10,000 Views (20% BONUS)
('INSTAGRAM', 'VIEWS', 'ACTIVE', 10000, 9.99, 20, 12000, '1-6 hours'),
('INSTAGRAM', 'VIEWS', 'PREMIUM', 10000, 19.98, 20, 12000, '1-3 hours'),
('INSTAGRAM', 'VIEWS', 'VIP', 10000, 29.97, 20, 12000, '30min-1h'),
-- 25,000 Views (20% BONUS)
('INSTAGRAM', 'VIEWS', 'ACTIVE', 25000, 19.99, 20, 30000, '1-6 hours'),
('INSTAGRAM', 'VIEWS', 'PREMIUM', 25000, 39.98, 20, 30000, '1-3 hours'),
('INSTAGRAM', 'VIEWS', 'VIP', 25000, 59.97, 20, 30000, '30min-1h'),
-- 50,000 Views (20% BONUS)
('INSTAGRAM', 'VIEWS', 'ACTIVE', 50000, 39.99, 20, 60000, '1-6 hours'),
('INSTAGRAM', 'VIEWS', 'PREMIUM', 50000, 79.98, 20, 60000, '1-3 hours'),
('INSTAGRAM', 'VIEWS', 'VIP', 50000, 119.97, 20, 60000, '30min-1h'),
-- 100,000 Views (20% BONUS)
('INSTAGRAM', 'VIEWS', 'ACTIVE', 100000, 79.99, 20, 120000, '1-6 hours'),
('INSTAGRAM', 'VIEWS', 'PREMIUM', 100000, 159.98, 20, 120000, '1-3 hours'),
('INSTAGRAM', 'VIEWS', 'VIP', 100000, 239.97, 20, 120000, '30min-1h');

-- Duplicate all services for TikTok
INSERT INTO services (platform, service_type, quality, quantity, price, bonus_percentage, actual_quantity, delivery_time)
SELECT 'TIKTOK', service_type, quality, quantity, price, bonus_percentage, actual_quantity, delivery_time
FROM services WHERE platform = 'INSTAGRAM';

-- Insert Packages (Bundles)
INSERT INTO packages (platform, name, level, followers, likes, comments, comments_posts, price, is_best_seller) VALUES
('INSTAGRAM', 'STARTER', 2, 2500, 0, 0, 0, 29.99, false),
('INSTAGRAM', 'VIRAL', 3, 5000, 500, 10, 3, 49.49, false),
('INSTAGRAM', 'PRO', 4, 10000, 1000, 30, 5, 99.99, true),
('INSTAGRAM', 'PLATINUM', 5, 50000, 5000, 50, 0, 389.00, false),
('INSTAGRAM', 'SUPREMO', 6, 100000, 10000, 100, 0, 799.00, false);

-- Duplicate packages for TikTok
INSERT INTO packages (platform, name, level, followers, likes, comments, comments_posts, price, is_best_seller)
SELECT 'TIKTOK', name, level, followers, likes, comments, comments_posts, price, is_best_seller
FROM packages WHERE platform = 'INSTAGRAM';
