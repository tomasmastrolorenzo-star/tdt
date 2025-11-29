# Supabase Setup Instructions

## 1. Run Migrations

Go to your Supabase project dashboard:
1. Navigate to **SQL Editor**
2. Copy and paste the content from `supabase/migrations/001_create_services_and_orders.sql`
3. Click **Run**
4. Copy and paste the content from `supabase/migrations/002_create_policies.sql`
5. Click **Run**

## 2. Verify Tables

Go to **Table Editor** and verify you see:
- `services` table with 18 rows (6 services × 3 qualities)
- `orders` table (empty initially)

## 3. Test Data

The migration automatically inserts all services with real prices:

### Instagram Services
- **Followers**: $2.50 (Active), $5.00 (Premium), $10.00 (VIP) per 1000
- **Likes**: $1.50 (Active), $3.00 (Premium), $6.00 (VIP) per 1000
- **Views**: $0.50 (Active), $1.00 (Premium), $2.00 (VIP) per 1000

### TikTok Services
- **Followers**: $3.00 (Active), $6.00 (Premium), $12.00 (VIP) per 1000
- **Likes**: $1.00 (Active), $2.00 (Premium), $4.00 (VIP) per 1000
- **Views**: $0.30 (Active), $0.60 (Premium), $1.20 (VIP) per 1000

## Next Steps

After running migrations, the app will be able to:
1. Fetch services from database
2. Create orders
3. Track order status
4. Manage payments
