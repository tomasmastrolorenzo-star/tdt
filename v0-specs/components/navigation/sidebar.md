# Component Specification: Dashboard Sidebar Navigation

**Category**: Shared / Navigation  
**Priority**: High  
**Status**: ⏳ Pending

---

## 🤖 V0 Prompt

```
Create a dashboard sidebar navigation component using Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui.

COMPONENT PURPOSE:
Main navigation sidebar for dashboard pages. Shows menu items, active state, user profile, and logout. Collapsible on mobile.

DESIGN: Dark premium theme, vertical sidebar

KEY FEATURES:
1. Logo/branding at top
2. Navigation menu items with icons
3. Active state highlighting
4. User profile section at bottom
5. Logout button
6. Collapsible on mobile (hamburger)
7. Role-based menu items

DATA STRUCTURE:
```typescript
interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
  roles?: ('vendor' | 'operator' | 'admin')[];
}

interface SidebarProps {
  user: {
    name: string;
    email: string;
    role: 'vendor' | 'operator' | 'admin';
    avatar?: string;
  };
  navItems: NavItem[];
}
```

LAYOUT:
- Fixed left sidebar (desktop)
- Slide-in overlay (mobile)
- Logo at top
- Nav items in middle
- User profile at bottom

STYLING:
- Background: bg-slate-900
- Border right: border-slate-800
- Active item: bg-slate-800, blue-500 border-left
- Hover: bg-slate-800/50
- Icons: text-slate-400, active: text-blue-500
- Width: 256px (desktop), full (mobile)

INTERACTIONS:
- Click nav item: Navigate, highlight active
- Click user profile: Dropdown menu (optional)
- Click logout: Confirm and logout
- Mobile: Toggle sidebar open/close
```

**Status**: Specification Complete
