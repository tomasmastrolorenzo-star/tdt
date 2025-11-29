# Component Specification: Features Section

**Category**: Landing  
**Priority**: High  
**Status**: ✅ Complete (Base version exists)

---

## 🎯 Overview

### Purpose
Sección de 3 columnas destacando los beneficios principales del servicio: crecimiento orgánico, alta calidad, y precios accesibles. Incluye CTA final motivacional.

### Context
- Ubicación: Después del Ticker, antes de Services List
- Refuerza propuesta de valor
- Construye confianza antes de mostrar precios

### Key Features
- 3 feature cards con iconos
- Gradientes purple-pink en iconos
- Badges de categoría (ORGANIC GROWTH, HIGH QUALITY, AFFORDABLE)
- Hover animations (scale up)
- CTA final section con copy casual

---

## 🤖 V0 Prompt

```
Create a features section component with 3 feature cards for a social media growth service using Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui.

COMPONENT PURPOSE:
Highlight the three main value propositions: Organic Growth (fast, starts in 24h), High Quality (real users, relevant engagement), and Affordable (best market prices). Build trust and credibility before users see pricing.

DESIGN REQUIREMENTS:
- Style: Clean, modern, card-based, vibrant
- Color Scheme:
  - Background: White (#ffffff)
  - Card backgrounds: White with shadow
  - Icon backgrounds: Purple to Pink gradient (#9333ea to #ec4899)
  - Badges: Black background, white text
  - Headline: Purple to Pink gradient
- Typography: Inter font family
- Layout: 3-column grid on desktop, single column on mobile
- Card elevation: Shadow with hover enhancement

FUNCTIONAL REQUIREMENTS:
1. Display 3 feature cards in a grid
2. Each card shows:
   - Icon in gradient circle
   - Category badge
   - Description text
3. Hover effect: scale up cards
4. Bottom CTA section with casual copy
5. Responsive grid layout

COMPONENTS TO USE:
- shadcn/ui: Card, CardHeader, CardContent
- Icons: lucide-react (TrendingUp, Star, Wallet)

STATES:
- Default: All cards visible
- Hover: Individual card scales up

INTERACTIONS:
- Hover card: Scale transform (105%)
- No clicks needed (informational)

DATA STRUCTURE:
```typescript
interface Feature {
  icon: LucideIcon;
  badge: string;
  description: string;
}

interface FeaturesProps {
  features: Feature[];
  headline?: string;
  ctaSection?: {
    preText: string;
    mainText: string;
    subText: string;
  };
}
```

EXAMPLE DATA:
```typescript
const features: Feature[] = [
  {
    icon: TrendingUp,
    badge: "ORGANIC GROWTH",
    description: "Fast, organic growth starts within 24 hours after purchase."
  },
  {
    icon: Star,
    badge: "HIGH QUALITY",
    description: "We ensure top-quality growth by engaging with fresh, relevant users."
  },
  {
    icon: Wallet,
    badge: "AFFORDABLE",
    description: "We offer the best prices on the market, guaranteed."
  }
];

const ctaSection = {
  preText: "WHAT ARE YOU WAITING FOR ?",
  mainText: "Seriously, Yo...",
  subText: "You should really just say \"f*ck it\" and take RizzUp for a spin."
};
```

STYLING DETAILS:

Section:
- Background: bg-white
- Padding: py-20 (80px vertical)
- Container: container px-4 mx-auto
- Text align: center

Headline:
- Text: "More Followers. Better Engagement. Higher Status."
- Font size: text-3xl (mobile), text-5xl (desktop)
- Font weight: font-bold
- Gradient: from-purple-600 to-pink-600
- Background clip: text
- Margin bottom: mb-12 (48px)

Grid:
- Columns: 1 (mobile), 3 (md+)
- Gap: gap-8 (32px)

Feature Card:
- Border: none
- Shadow: shadow-xl
- Hover: scale-105, shadow enhancement
- Transition: transform 300ms
- Background: white

Icon Container:
- Size: w-16 h-16
- Margin: mx-auto (centered)
- Background: Gradient purple-500 to pink-500
- Border radius: rounded-full
- Display: flex, items-center, justify-center
- Margin bottom: mb-4

Icon:
- Size: w-8 h-8
- Color: text-white

Badge:
- Background: bg-black
- Text: text-white
- Font size: text-xs
- Font weight: font-bold
- Padding: py-1 px-3
- Border radius: rounded-full
- Width: w-fit
- Margin: mx-auto mb-2

Description:
- Color: text-gray-600
- Font size: text-base
- Line height: normal

CTA Section:
- Margin top: mt-16 (64px)
- Text align: center

CTA Pre-text:
- Font size: text-sm
- Font weight: font-bold
- Color: text-gray-500
- Margin bottom: mb-4

CTA Main Text:
- Font size: text-4xl
- Font weight: font-extrabold
- Color: text-purple-600
- Margin bottom: mb-4

CTA Sub-text:
- Color: text-gray-600
- Font size: text-base

ACCESSIBILITY:
- Semantic HTML: <section>
- Heading hierarchy: <h2> for main headline, <h3> for CTA
- Icons are decorative (aria-hidden)
- Sufficient color contrast
- Keyboard navigation not needed (informational)

RESPONSIVE BEHAVIOR:
- Mobile (< 768px):
  - Single column
  - Headline: text-3xl
  - Cards stack vertically
  
- Desktop (>= 768px):
  - 3 columns
  - Headline: text-5xl
  - Cards side by side

ANIMATIONS:
- Card hover: scale(1.05) + shadow enhancement
- Transition: 300ms ease-in-out
- Smooth, performant

ADDITIONAL NOTES:
- Keep descriptions concise (1-2 sentences)
- Badges should be uppercase
- CTA copy is intentionally casual/edgy
- Icons should match the feature theme
- Gradient should be consistent with brand
```

---

## 💾 Data Structure

```typescript
import { LucideIcon } from 'lucide-react';

interface Feature {
  icon: LucideIcon;
  badge: string;
  description: string;
}

interface FeaturesProps {
  features: Feature[];
  headline?: string;
  ctaSection?: {
    preText: string;
    mainText: string;
    subText: string;
  };
}
```

---

**Last Updated**: 2025-11-27  
**Status**: Production Ready
