# Component Specification: Admin Financial Overview

**Category**: Dashboard / Admin  
**Priority**: Low  
**Status**: ⏳ Pending

---

## 🤖 V0 Prompt

```
Create an admin financial overview page showing revenue, commissions, and transactions using Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui.

COMPONENT PURPOSE:
Financial dashboard for admins: total revenue, commission breakdown, pending payouts, transaction history.

DESIGN: Dark premium theme, financial data-focused

KEY FEATURES:
1. Financial stats cards (revenue, commissions, pending payouts)
2. Revenue breakdown chart
3. Commission distribution (vendor vs system)
4. Transaction history table
5. Export functionality

DATA STRUCTURE:
```typescript
interface FinancialData {
  totalRevenue: number;
  totalCommissions: number;
  pendingPayouts: number;
  systemProfit: number;
  revenueByMonth: Array<{ month: string; amount: number }>;
  commissionSplit: { vendors: number; system: number };
  transactions: Array<{
    id: string;
    date: Date;
    type: 'order' | 'commission' | 'payout';
    amount: number;
    user: string;
  }>;
}
```

LAYOUT:
- 4 financial stat cards
- Revenue chart (line/bar)
- Commission pie chart
- Transaction table
- Export button

STYLING:
- Stat cards: Color-coded (green for revenue, blue for commissions)
- Charts: Professional financial styling
- Amounts: Large, bold, formatted currency
- Table: Sortable columns

INTERACTIONS:
- View chart details: Hover tooltips
- Filter transactions: Date range, type
- Export: Download CSV/PDF
- Click transaction: View details
```

**Status**: Specification Complete
