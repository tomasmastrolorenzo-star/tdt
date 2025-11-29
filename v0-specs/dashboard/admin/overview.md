# Component Specification: Admin Dashboard Overview

**Category**: Dashboard / Admin  
**Priority**: Low  
**Status**: ⏳ Pending

---

## 🤖 V0 Prompt

```
Create an admin dashboard overview showing system-wide metrics and activity using Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui.

COMPONENT PURPOSE:
High-level system overview for administrators: user stats, financial metrics, system health, recent activity.

DESIGN: Dark premium theme, metrics-heavy

KEY FEATURES:
1. System stats cards (users, orders, revenue, active operators)
2. Charts: Revenue over time, orders by platform
3. Recent activity feed
4. Quick actions (manage users, view reports)

DATA STRUCTURE:
```typescript
interface AdminStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  activeOperators: number;
  revenueData: Array<{ date: string; amount: number }>;
  ordersByPlatform: { instagram: number; tiktok: number };
}
```

LAYOUT:
- 4 stat cards grid
- 2 charts (revenue line chart, platform pie chart)
- Activity feed sidebar
- Quick actions buttons

STYLING:
- Same dark theme as other dashboards
- Charts: Blue-600 primary color
- Activity feed: bg-slate-800, scrollable
- Stat cards: Color-coded icons

INTERACTIONS:
- Click stat card: Navigate to detailed view
- Hover chart: Show tooltips
- Click activity item: View details
- Quick actions: Navigate to admin pages
```

**Status**: Specification Complete
