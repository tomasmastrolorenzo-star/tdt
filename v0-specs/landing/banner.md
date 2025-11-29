# Component Specification: Announcement Banner

**Category**: Landing / Shared  
**Priority**: Low  
**Status**: ✅ Complete (Base version exists)

---

## 🎯 Overview

### Purpose
Banner de anuncios promocionales en la parte superior de la página para comunicar ofertas urgentes, ventas especiales, o mensajes importantes.

### Context
- Ubicación: Muy top de la página, antes del header
- Opcional/removible según campañas activas
- Crea urgencia y atrae atención inmediata

### Key Features
- Mensaje promocional centrado
- Iconos decorativos (flame icons)
- Background negro con texto blanco (alto contraste)
- Opcional: Botón de cierre (dismissible)
- Responsive text sizing

---

## 🤖 V0 Prompt

```
Create a promotional announcement banner component for a landing page using Next.js 14, TypeScript, Tailwind CSS, and lucide-react icons.

COMPONENT PURPOSE:
Top banner to announce time-sensitive promotions, sales, or important messages. Should grab immediate attention with high contrast and urgency indicators (fire emojis/icons).

DESIGN REQUIREMENTS:
- Style: Bold, high contrast, urgent
- Color Scheme:
  - Background: Black (#000000)
  - Text: White (#ffffff)
  - Accent: Yellow-500 (#eab308) for icons
- Typography: Inter font, bold weight, uppercase
- Layout: Full width, centered content, horizontal flex
- Height: Auto (py-2)
- Responsive: Smaller text on mobile

FUNCTIONAL REQUIREMENTS:
1. Display promotional message
2. Show flame icons on both sides
3. Optional: Close/dismiss button
4. Responsive text sizing
5. Full width across viewport

COMPONENTS TO USE:
- Icons: lucide-react (Flame, X for close button)
- No shadcn components needed (simple div)

STATES:
- Visible: Default state
- Dismissed: Hidden (if dismissible)

INTERACTIONS:
- Optional: Click X to dismiss
- Optional: Store dismissed state in localStorage

DATA STRUCTURE:
```typescript
interface BannerProps {
  message: string;
  dismissible?: boolean;
  icon?: 'flame' | 'star' | 'zap';
}
```

EXAMPLE DATA:
```typescript
const bannerData: BannerProps = {
  message: "BLACK FRIDAY SALE | 50% OFF ALL SERVICES",
  dismissible: false,
  icon: 'flame'
}
```

STYLING DETAILS:
- Background: bg-black
- Text: text-white
- Padding: py-2 (8px vertical)
- Display: flex, justify-center, items-center
- Gap: gap-2 (8px between elements)
- Font size: text-xs (mobile), text-sm (desktop)
- Font weight: font-bold
- Letter spacing: tracking-wider
- Icons: w-4 h-4, text-yellow-500, fill-yellow-500

ACCESSIBILITY:
- Semantic HTML: <div> with role="banner" or <aside>
- ARIA label if dismissible
- Keyboard accessible close button
- High contrast (WCAG AAA)

RESPONSIVE BEHAVIOR:
- Mobile: text-xs, compact padding
- Desktop: text-sm, normal padding

ANIMATIONS:
- Optional: Slide down on mount
- Optional: Fade out on dismiss

ADDITIONAL NOTES:
- Keep message concise (max 60 characters)
- Use uppercase for emphasis
- Icons should be decorative (aria-hidden)
- Consider adding pulse animation to icons
```

---

## 💾 Data Structure

```typescript
interface BannerProps {
  message: string;
  dismissible?: boolean;
  icon?: 'flame' | 'star' | 'zap';
  onDismiss?: () => void;
}
```

---

**Last Updated**: 2025-11-27  
**Status**: Production Ready
