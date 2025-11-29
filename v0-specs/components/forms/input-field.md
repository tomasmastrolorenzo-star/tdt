# Component Specification: Reusable Input Field

**Category**: Shared / Forms  
**Priority**: Medium  
**Status**: ⏳ Pending

---

## 🤖 V0 Prompt

```
Create a reusable form input field component with label, validation, and error states using Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui.

COMPONENT PURPOSE:
Standardized input field for all forms across the application. Supports different types, validation, icons, and error messages.

DESIGN: Consistent with design system, adaptable for light/dark themes

KEY FEATURES:
1. Label (optional)
2. Input field (text, email, password, number, etc.)
3. Placeholder
4. Icon (optional, left or right)
5. Error message display
6. Helper text (optional)
7. Disabled state
8. Required indicator

DATA STRUCTURE:
```typescript
interface InputFieldProps {
  label?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel';
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  required?: boolean;
  disabled?: boolean;
}
```

STYLING:
- Label: text-sm, font-medium, mb-1
- Input: h-10, px-3, rounded-md, border
- Normal: border-slate-700, bg-slate-900 (dark) / bg-white (light)
- Focus: border-blue-500, ring-2 ring-blue-200
- Error: border-red-500, ring-red-200
- Disabled: opacity-50, cursor-not-allowed
- Error text: text-red-500, text-xs, mt-1
- Helper text: text-slate-400, text-xs, mt-1

EXAMPLE USAGE:
```tsx
<InputField
  label="Email Address"
  type="email"
  placeholder="you@example.com"
  value={email}
  onChange={setEmail}
  error={errors.email}
  required
  icon={<Mail className="w-4 h-4" />}
  iconPosition="left"
/>
```
```

**Status**: Specification Complete
