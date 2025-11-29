# Component Specification: Password Recovery

**Category**: Authentication  
**Priority**: Medium  
**Status**: ⏳ Pending

---

## 🤖 V0 Prompt

```
Create a password recovery/reset page using Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui.

COMPONENT PURPOSE:
Multi-step password recovery flow: email input → verification code → new password. Dark premium aesthetic matching login/register.

DESIGN: Dark premium theme, step-by-step flow

KEY FEATURES:
1. Step 1: Email input
2. Step 2: Verification code (6 digits)
3. Step 3: New password + confirm
4. Progress indicator
5. Back to login link

DATA STRUCTURE:
```typescript
interface PasswordRecoveryProps {
  step: 1 | 2 | 3;
  onSubmitEmail: (email: string) => Promise<void>;
  onSubmitCode: (code: string) => Promise<void>;
  onSubmitPassword: (password: string) => Promise<void>;
}
```

STYLING:
- Same dark theme as login (#0f172a background)
- Card: bg-slate-800, max-width 400px
- Steps indicator: Blue-600 for active, gray for inactive
- Input fields: Same as login page
- Submit button: Blue-600

FLOW:
1. Enter email → Send code
2. Enter 6-digit code → Verify
3. Enter new password → Reset complete
4. Redirect to login

VALIDATION:
- Email: Required, valid format
- Code: Required, 6 digits
- Password: Required, min 8 chars, complexity rules
- Confirm: Must match password
```

**Status**: Specification Complete
