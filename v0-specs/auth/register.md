# Component Specification: Register Page

**Category**: Authentication  
**Priority**: High  
**Status**: ⏳ Pending

---

## 🎯 Overview

### Purpose
Página de registro para nuevos usuarios. Debe ser simple, clara, y guiar al usuario a crear su cuenta rápidamente para comenzar a usar la plataforma.

### Context
- Punto de entrada para nuevos usuarios
- Primer paso en el customer journey
- Debe inspirar confianza y ser fácil de completar

### Key Features
- Email/password registration
- Password confirmation
- Terms & conditions acceptance
- Optional: Role selection (vendor/operator)
- Link a login para usuarios existentes
- Dark premium aesthetic (consistente con login)
- Form validation con feedback claro

---

## 🤖 V0 Prompt

```
Create a modern registration page for a B2B SaaS platform using Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui.

COMPONENT PURPOSE:
Registration page for new users joining the TDT System platform. Should be simple, trustworthy, and guide users through account creation quickly. Target users are vendors and operators who will use the platform for business operations.

DESIGN REQUIREMENTS:
- Style: Dark premium, modern, professional, trustworthy (match login page)
- Color Scheme:
  - Background: Dark gradient (#0f172a to #1e293b)
  - Card: Dark with subtle border (#334155)
  - Primary CTA: Blue-600 (#2563eb)
  - Text: Light gray (#f1f5f9) primary, muted (#cbd5e1) secondary
  - Success: Green-500 for validation
  - Error: Red-500 for validation errors
- Typography: Inter font family
- Layout: Centered card on dark background
- Card max-width: 400px
- Responsive: Mobile-friendly

FUNCTIONAL REQUIREMENTS:
1. Email input with validation
2. Password input with strength indicator
3. Confirm password input
4. Terms & conditions checkbox
5. Optional: Role selection (Vendor/Operator)
6. Register button
7. Link to login page
8. Form validation with real-time feedback
9. Loading state during registration

COMPONENTS TO USE:
- shadcn/ui: Card, Input, Label, Button, Checkbox, Select (optional)
- Icons: lucide-react (Mail, Lock, Eye, EyeOff, UserPlus, Check, X)
- Next.js: Link, useRouter

STATES:
- Default: Empty form
- Typing: Active validation
- Error: Show field errors
- Loading: Button disabled, spinner
- Success: Brief success before redirect

INTERACTIONS:
- Type email: Validate format on blur
- Type password: Show strength indicator
- Type confirm password: Match validation
- Toggle password visibility: Eye icon
- Check terms: Enable/disable submit
- Click Register: Validate, submit, redirect
- Click Login link: Navigate to login

DATA STRUCTURE:
```typescript
interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  role?: 'vendor' | 'operator';
}

interface RegisterPageProps {
  onSubmit: (data: RegisterFormData) => Promise<void>;
  requireRole?: boolean;
}

interface ValidationErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  acceptTerms?: string;
  general?: string;
}
```

EXAMPLE DATA:
```typescript
// Validation rules
const emailValidation = {
  required: "Email is required",
  pattern: {
    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    message: "Invalid email address"
  }
};

const passwordValidation = {
  required: "Password is required",
  minLength: {
    value: 8,
    message: "Password must be at least 8 characters"
  },
  pattern: {
    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    message: "Password must contain uppercase, lowercase, and number"
  }
};
```

STYLING DETAILS:

Page Container:
- Min height: 100vh
- Background: Gradient slate-900 to slate-800
- Display: flex, center aligned
- Padding: 16px

Card:
- Max width: 400px
- Width: 100%
- Background: Slate-800
- Border: 1px slate-700
- Border radius: xl (12px)
- Padding: 32px
- Shadow: 2xl

Logo/Title:
- Text: "Create Account" or "Join TDT System"
- Font size: 2xl (24px)
- Font weight: bold
- Gradient: Blue to cyan
- Margin bottom: 8px
- Centered

Subtitle:
- Text: "Start growing your business today"
- Font size: sm
- Color: Slate-400
- Margin bottom: 24px
- Centered

Input Fields:
- Same styling as login page
- Height: 40px
- Background: Slate-900
- Border: 1px slate-700
- Focus: Blue-500
- Spacing: 16px between fields

Password Strength Indicator:
- Below password field
- Progress bar or text
- Colors: Red (weak), Yellow (medium), Green (strong)
- Font size: xs
- Margin top: 4px

Confirm Password:
- Show checkmark icon when matches
- Show X icon when doesn't match
- Real-time validation

Terms Checkbox:
- Font size: sm
- Color: Slate-300
- Link to terms: Blue-400, underline on hover
- Required field indicator

Role Selection (optional):
- Radio buttons or select dropdown
- Options: Vendor, Operator
- Clear labels
- Margin: 16px 0

Register Button:
- Width: Full
- Height: 40px
- Background: Blue-600
- Hover: Blue-700
- Text: White, font-medium
- Icon: UserPlus (optional)
- Loading: Spinner
- Disabled: Opacity 50% when terms not accepted

Login Link:
- Text: "Already have an account? Sign in"
- Font size: sm
- Color: Slate-400
- Link: Blue-400, hover blue-300
- Centered
- Margin top: 24px

Error Messages:
- Background: Red-900/20
- Border: 1px red-800
- Text: Red-400
- Padding: 12px
- Border radius: md
- Font size: sm
- Icon: X circle

Success Message:
- Background: Green-900/20
- Border: 1px green-800
- Text: Green-400
- Icon: Check circle

ACCESSIBILITY:
- Semantic HTML: <form>
- Labels for all inputs
- ARIA descriptions for errors
- Focus visible states
- Keyboard navigation
- Screen reader announcements

RESPONSIVE BEHAVIOR:
- Mobile: Full width, 24px padding
- Desktop: 400px width, centered

ANIMATIONS:
- Input focus: Border transition 200ms
- Button hover: Background transition 200ms
- Error/success: Fade in 200ms
- Password strength: Width transition

VALIDATION:
- Email: Required, valid format
- Password: Required, min 8 chars, complexity rules
- Confirm: Required, must match password
- Terms: Required, must be checked
- Real-time validation on blur
- Submit validation before API call

ADDITIONAL NOTES:
- Use React Hook Form for management
- Show password strength in real-time
- Confirm password must match exactly
- Terms checkbox must be checked to enable submit
- Redirect to onboarding or dashboard after success
- Handle duplicate email errors from API
- Consider email verification flow
```

---

## 💾 Data Structure

```typescript
interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  role?: 'vendor' | 'operator';
}

interface RegisterPageProps {
  onSubmit: (data: RegisterFormData) => Promise<{ success: boolean; error?: string }>;
  requireRole?: boolean;
  termsUrl?: string;
  privacyUrl?: string;
}
```

---

**Last Updated**: 2025-11-27  
**Status**: Specification Complete
