# Component Specification: Confirmation Modal

**Category**: Shared / Modals  
**Priority**: Medium  
**Status**: ⏳ Pending

---

## 🤖 V0 Prompt

```
Create a reusable confirmation dialog/modal component using Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui.

COMPONENT PURPOSE:
Standard confirmation modal for destructive or important actions (delete, suspend, etc.). Prevents accidental actions.

DESIGN: Clean modal, clear action buttons

KEY FEATURES:
1. Title
2. Description/message
3. Confirm button (customizable color/text)
4. Cancel button
5. Optional icon
6. Keyboard support (ESC to cancel, Enter to confirm)

DATA STRUCTURE:
```typescript
interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  icon?: React.ReactNode;
}
```

STYLING:
- Overlay: bg-black/50, backdrop-blur
- Modal: bg-slate-800 (dark) / bg-white (light)
- Max width: 400px
- Padding: p-6
- Border radius: rounded-xl
- Title: text-lg, font-semibold
- Message: text-sm, text-slate-400
- Buttons: Full width on mobile, inline on desktop
- Confirm (danger): bg-red-600
- Confirm (warning): bg-yellow-600
- Confirm (info): bg-blue-600
- Cancel: bg-slate-700

INTERACTIONS:
- Click Confirm: Execute action, close modal
- Click Cancel: Close modal without action
- Click overlay: Close modal (optional)
- Press ESC: Close modal
- Press Enter: Confirm action

EXAMPLE USAGE:
```tsx
<ConfirmationModal
  isOpen={showDeleteModal}
  onClose={() => setShowDeleteModal(false)}
  onConfirm={handleDelete}
  title="Delete Order"
  message="Are you sure you want to delete this order? This action cannot be undone."
  confirmText="Delete"
  cancelText="Cancel"
  variant="danger"
  icon={<Trash className="w-6 h-6" />}
/>
```
```

**Status**: Specification Complete
