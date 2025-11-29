# Component Specification: Vendor Orders Management

**Category**: Dashboard / Vendor  
**Priority**: High  
**Status**: ⏳ Pending

---

## 🤖 V0 Prompt

```
Create a vendor orders management page with table, filters, and order creation using Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui.

COMPONENT PURPOSE:
Complete orders management for vendors: view all orders, filter/search, create new orders, view order details. Main operational page for daily business.

DESIGN: Dark premium theme, data table focused

KEY FEATURES:
1. "Create Order" button (top right)
2. Search bar (order ID, customer)
3. Filters: Status, Date range, Service type
4. Orders table: ID, Service, Customer, Quantity, Status, Amount, Date, Actions
5. Pagination
6. Order details modal/drawer

DATA STRUCTURE:
```typescript
interface Order {
  id: string;
  service: string;
  customer: string;
  quantity: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  amount: number;
  commission: number;
  createdAt: Date;
  completedAt?: Date;
}
```

LAYOUT:
- Header with title + Create button
- Search and filters row
- Data table
- Pagination controls
- Modal for order details

STYLING:
- Table: bg-slate-800, striped rows
- Status badges: color-coded (yellow/blue/green/red)
- Search: bg-slate-900, border-slate-700
- Create button: bg-blue-600, prominent

INTERACTIONS:
- Click row: Open order details
- Click Create: Open order form
- Search: Real-time filter
- Filter: Update table
- Paginate: Load more orders
```

**Status**: Specification Complete
