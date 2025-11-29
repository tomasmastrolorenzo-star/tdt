# Environment Variables

## 🔐 Required Variables (Production & Dev)

### Supabase (Database & Auth)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... # Server-side only
```

### Paddle (Cards & Subscriptions)
```bash
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=test_...
PADDLE_API_KEY=...
PADDLE_WEBHOOK_SECRET_KEY=...
```

### Cryptomus (Crypto)
```bash
CRYPTOMUS_MERCHANT_ID=merchant_...
CRYPTOMUS_API_KEY=api_...
```

### SMM Provider (Service Delivery)
```bash
SMM_API_URL=https://api.smmprovider.com/v2
SMM_API_KEY=your_api_key_here
```

### Email (Resend)
```bash
RESEND_API_KEY=re_123456789
EMAIL_FROM_ADDRESS=noreply@trendup.com
```

### Analytics
```bash
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

### App Configuration
```bash
NEXT_PUBLIC_APP_URL=https://trendup.com
NODE_ENV=production
```
