# Component Specification: Data Table

**Category**: Shared / Components  
**Priority**: High  
**Status**: ⏳ Pending

---

## 🤖 V0 Prompt

```
Create a reusable data table component with sorting, filtering, and pagination using Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui.

COMPONENT PURPOSE:
Flexible data table for displaying orders, transactions, users, etc. Supports sorting, filtering, pagination, and row actions.

DESIGN: Dark premium theme, table-based

KEY FEATURES:
1. Column configuration (headers, sorting, formatting)
2. Row data rendering
3. Sortable columns
4. Search/filter
5. Pagination
6. Row actions (view, edit, delete)
7. Loading and empty states
8. Responsive (horizontal scroll on mobile)

DATA STRUCTURE:
```typescript
interface Column<T> {
  key: keyof T;
  header: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onSort?: (key: keyof T, direction: 'asc' | 'desc') => void;
  onRowClick?: (row: T) => void;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
  };
  loading?: boolean;
  emptyMessage?: string;
}
```

STYLING:
- Table: w-full, text-sm
- Header: bg-slate-700/50, text-slate-300, uppercase, text-xs
- Row: border-b border-slate-700, hover:bg-slate-700/30
- Cell: px-4 py-3
- Sortable: cursor-pointer, hover effect
- Pagination: flex, justify-between, items-center

EXAMPLE USAGE:
```tsx
<DataTable
  columns={[
    { key: 'id', header: 'Order ID', sortable: true },
    { key: 'status', header: 'Status', render: (status) => <StatusBadge status={status} /> },
    { key: 'amount', header: 'Amount', render: (amount) => formatCurrency(amount) }
  ]}
  data={orders}
  pagination={{ page: 1, pageSize: 10, total: 100, onPageChange: setPage }}
  onRowClick={(order) => openOrderDetails(order)}
/>
```
```

**Status**: Specification Complete
