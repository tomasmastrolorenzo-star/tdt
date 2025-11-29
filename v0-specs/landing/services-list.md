# Component Specification: Services List

**Category**: Landing  
**Priority**: Medium  
**Status**: ✅ Complete (Base version exists)

---

## 🎯 Overview

### Purpose
Lista de servicios disponibles organizados por plataforma (Instagram y TikTok), cada uno como un card clickeable que lleva a la página de compra específica.

### Context
- Ubicación: Después de Features, antes de Pricing
- Permite navegación directa a servicios específicos
- Agrupa servicios por plataforma

### Key Features
- 6 service cards (3 Instagram, 3 TikTok)
- Gradientes distintos por plataforma
- Iconos específicos por tipo de servicio
- Hover effects (scale + arrow animation)
- Links directos a páginas de servicio

---

## 🤖 V0 Prompt

```
Create a services list component displaying Instagram and TikTok services as clickable cards using Next.js 14, TypeScript, Tailwind CSS, and lucide-react.

COMPONENT PURPOSE:
Display available services organized by platform (Instagram and TikTok). Each service is a clickable card that navigates to the specific service purchase page. Services include: Followers, Likes, and Video Views for each platform.

DESIGN REQUIREMENTS:
- Style: Vibrant, card-based, gradient backgrounds
- Color Scheme:
  - Instagram services: Purple to Orange gradient (#9333ea to #f97316)
  - TikTok services: Pink to Cyan gradient (#ec4899 to #06b6d4)
  - Background: Gray-50 (#f9fafb)
  - Text: White on gradient cards
- Typography: Inter font, bold for service names
- Layout: Vertical list, max-width 2xl, centered
- Card elevation: Shadow with hover enhancement

FUNCTIONAL REQUIREMENTS:
1. Display 6 service cards (3 Instagram + 3 TikTok)
2. Each card shows:
   - Platform icon
   - Service name
   - Arrow icon (indicates clickable)
3. Hover effects: scale up + arrow slides right
4. Navigate to service page on click
5. Visual separation between platforms

COMPONENTS TO USE:
- Icons: lucide-react (Instagram, Heart, Video, UserPlus, ArrowRight)
- Next.js: Link

STATES:
- Default: All cards visible
- Hover: Individual card scales, arrow moves

INTERACTIONS:
- Hover card: Scale up, arrow slides right
- Click card: Navigate to service page

DATA STRUCTURE:
```typescript
interface Service {
  name: string;
  icon: LucideIcon;
  href: string;
  platform: 'instagram' | 'tiktok';
}

interface ServicesListProps {
  services: Service[];
}
```

EXAMPLE DATA:
```typescript
const services: Service[] = [
  // Instagram
  { name: "Instagram Followers", icon: Instagram, href: "/services/instagram/followers", platform: "instagram" },
  { name: "Instagram Likes", icon: Heart, href: "/services/instagram/likes", platform: "instagram" },
  { name: "Instagram Video Views", icon: Video, href: "/services/instagram/views", platform: "instagram" },
  
  // TikTok
  { name: "TikTok Followers", icon: UserPlus, href: "/services/tiktok/followers", platform: "tiktok" },
  { name: "TikTok Likes", icon: Heart, href: "/services/tiktok/likes", platform: "tiktok" },
  { name: "TikTok Video Views", icon: Video, href: "/services/tiktok/views", platform: "tiktok" },
];
```

STYLING DETAILS:

Section:
- Background: bg-gray-50
- Padding: py-20 (80px vertical)
- Container: container px-4 mx-auto
- Max width: max-w-2xl (672px)

Card Container:
- Display: flex flex-col
- Gap: gap-4 (16px between cards)

Service Card (Instagram):
- Component: Next.js Link
- Background: Gradient from-purple-600 to-orange-500
- Padding: p-4 (16px)
- Text: text-white
- Border radius: rounded-lg (8px)
- Shadow: shadow-lg
- Hover: scale-105, shadow-xl
- Transition: all properties
- Cursor: pointer

Service Card (TikTok):
- Same as Instagram but:
- Background: Gradient from-pink-600 to-cyan-500

Card Inner Layout:
- Display: flex
- Justify: space-between
- Align items: center

Left Side (Icon + Name):
- Display: flex
- Align items: center
- Gap: gap-3 (12px)

Icon:
- Size: w-6 h-6
- Color: white (inherited)

Service Name:
- Font weight: font-bold
- Font size: text-lg (18px)

Arrow Icon:
- Size: w-6 h-6
- Transition: transform
- Group hover: translateX(4px)

Platform Separator:
- Height: h-8 (32px)
- Empty div for spacing between platforms

ACCESSIBILITY:
- Semantic HTML: Links (<Link>)
- Descriptive link text
- Keyboard accessible (focusable)
- Focus visible states
- ARIA labels if needed

RESPONSIVE BEHAVIOR:
- Mobile: Full width cards, smaller text
- Desktop: Same layout, max-width container

ANIMATIONS:
- Card hover: scale(1.05) + shadow enhancement
- Arrow hover: translateX(4px)
- Transition: all 200ms ease-in-out
- Smooth, performant

ADDITIONAL NOTES:
- Use Next.js Link for client-side navigation
- Group hover for arrow animation
- Maintain consistent spacing
- Icons should match service type
- Consider adding service descriptions (optional)
```

---

## 💾 Data Structure

```typescript
import { LucideIcon } from 'lucide-react';

interface Service {
  name: string;
  icon: LucideIcon;
  href: string;
  platform: 'instagram' | 'tiktok';
}

interface ServicesListProps {
  services: Service[];
  showPlatformHeaders?: boolean;
}
```

---

**Last Updated**: 2025-11-27  
**Status**: Production Ready
