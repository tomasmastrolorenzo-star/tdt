# Component Specification: Header / Navigation

**Category**: Landing / Shared  
**Priority**: High  
**Status**: ✅ Complete (Base version exists)

---

## 🎯 Overview

### Purpose
Navegación principal del sitio con branding, links a secciones, y acceso al dashboard. Debe ser sticky para mantener accesibilidad constante y reforzar el branding en todo momento.

### Context
- Ubicación: Top de todas las páginas públicas
- Sticky positioning (siempre visible)
- Primera interacción de navegación del usuario

### Key Features
- Logo Trend Up con gradiente distintivo
- Navigation links a secciones principales
- Dashboard CTA button
- Sticky con backdrop blur
- Responsive (hamburger menu en mobile)

---

## 🤖 V0 Prompt

```
Create a sticky header/navigation component for a social media growth service using Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui.

COMPONENT PURPOSE:
Main navigation header for "Trend Up" landing page. Provides branding, navigation to key sections, and quick access to dashboard. Must remain visible while scrolling (sticky) with a modern glassmorphism effect.

DESIGN REQUIREMENTS:
- Style: Clean, modern, glassmorphism (frosted glass effect)
- Color Scheme:
  - Background: White with 80% opacity + backdrop blur
  - Logo gradient: Yellow (#fbbf24) to Orange (#f97316)
  - Text: Gray-600 default, Black on hover
  - CTA: Blue-600 (#2563eb)
- Typography: Inter font family, medium weight for links
- Layout: Horizontal flex, space-between alignment
- Height: 64px (h-16)
- Responsive: Full navigation on desktop, hamburger menu on mobile

FUNCTIONAL REQUIREMENTS:
1. Display logo with gradient text effect
2. Show navigation links (INSTAGRAM SERVICES, TIKTOK SERVICES, FAQ, CONTACT)
3. Dashboard CTA button with icon
4. Sticky positioning at top of viewport
5. Backdrop blur effect when scrolling
6. Mobile: Collapse to hamburger menu (< 768px)

COMPONENTS TO USE:
- shadcn/ui: Button
- Icons: lucide-react (LayoutDashboard, Menu, X)
- Next.js: Link

STATES:
- Default: Transparent background with blur
- Scrolled: Maintains sticky position
- Mobile: Hamburger menu collapsed/expanded
- Hover: Links change color, button changes shade

INTERACTIONS:
- Click logo: Navigate to home (/)
- Click nav link: Smooth scroll to section or navigate to page
- Click Dashboard: Navigate to /dashboard
- Mobile: Click hamburger to toggle menu
- Hover links: Color transition
- Hover button: Background color transition

DATA STRUCTURE:
```typescript
interface NavLink {
  label: string;
  href: string;
  external?: boolean;
}

interface HeaderProps {
  logo: {
    text: string;
    href: string;
  };
  navLinks: NavLink[];
  ctaButton: {
    text: string;
    href: string;
    icon?: React.ReactNode;
  };
}
```

EXAMPLE DATA:
```typescript
const headerData: HeaderProps = {
  logo: {
    text: "Trend Up",
    href: "/"
  },
  navLinks: [
    { label: "INSTAGRAM SERVICES", href: "#instagram" },
    { label: "TIKTOK SERVICES", href: "#tiktok" },
    { label: "FAQ", href: "#faq" },
    { label: "CONTACT", href: "#contact" }
  ],
  ctaButton: {
    text: "DASHBOARD",
    href: "/dashboard",
    icon: <LayoutDashboard className="w-4 h-4" />
  }
}
```

STYLING DETAILS:

Header Container:
- Position: sticky, top: 0
- Z-index: 50
- Width: 100%
- Border bottom: 1px solid gray-200
- Background: white with 80% opacity (bg-white/80)
- Backdrop filter: blur(12px)

Inner Container:
- Max width: container
- Padding: 0 16px
- Height: 64px (h-16)
- Display: flex
- Align items: center
- Justify: space-between

Logo:
- Font size: 2xl (24px)
- Font weight: bold (700)
- Gradient: from-yellow-500 to-orange-500
- Background clip: text
- Text transparent
- Cursor: pointer
- Transition: opacity 200ms

Navigation (Desktop):
- Display: hidden on mobile, flex on md+
- Gap: 24px (gap-6)
- Font size: sm (14px)
- Font weight: medium (500)
- Color: Gray-600
- Text transform: uppercase

Nav Links:
- Color: Gray-600 default
- Hover: Black
- Transition: colors 200ms
- Cursor: pointer

CTA Button:
- Background: Blue-600
- Hover: Blue-700
- Text: White
- Gap: 8px (for icon + text)
- Padding: 8px 16px
- Border radius: 6px
- Font weight: medium
- Transition: background 200ms

Mobile Menu (< 768px):
- Hamburger icon: Menu (lucide-react)
- Position: absolute or fixed
- Full width dropdown
- Background: White
- Shadow: lg
- Padding: 16px
- Links stacked vertically
- Close icon: X (lucide-react)

ACCESSIBILITY:
- Semantic HTML: <header>, <nav>
- ARIA labels for hamburger button
- Keyboard navigation (tab through links)
- Focus visible states
- Skip to content link (optional)
- Logo has alt text or aria-label

RESPONSIVE BEHAVIOR:
- Mobile (< 768px):
  - Hide navigation links
  - Show hamburger menu icon
  - Logo remains visible
  - CTA button remains visible (smaller)
  
- Tablet/Desktop (>= 768px):
  - Show full navigation
  - Hide hamburger icon
  - Full-size CTA button

ANIMATIONS:
- Link hover: Color transition 200ms
- Button hover: Background transition 200ms
- Mobile menu: Slide down animation 300ms
- Logo hover: Opacity 80%

ADDITIONAL NOTES:
- Use Next.js Link for all navigation (client-side routing)
- Implement smooth scroll for anchor links
- Backdrop blur may need vendor prefixes for Safari
- Consider adding active state for current section
- Mobile menu should close on link click
- Ensure z-index is high enough to stay above content
```

---

## 📐 Functional Requirements

### Core Functionality
1. **Branding Display**
   - Logo with gradient text
   - Links to home page
   - Consistent across all pages

2. **Navigation Links**
   - 4 main navigation items
   - Smooth scroll to sections
   - Hover states

3. **Dashboard Access**
   - Prominent CTA button
   - Icon + text
   - Direct link to dashboard

4. **Sticky Behavior**
   - Remains at top while scrolling
   - Glassmorphism effect
   - High z-index

5. **Mobile Responsiveness**
   - Hamburger menu on small screens
   - Collapsible navigation
   - Touch-friendly targets

### User Interactions
- **Click logo**: Navigate to home
- **Click nav link**: Scroll to section or navigate
- **Click Dashboard**: Go to dashboard
- **Mobile hamburger**: Toggle menu open/close
- **Hover links**: Visual feedback

### State Management
- **Mobile menu state**: Open/closed (local state)
- **Scroll position**: Optional for background opacity
- **Active section**: Optional for highlighting current section

---

## 🎨 Design Specifications

### Layout Structure
```
┌─────────────────────────────────────────┐
│ [Logo]  [Nav Links...]      [Dashboard]│
│                                         │
└─────────────────────────────────────────┘

Mobile:
┌─────────────────────────────────────────┐
│ [Logo]                  [☰] [Dashboard] │
└─────────────────────────────────────────┘
  ┌─────────────────────────┐
  │ [Nav Link 1]            │
  │ [Nav Link 2]            │
  │ [Nav Link 3]            │
  │ [Nav Link 4]            │
  └─────────────────────────┘
```

### Visual Design
- **Background**: rgba(255, 255, 255, 0.8) + blur(12px)
- **Border**: 1px solid #e5e7eb (bottom)
- **Height**: 64px
- **Padding**: 0 16px

**Logo**:
- Gradient: linear-gradient(135deg, #fbbf24, #f97316)
- Font size: 24px
- Font weight: 700

**Nav Links**:
- Color: #6b7280 → #000000 (hover)
- Font size: 14px
- Font weight: 500
- Text transform: uppercase
- Spacing: 24px gap

**CTA Button**:
- Background: #2563eb → #1d4ed8 (hover)
- Text: #ffffff
- Padding: 8px 16px
- Border radius: 6px
- Icon size: 16px

### Responsive Breakpoints
| Breakpoint | Logo | Nav Links | Hamburger | CTA |
|------------|------|-----------|-----------|-----|
| Mobile (<768px) | Visible | Hidden | Visible | Visible (compact) |
| Desktop (>=768px) | Visible | Visible | Hidden | Visible (full) |

### Animations & Transitions
- **Links**: color 200ms ease-in-out
- **Button**: background-color 200ms ease-in-out
- **Mobile menu**: transform 300ms ease-out

---

## 💾 Data Structure

### TypeScript Interfaces
```typescript
interface NavLink {
  label: string;
  href: string;
  external?: boolean;
}

interface HeaderProps {
  logo?: {
    text: string;
    href: string;
  };
  navLinks?: NavLink[];
  ctaButton?: {
    text: string;
    href: string;
    icon?: React.ReactNode;
  };
}
```

### Example Data
```typescript
const defaultHeader: HeaderProps = {
  logo: {
    text: "Trend Up",
    href: "/"
  },
  navLinks: [
    { label: "INSTAGRAM SERVICES", href: "#instagram" },
    { label: "TIKTOK SERVICES", href: "#tiktok" },
    { label: "FAQ", href: "#faq" },
    { label: "CONTACT", href: "#contact" }
  ],
  ctaButton: {
    text: "DASHBOARD",
    href: "/dashboard"
  }
}
```

---

## 🔌 Integration Notes

### Dependencies
- `@/components/ui/button`: Button component
- `lucide-react`: LayoutDashboard, Menu, X icons
- `next/link`: Link component

### Parent Components
- Used in: All public pages (layout.tsx or individual pages)
- Position: First child of <body> or <main>

---

## ✅ Acceptance Criteria

- [x] Header sticks to top while scrolling
- [x] Backdrop blur effect works
- [x] Navigation links functional
- [x] Dashboard button navigates correctly
- [x] Mobile menu toggles properly
- [x] Hover states work smoothly
- [x] Meets accessibility standards
- [x] Responsive on all screen sizes

---

## 🔄 Variations

### Variant 1: Transparent on Top
Header is fully transparent at top, gains background on scroll
```typescript
const [scrolled, setScrolled] = useState(false);
// Add scroll listener
```

### Variant 2: Multi-level Navigation
Dropdown menus for services
```tsx
<DropdownMenu>
  <DropdownMenuTrigger>Services</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Instagram</DropdownMenuItem>
    <DropdownMenuItem>TikTok</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

---

## 📝 Implementation Notes

### V0 Generation Tips
1. Specify exact backdrop-filter syntax
2. Request mobile menu state management
3. Mention smooth scroll behavior
4. Include icon imports

### Common Pitfalls
- **Backdrop blur not working**: Check browser support, add fallback
- **Sticky not working**: Ensure no parent has overflow:hidden
- **Mobile menu not closing**: Add click handlers to links
- **Z-index issues**: Set high enough value (50+)

---

## 📚 References

- Current implementation: `components/landing/header.tsx`
- Design system: `v0-specs/design-system.md`

---

**Last Updated**: 2025-11-27  
**Author**: TDT Platform Team  
**Status**: Production Ready
