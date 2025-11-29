# Component Specification: Login Page

**Category**: Authentication  
**Priority**: High  
**Status**: ⏳ Pending

---

## 🎯 Overview

### Purpose
Página de autenticación para usuarios existentes. Debe ser segura, profesional, y ofrecer una experiencia fluida de inicio de sesión con opciones de recuperación de contraseña.

### Context
- Punto de entrada para usuarios registrados
- Acceso al dashboard según rol (vendor, operator, admin)
- Primera impresión de la plataforma TDT System

### Key Features
- Email/password authentication
- "Remember me" checkbox
- Password recovery link
- Social login options (Google, opcional)
- Link a registro para nuevos usuarios
- Dark premium aesthetic
- Form validation con feedback claro

---

## 🤖 V0 Prompt

```
Create a modern login page for a B2B SaaS platform using Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui.

COMPONENT PURPOSE:
Authentication page for the TDT System platform. Users (vendors, operators, admins) log in to access their dashboards. The design should feel premium, trustworthy, and professional - this is a B2B platform handling financial transactions and business operations.

DESIGN REQUIREMENTS:
- Style: Dark premium, modern, professional, trustworthy
- Color Scheme:
  - Background: Dark gradient (#0f172a to #1e293b)
  - Card: Dark with subtle border (#334155)
  - Primary CTA: Blue-600 (#2563eb)
  - Text: Light gray (#f1f5f9) primary, muted (#cbd5e1) secondary
  - Accents: Blue for links and focus states
- Typography: Inter font family
- Layout: Centered card on dark background
- Card max-width: 400px
- Responsive: Mobile-friendly, full-width on small screens

FUNCTIONAL REQUIREMENTS:
1. Email input field with validation
2. Password input field with show/hide toggle
3. "Remember me" checkbox
4. "Forgot password?" link
5. Primary login button
6. Optional: Social login buttons (Google)
7. Link to register page for new users
8. Form validation with error messages
9. Loading state during authentication

COMPONENTS TO USE:
- shadcn/ui: Card, Input, Label, Button, Checkbox
- Icons: lucide-react (Mail, Lock, Eye, EyeOff, LogIn)
- Next.js: Link, useRouter (for navigation after login)

STATES:
- Default: Empty form, all fields ready for input
- Typing: Active field highlighted, validation on blur
- Error: Invalid credentials, show error message
- Loading: Button disabled, loading spinner
- Success: Brief success state before redirect

INTERACTIONS:
- Type email: Validate format on blur
- Type password: Show/hide toggle
- Click "Remember me": Toggle checkbox
- Click "Forgot password": Navigate to recovery page
- Click "Login": Validate form, submit, show loading
- Click "Register": Navigate to register page
- Social login: OAuth flow (optional)

DATA STRUCTURE:
```typescript
interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface LoginPageProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  socialLoginEnabled?: boolean;
}

interface LoginError {
  field?: 'email' | 'password' | 'general';
  message: string;
}
```

EXAMPLE DATA:
```typescript
// Form validation
const emailValidation = {
  required: "Email is required",
  pattern: {
    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    message: "Invalid email address"
  }
}

const passwordValidation = {
  required: "Password is required",
  minLength: {
    value: 8,
    message: "Password must be at least 8 characters"
  }
}

// Error examples
const errors: LoginError[] = [
  { field: 'email', message: 'Invalid email format' },
  { field: 'password', message: 'Password is required' },
  { field: 'general', message: 'Invalid credentials' }
]
```

STYLING DETAILS:

Page Container:
- Min height: 100vh
- Background: Gradient from slate-900 to slate-800
- Display: flex, center aligned
- Padding: 16px

Card Container:
- Max width: 400px
- Width: 100%
- Background: Slate-800 (#1e293b)
- Border: 1px solid slate-700
- Border radius: xl (12px)
- Padding: 32px
- Shadow: 2xl

Logo/Branding:
- Centered at top of card
- Text: "TDT System" or logo image
- Font size: 2xl (24px)
- Font weight: bold
- Gradient text: Blue to cyan
- Margin bottom: 24px

Form Title:
- Text: "Welcome Back"
- Font size: xl (20px)
- Font weight: semibold
- Color: Slate-100
- Margin bottom: 8px

Form Subtitle:
- Text: "Sign in to your account"
- Font size: sm (14px)
- Color: Slate-400
- Margin bottom: 24px

Input Fields:
- Label: Text-sm, slate-200, font-medium
- Input: 
  - Height: 40px
  - Background: Slate-900
  - Border: 1px slate-700
  - Focus: Border blue-500, ring blue-500
  - Text: Slate-100
  - Placeholder: Slate-500
  - Border radius: md (6px)
- Spacing: 16px between fields

Password Field:
- Position: relative
- Show/hide button: Absolute right, center vertically
- Icon: Eye/EyeOff, slate-400, hover slate-200

Remember Me & Forgot Password:
- Display: flex, space-between
- Align items: center
- Margin: 16px 0

Checkbox:
- Size: 16px
- Border: Slate-600
- Checked: Blue-600
- Label: text-sm, slate-300

Forgot Password Link:
- Font size: sm
- Color: Blue-400
- Hover: Blue-300
- Underline on hover

Login Button:
- Width: Full
- Height: 40px
- Background: Blue-600
- Hover: Blue-700
- Text: White, font-medium
- Border radius: md
- Icon: LogIn (optional)
- Loading: Spinner replaces icon
- Disabled: Opacity 50%, cursor not-allowed

Divider (if social login):
- Text: "Or continue with"
- Line: Slate-700
- Text: Slate-400, text-sm
- Margin: 24px 0

Social Login Buttons:
- Width: Full
- Height: 40px
- Background: Transparent
- Border: 1px slate-700
- Hover: Slate-700 background
- Text: Slate-200
- Icon: Brand icon (Google, etc.)
- Gap: 8px

Register Link:
- Text: "Don't have an account? Sign up"
- Font size: sm
- Color: Slate-400
- Link: Blue-400, hover blue-300
- Centered
- Margin top: 24px

Error Message:
- Background: Red-900/20
- Border: 1px red-800
- Text: Red-400
- Padding: 12px
- Border radius: md
- Font size: sm
- Margin bottom: 16px

ACCESSIBILITY:
- Semantic HTML: <form>, <label>, <input>
- ARIA labels for all inputs
- Error messages linked to inputs (aria-describedby)
- Focus visible states
- Keyboard navigation (tab order)
- Screen reader friendly error announcements
- Password visibility toggle accessible

RESPONSIVE BEHAVIOR:
- Mobile (< 640px):
  - Card: Full width with 16px margin
  - Padding: 24px
  - Font sizes slightly smaller
  
- Desktop (>= 640px):
  - Card: Fixed 400px width
  - Centered in viewport
  - Full padding and font sizes

ANIMATIONS:
- Input focus: Border color transition 200ms
- Button hover: Background transition 200ms
- Error message: Fade in 200ms
- Loading spinner: Rotate animation
- Success: Brief checkmark animation before redirect

VALIDATION:
- Email: Required, valid email format
- Password: Required, minimum 8 characters
- Real-time validation on blur
- Submit validation before API call
- Clear, specific error messages

ADDITIONAL NOTES:
- Use React Hook Form or similar for form management
- Implement client-side validation before API call
- Show loading state during authentication
- Handle API errors gracefully
- Redirect to dashboard on success based on user role
- Store auth token securely (httpOnly cookie preferred)
- Implement CSRF protection
- Rate limiting on failed attempts (backend)
```

---

## 📐 Functional Requirements

### Core Functionality
1. **Email/Password Authentication**
   - Validate email format
   - Validate password requirements
   - Submit credentials to API
   - Handle success/error responses

2. **Remember Me**
   - Optional persistent session
   - Longer token expiry
   - Stored preference

3. **Password Recovery**
   - Link to forgot password flow
   - Clear, accessible

4. **Social Login** (Optional)
   - Google OAuth
   - Other providers as needed

5. **Registration Link**
   - Clear path for new users
   - Prominent placement

### User Interactions
- **Type in fields**: Real-time validation feedback
- **Toggle password visibility**: Eye icon click
- **Submit form**: Validate, show loading, redirect
- **Click forgot password**: Navigate to recovery
- **Click register**: Navigate to sign up

### State Management
- **Form data**: Email, password, rememberMe
- **Validation errors**: Per-field and general
- **Loading state**: During API call
- **Auth state**: Success/failure

---

## 🎨 Design Specifications

### Layout Structure
```
┌─────────────────────────────────────────┐
│                                         │
│         ┌─────────────────┐             │
│         │   TDT System    │             │
│         │                 │             │
│         │ Welcome Back    │             │
│         │ Sign in to...   │             │
│         │                 │             │
│         │ [Email]         │             │
│         │ [Password] 👁   │             │
│         │                 │             │
│         │ ☑ Remember  Forgot? │         │
│         │                 │             │
│         │ [LOGIN BUTTON]  │             │
│         │                 │             │
│         │ ─── Or ───      │             │
│         │ [Google Login]  │             │
│         │                 │             │
│         │ No account? Sign up │         │
│         └─────────────────┘             │
│                                         │
└─────────────────────────────────────────┘
```

### Visual Design
- **Background**: Dark gradient (#0f172a → #1e293b)
- **Card**: #1e293b, border #475569
- **Inputs**: #0f172a background, #475569 border
- **Primary button**: #2563eb → #1d4ed8 (hover)
- **Text**: #f1f5f9 (primary), #cbd5e1 (secondary)

---

## 💾 Data Structure

### TypeScript Interfaces
```typescript
interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface LoginPageProps {
  onSubmit: (data: LoginFormData) => Promise<{ success: boolean; error?: string }>;
  socialLoginEnabled?: boolean;
}

interface ValidationErrors {
  email?: string;
  password?: string;
  general?: string;
}
```

---

## 🔌 Integration Notes

### API Endpoints
```typescript
POST /api/auth/login
Body: { email: string, password: string, rememberMe: boolean }
Response: { token: string, user: User } | { error: string }
```

### Dependencies
- `@/components/ui/card`, `input`, `label`, `button`, `checkbox`
- `lucide-react`: Mail, Lock, Eye, EyeOff, LogIn
- `next/link`, `next/navigation`
- Form library: react-hook-form (recommended)

---

## ✅ Acceptance Criteria

- [ ] Form validates email and password
- [ ] Password visibility toggle works
- [ ] Remember me checkbox functional
- [ ] Forgot password link navigates correctly
- [ ] Login button submits form
- [ ] Loading state displays during auth
- [ ] Error messages display clearly
- [ ] Success redirects to appropriate dashboard
- [ ] Meets WCAG 2.1 AA standards
- [ ] Responsive on all devices

---

## 📚 References

- Current implementation: `app/(auth)/login/page.tsx`
- Design system: `v0-specs/design-system.md`

---

**Last Updated**: 2025-11-27  
**Author**: TDT Platform Team  
**Status**: Specification Complete
