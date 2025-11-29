# Component Specification: Vendor Profile Settings

**Category**: Dashboard / Vendor  
**Priority**: Medium  
**Status**: ⏳ Pending

---

## 🤖 V0 Prompt

```
Create a vendor profile settings page using Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui.

COMPONENT PURPOSE:
Allow vendors to update their profile information, change password, and manage account settings.

DESIGN: Dark premium theme, form-based

KEY FEATURES:
1. Profile information form (name, email, phone)
2. Password change section
3. Notification preferences
4. Account deletion option
5. Save changes button

DATA STRUCTURE:
```typescript
interface ProfileData {
  name: string;
  email: string;
  phone?: string;
  notifications: {
    email: boolean;
    orderUpdates: boolean;
    marketing: boolean;
  };
}
```

LAYOUT:
- Sections: Profile Info, Security, Notifications, Danger Zone
- Each section in separate card
- Form fields with labels
- Save button per section

STYLING:
- Cards: bg-slate-800, border-slate-700
- Inputs: bg-slate-900, border-slate-700
- Save button: bg-blue-600
- Delete button: bg-red-600 (danger zone)
- Toggle switches: For notifications

INTERACTIONS:
- Edit fields: Real-time validation
- Click Save: Update profile
- Change password: Verify old password first
- Delete account: Confirmation modal
```

**Status**: Specification Complete
