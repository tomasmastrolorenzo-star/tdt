# Component Specification: Operator Queue

**Category**: Dashboard / Operator  
**Priority**: High  
**Status**: ⏳ Pending

---

## 🤖 V0 Prompt

```
Create an operator order queue page for processing orders using Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui.

COMPONENT PURPOSE:
Order queue for operators showing pending orders that need processing. Operators accept orders, process them, and mark as complete. Critical for operations workflow.

DESIGN: Dark premium theme, action-focused

KEY FEATURES:
1. Pending orders list/table
2. Priority sorting (urgent first)
3. Quick actions: Accept, Reject, View Details
4. Order details panel
5. Status update functionality
6. Real-time updates (optional)

DATA STRUCTURE:
```typescript
interface QueueOrder {
  id: string;
  service: string;
  quantity: number;
  customerLink: string;
  notes?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: Date;
  vendor: string;
}
```

LAYOUT:
- Header with queue count
- Priority filter tabs
- Order cards/rows
- Action buttons per order
- Details panel (slide-in or modal)

STYLING:
- Priority indicators: color-coded borders
- Urgent: red border, pulse animation
- Cards: bg-slate-800
- Accept button: bg-green-600
- Reject button: bg-red-600

INTERACTIONS:
- Click Accept: Assign to operator, move to processing
- Click Reject: Remove from queue, notify vendor
- Click order: Open details panel
- Auto-refresh: Every 30s
```

**Status**: Specification Complete
