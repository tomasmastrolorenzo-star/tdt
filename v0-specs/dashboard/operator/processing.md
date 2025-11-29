# Component Specification: Operator Processing Interface

**Category**: Dashboard / Operator  
**Priority**: Medium  
**Status**: ⏳ Pending

---

## 🤖 V0 Prompt

```
Create an operator order processing interface for managing accepted orders using Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui.

COMPONENT PURPOSE:
Interface for operators to process orders: view details, update status, add notes, mark as complete.

DESIGN: Dark premium theme, action-focused

KEY FEATURES:
1. Order details panel
2. Status update dropdown
3. Progress tracker
4. Notes/comments section
5. Complete order button
6. Customer link display

DATA STRUCTURE:
```typescript
interface ProcessingOrder {
  id: string;
  service: string;
  quantity: number;
  customerLink: string;
  status: 'processing' | 'in-progress' | 'completed';
  progress: number; // 0-100
  notes: string[];
  vendor: string;
  startedAt: Date;
}
```

LAYOUT:
- Order header with ID and service
- Customer link (copyable)
- Status selector
- Progress bar
- Notes section
- Action buttons

STYLING:
- Panel: bg-slate-800
- Status dropdown: Color-coded options
- Progress bar: Blue-600, animated
- Notes: bg-slate-900, scrollable
- Complete button: bg-green-600, prominent

INTERACTIONS:
- Update status: Dropdown selection
- Add note: Text input + Add button
- Update progress: Slider or input
- Complete order: Confirmation, then mark complete
- Copy link: Click to copy customer link
```

**Status**: Specification Complete
