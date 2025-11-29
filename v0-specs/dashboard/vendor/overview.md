# Component Specification: Vendor Dashboard Overview

**Category**: Dashboard / Vendor  
**Priority**: High  
**Status**: ⏳ Pending

---

## 🎯 Overview

### Purpose
Dashboard principal para vendedores que muestra métricas clave, balance de wallet, órdenes recientes, y acciones rápidas. Es el hub central desde donde los vendedores gestionan su negocio.

### Context
- Primera página después del login para rol vendor
- Vista general del estado del negocio
- Acceso rápido a funciones principales

### Key Features
- Stats cards (balance, órdenes, comisiones, ganancias)
- Tabla de órdenes recientes
- Gráfico de ganancias (opcional)
- Quick actions (crear orden, ver wallet, ver reportes)
- Dark premium aesthetic
- Real-time data updates

---

## 🤖 V0 Prompt

```
Create a vendor dashboard overview page for a B2B SaaS platform using Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui.

COMPONENT PURPOSE:
Main dashboard for vendors showing key business metrics, wallet balance, recent orders, and quick actions. This is the central hub where vendors manage their social media growth service business. Target users are resellers who purchase services and resell to end customers.

DESIGN REQUIREMENTS:
- Style: Dark premium, professional, data-focused
- Color Scheme:
  - Background: Dark (#0f172a)
  - Cards: Slate-800 (#1e293b) with slate-700 borders
  - Primary: Blue-600 (#2563eb)
  - Success: Green-500 (#10b981)
  - Warning: Yellow-500 (#eab308)
  - Danger: Red-500 (#ef4444)
  - Text: Slate-100 primary, Slate-400 secondary
- Typography: Inter font family
- Layout: Grid layout with sidebar navigation
- Responsive: Stack on mobile, grid on desktop

FUNCTIONAL REQUIREMENTS:
1. Display 4 stat cards:
   - Wallet Balance (with currency)
   - Total Orders (count)
   - Pending Orders (count)
   - Total Earnings (with currency)
2. Recent orders table (last 5-10 orders)
3. Quick action buttons
4. Optional: Earnings chart (line/bar chart)
5. Responsive layout

COMPONENTS TO USE:
- shadcn/ui: Card, Table, Button, Badge
- Icons: lucide-react (Wallet, ShoppingCart, Clock, TrendingUp, Plus, Eye, FileText)
- Charts: recharts or similar (optional)

STATES:
- Loading: Skeleton loaders for cards and table
- Loaded: Display actual data
- Empty: No orders yet state
- Error: Error message if data fails to load

INTERACTIONS:
- Click stat card: Navigate to detailed view
- Click order row: Open order details
- Click quick action: Navigate to action page
- Refresh data: Manual or auto-refresh

DATA STRUCTURE:
```typescript
interface DashboardStats {
  walletBalance: number;
  totalOrders: number;
  pendingOrders: number;
  totalEarnings: number;
}

interface RecentOrder {
  id: string;
  service: string;
  quantity: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  amount: number;
  createdAt: Date;
}

interface VendorDashboardProps {
  stats: DashboardStats;
  recentOrders: RecentOrder[];
  isLoading?: boolean;
}
```

EXAMPLE DATA:
```typescript
const stats: DashboardStats = {
  walletBalance: 1250.50,
  totalOrders: 47,
  pendingOrders: 3,
  totalEarnings: 5420.00
};

const recentOrders: RecentOrder[] = [
  {
    id: "ORD-001",
    service: "Instagram Followers - 10K",
    quantity: 10000,
    status: "completed",
    amount: 99.99,
    createdAt: new Date("2025-11-27")
  },
  {
    id: "ORD-002",
    service: "TikTok Likes - 5K",
    quantity: 5000,
    status: "processing",
    amount: 49.99,
    createdAt: new Date("2025-11-26")
  }
];
```

STYLING DETAILS:

Page Container:
- Min height: 100vh
- Background: bg-slate-900
- Padding: p-6

Header:
- Margin bottom: mb-6
- Title: "Dashboard"
- Font size: text-3xl
- Font weight: font-bold
- Color: text-slate-100

Stats Grid:
- Grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-4
- Gap: gap-4
- Margin bottom: mb-6

Stat Card:
- Background: bg-slate-800
- Border: border border-slate-700
- Border radius: rounded-xl
- Padding: p-6
- Hover: hover:bg-slate-750 (subtle)

Stat Card Content:
- Icon: Top left, w-10 h-10, colored by metric type
- Label: text-sm, text-slate-400, uppercase
- Value: text-3xl, font-bold, text-slate-100
- Trend (optional): text-sm, colored (green/red)

Icon Colors:
- Wallet: text-blue-500
- Orders: text-purple-500
- Pending: text-yellow-500
- Earnings: text-green-500

Recent Orders Section:
- Card: bg-slate-800, border-slate-700
- Padding: p-6
- Border radius: rounded-xl

Section Header:
- Display: flex, justify-between
- Title: "Recent Orders"
- Font size: text-xl
- Font weight: font-semibold
- Action link: "View All" (text-blue-400)

Orders Table:
- Width: full
- Text: text-sm

Table Header:
- Background: bg-slate-700/50
- Text: text-slate-300, uppercase, text-xs
- Padding: px-4 py-3

Table Row:
- Border bottom: border-slate-700
- Hover: bg-slate-700/30
- Padding: px-4 py-3

Status Badge:
- Pending: bg-yellow-500/10, text-yellow-500
- Processing: bg-blue-500/10, text-blue-500
- Completed: bg-green-500/10, text-green-500
- Failed: bg-red-500/10, text-red-500
- Padding: px-2 py-1
- Border radius: rounded-full
- Font size: text-xs
- Font weight: font-medium

Quick Actions:
- Grid: grid-cols-1 md:grid-cols-3
- Gap: gap-4
- Margin top: mt-6

Action Button:
- Width: full
- Height: h-12
- Background: bg-blue-600
- Hover: bg-blue-700
- Text: white
- Icon + text
- Border radius: rounded-lg

ACCESSIBILITY:
- Semantic HTML: <main>, <section>, <table>
- ARIA labels for stat cards
- Table headers properly marked
- Keyboard navigation
- Focus visible states

RESPONSIVE BEHAVIOR:
- Mobile (< 768px):
  - Stats: Single column
  - Table: Horizontal scroll
  - Actions: Stack vertically
  
- Desktop (>= 768px):
  - Stats: 4 columns
  - Table: Full width
  - Actions: 3 columns

ANIMATIONS:
- Stat cards: Fade in on load
- Hover: Subtle background transition
- Loading: Skeleton pulse animation

LOADING STATES:
- Stat cards: Skeleton rectangles
- Table: Skeleton rows
- Smooth transition to loaded state

EMPTY STATES:
- No orders: Empty state illustration
- Message: "No orders yet. Create your first order!"
- CTA: "Create Order" button

ADDITIONAL NOTES:
- Format currency properly ($1,250.50)
- Format dates relative (e.g., "2 hours ago")
- Status badges should be color-coded
- Consider adding refresh button
- Real-time updates via WebSocket (optional)
- Export data functionality (optional)
```

---

## 💾 Data Structure

```typescript
interface DashboardStats {
  walletBalance: number;
  totalOrders: number;
  pendingOrders: number;
  totalEarnings: number;
  currency?: string; // Default: 'USD'
}

interface RecentOrder {
  id: string;
  service: string;
  quantity: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  amount: number;
  createdAt: Date;
  customer?: string;
}

interface VendorDashboardProps {
  stats: DashboardStats;
  recentOrders: RecentOrder[];
  isLoading?: boolean;
  onRefresh?: () => void;
}
```

---

## 🔌 Integration Notes

### API Endpoints
```typescript
GET /api/vendor/dashboard/stats
Response: DashboardStats

GET /api/vendor/orders/recent?limit=10
Response: RecentOrder[]
```

### Dependencies
- `@/components/ui/card`, `table`, `button`, `badge`
- `lucide-react`: Icons
- `date-fns`: Date formatting
- Optional: `recharts` for charts

---

**Last Updated**: 2025-11-27  
**Status**: Specification Complete
