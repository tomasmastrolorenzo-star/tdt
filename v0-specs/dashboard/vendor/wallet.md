# Component Specification: Vendor Wallet

**Category**: Dashboard / Vendor  
**Priority**: High  
**Status**: ⏳ Pending

---

## 🤖 V0 Prompt

```
Create a vendor wallet page showing balance, transactions, and withdrawal functionality using Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui.

COMPONENT PURPOSE:
Wallet management for vendors showing total balance, pending/available amounts, transaction history, and withdrawal request functionality. Critical for financial transparency and trust.

DESIGN: Dark premium (#0f172a background, #1e293b cards, blue-600 accents)

KEY FEATURES:
1. Balance cards: Total, Pending, Available, Withdrawn
2. Withdrawal request button
3. Transaction history table with filters
4. Profit calculator (optional embedded component)

DATA STRUCTURE:
```typescript
interface WalletBalance {
  total: number;
  pending: number;
  available: number;
  withdrawn: number;
}

interface Transaction {
  id: string;
  date: Date;
  type: 'commission' | 'withdrawal' | 'refund';
  description: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
}
```

LAYOUT:
- 4 stat cards grid (balance metrics)
- Withdrawal CTA button
- Filters (date range, type)
- Transaction table with pagination
- Mobile responsive

STYLING:
- Cards: bg-slate-800, border-slate-700
- Positive amounts: text-green-500
- Negative amounts: text-red-500
- Status badges: color-coded
- Withdrawal button: bg-blue-600, prominent

INTERACTIONS:
- Click withdrawal: Open modal/form
- Filter transactions: Update table
- Paginate: Load more transactions
- Export: Download CSV (optional)
```

**Status**: Specification Complete
