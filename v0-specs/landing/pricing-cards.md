# Component Specification: Pricing Cards

**Category**: Landing  
**Priority**: High  
**Status**: ✅ Complete (Base version exists)

---

## 🎯 Overview

### Purpose
Mostrar los paquetes de crecimiento de followers disponibles con precios claros, features incluidas, y CTAs para compra. Este es el componente de conversión principal donde los usuarios toman la decisión de compra.

### Context
- Ubicación: Sección #pricing en la landing page
- Target del CTA del Hero
- Punto crítico de conversión

### Key Features
- 5 paquetes de precios (STARTER, VIRAL, PRO, PLATINUM, SUPREMO)
- Badges especiales (BEST SELLER, PREMIUM)
- Gradientes únicos por paquete
- Iconos distintivos por nivel
- Features incluidas listadas
- Hover effects para engagement
- Responsive grid layout

---

## 🤖 V0 Prompt

```
Create a pricing cards section component for a social media growth service using Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui.

COMPONENT PURPOSE:
Display 5 different follower packages (STARTER to SUPREMO) with clear pricing, included features, and purchase CTAs. This is the primary conversion point where users select and buy their growth package. The design should make the PRO package stand out as the "best seller" while maintaining visual appeal across all tiers.

DESIGN REQUIREMENTS:
- Style: Premium, vibrant, card-based layout
- Color Scheme: Each package has unique gradient:
  - STARTER: Purple (#9333ea to #7e22ce)
  - VIRAL: Gray/Black (#374151 to #111827)
  - PRO: Yellow to Orange (#eab308 to #ea580c) - BEST SELLER
  - PLATINUM: Blue to Cyan (#2563eb to #0891b2)
  - SUPREMO: Pink to Purple (#ec4899 to #9333ea) - PREMIUM
- Typography: Inter font family
- Layout: Responsive grid (1 col mobile, 2 col tablet, 3 col desktop)
- Card elevation: Shadow with hover enhancement

FUNCTIONAL REQUIREMENTS:
1. Display 5 pricing packages in a grid
2. Each card shows:
   - Package name and icon
   - Follower count (main metric)
   - Price
   - Included features (if any)
   - Purchase CTA button
3. Special badges for PRO (BEST SELLER) and SUPREMO (PREMIUM)
4. Hover effect: scale up + shadow enhancement
5. All CTAs link to purchase flow

COMPONENTS TO USE:
- shadcn/ui: Card, CardHeader, CardTitle, CardContent, Button
- Icons: lucide-react (Star, Flame, Zap, Rocket, Crown, Check)
- Next.js: Link

STATES:
- Default: All cards displayed in grid
- Hover: Individual card scales up (105%) with enhanced shadow
- No loading/error states (static pricing)

INTERACTIONS:
- Hover card: Scale transform + shadow increase
- Click CTA: Navigate to purchase page with package pre-selected
- Smooth transitions on all interactions

DATA STRUCTURE:
```typescript
interface PricingPackage {
  name: string;
  level: number;
  followers: string;
  price: string;
  features: string[];
  icon: LucideIcon;
  color: string; // Tailwind gradient classes
  borderColor: string;
  bestSeller?: boolean;
  premium?: boolean;
}

interface PricingCardsProps {
  packages: PricingPackage[];
}
```

EXAMPLE DATA:
```typescript
const packages: PricingPackage[] = [
  {
    name: "STARTER",
    level: 2,
    followers: "2,500",
    price: "$29.99",
    features: [],
    icon: Star,
    color: "from-purple-600 to-purple-800",
    borderColor: "border-purple-500",
  },
  {
    name: "VIRAL",
    level: 3,
    followers: "5,000",
    price: "$49.49",
    features: ["500 Likes", "10 Comentarios (3 posts)"],
    icon: Flame,
    color: "from-gray-700 to-gray-900",
    borderColor: "border-gray-600",
  },
  {
    name: "PRO",
    level: 4,
    followers: "10,000",
    price: "$99.99",
    features: ["1,000 Likes", "30 Comentarios (5 posts)"],
    icon: Zap,
    color: "from-yellow-500 to-orange-600",
    borderColor: "border-yellow-500",
    bestSeller: true,
  },
  {
    name: "PLATINUM",
    level: 5,
    followers: "50,000",
    price: "$389.00",
    features: ["5,000 Likes", "50 Comentarios"],
    icon: Rocket,
    color: "from-blue-600 to-cyan-600",
    borderColor: "border-blue-500",
  },
  {
    name: "SUPREMO",
    level: 6,
    followers: "100,000",
    price: "$799.00",
    features: ["10,000 Likes", "100 Comentarios"],
    icon: Crown,
    color: "from-pink-600 to-purple-700",
    borderColor: "border-pink-500",
    premium: true,
  },
]
```

STYLING DETAILS:

Section:
- Background: White
- Padding: py-20 (80px vertical)
- ID: "pricing" (for anchor navigation)

Section Header:
- Title: "Paquetes Premium"
- Gradient text: Blue to Purple
- Font size: 4xl (36px)
- Centered
- Margin bottom: 48px

Grid:
- Columns: 1 (mobile), 2 (md), 3 (lg)
- Gap: 24px (gap-6)
- Max width: 1152px (max-w-6xl)
- Centered

Card:
- Border: 2px solid (color varies by package)
- Border radius: lg (8px)
- Background: White
- Overflow: hidden (for gradient header)
- Hover: shadow-2xl, scale-105
- Transition: all 300ms

Badge (Best Seller):
- Position: Absolute top-4 right-4
- Background: Gradient yellow-400 to orange-500
- Text: Black
- Padding: 4px 12px
- Border radius: Full
- Font size: xs
- Font weight: bold
- Icon: Flame (w-3 h-3)

Badge (Premium):
- Same as Best Seller but:
- Background: Gradient pink-500 to purple-600
- Text: White
- Icon: Crown

Card Header:
- Background: Gradient (unique per package)
- Text: White
- Padding bottom: 32px

Header Content:
- Package name: text-2xl, font-bold
- Icon: w-8 h-8, aligned right
- Follower count: text-4xl, font-bold
- Label "Followers": text-sm, opacity-90

Card Content:
- Padding top: 24px
- Space between elements: 16px

Price Display:
- Font size: 4xl
- Font weight: bold
- Color: Gray-900
- Centered

Features List:
- Border top: 1px gray
- Padding top: 16px
- Space between items: 8px
- Check icon: Green-600, w-4 h-4
- Text: sm, Gray-700

CTA Button:
- Width: Full
- Background: Same gradient as header
- Hover: opacity-90
- Text: "Comprar Ahora"
- Links to: /services/instagram/followers

ACCESSIBILITY:
- Semantic HTML: <section>, <article> for cards
- Heading hierarchy: <h2> for section title, <h3> for package names
- Alt text for icons (decorative, aria-hidden)
- Focus states on buttons
- Keyboard navigation
- Color contrast meets WCAG AA

RESPONSIVE BEHAVIOR:
- Mobile (< 768px): 
  - Single column
  - Full width cards
  - Stacked layout
  
- Tablet (768px - 1024px): 
  - 2 columns
  - Cards side by side
  - May wrap to 3 rows
  
- Desktop (> 1024px): 
  - 3 columns
  - 2 rows (3 + 2 layout)
  - Centered with max width

ANIMATIONS:
- Card hover: Transform scale(1.05) + shadow enhancement
- Transition: all properties 300ms ease
- Button hover: Opacity 90%
- Smooth, performant (GPU accelerated)

## 📐 Functional Requirements

### Core Functionality
1. **Package Display**
   - Render all 5 packages in responsive grid
   - Each package shows complete information
   - Visual hierarchy emphasizes key metrics

2. **Special Badges**
   - "BEST SELLER" badge on PRO package
   - "PREMIUM" badge on SUPREMO package
   - Positioned top-right, absolute

3. **Feature Lists**
   - Display included features with checkmarks
   - Only show if features exist
   - Clear, scannable format

4. **Purchase CTAs**
   - Each card has "Comprar Ahora" button
   - Links to purchase flow
   - Maintains package context

### User Interactions
- **Hover card**: Scale up animation, shadow enhancement
- **Click CTA**: Navigate to purchase page
- **Scan packages**: Easy comparison of features and pricing
- **Mobile swipe**: Natural scrolling on mobile

### State Management
- **Props-based**: Packages passed as props
- **No local state**: Purely presentational
- **No API calls**: Static pricing data

---

## 🎨 Design Specifications

### Layout Structure
```
┌─────────────────────────────────────────┐
│      Paquetes Premium (Gradient)        │
│   Elige el plan perfecto para tu       │
│           crecimiento                   │
└─────────────────────────────────────────┘

┌─────────┐  ┌─────────┐  ┌─────────┐
│ STARTER │  │  VIRAL  │  │   PRO   │
│  ⭐     │  │  🔥     │  │  ⚡ BEST│
│ 2,500   │  │ 5,000   │  │ 10,000  │
│ $29.99  │  │ $49.49  │  │ $99.99  │
│         │  │ Features│  │ Features│
│ [COMPRAR│  │ [COMPRAR│  │ [COMPRAR│
└─────────┘  └─────────┘  └─────────┘

┌─────────┐  ┌─────────┐
│PLATINUM │  │ SUPREMO │
│  🚀     │  │  👑 PREM│
│ 50,000  │  │ 100,000 │
│ $389.00 │  │ $799.00 │
│ Features│  │ Features│
│ [COMPRAR│  │ [COMPRAR│
└─────────┘  └─────────┘
```

### Visual Design

**Section**:
- Background: #ffffff
- Padding: 80px vertical, 16px horizontal
- Max width: 1152px centered

**Grid**:
- Gap: 24px
- Responsive columns: 1 → 2 → 3
- Alignment: Center

**Card**:
- Width: 100% of grid cell
- Min height: Auto (content-based)
- Border: 2px solid (color varies)
- Border radius: 8px
- Shadow: lg default, 2xl on hover
- Transition: 300ms all

**Gradients** (Header backgrounds):
- STARTER: `linear-gradient(135deg, #9333ea, #7e22ce)`
- VIRAL: `linear-gradient(135deg, #374151, #111827)`
- PRO: `linear-gradient(135deg, #eab308, #ea580c)`
- PLATINUM: `linear-gradient(135deg, #2563eb, #0891b2)`
- SUPREMO: `linear-gradient(135deg, #ec4899, #9333ea)`

### Responsive Breakpoints
| Breakpoint | Columns | Card Width | Gap |
|------------|---------|------------|-----|
| Mobile (<768px) | 1 | 100% | 24px |
| Tablet (768-1024px) | 2 | ~50% | 24px |
| Desktop (>1024px) | 3 | ~33% | 24px |

### Animations & Transitions
- **Card Hover**:
  - Transform: scale(1.05)
  - Shadow: xl → 2xl
  - Duration: 300ms
  - Easing: ease-in-out

- **Button Hover**:
  - Opacity: 100% → 90%
  - Duration: 200ms

---

## 💾 Data Structure

### TypeScript Interfaces
```typescript
import { LucideIcon } from 'lucide-react';

interface PricingPackage {
  name: string;
  level: number;
  followers: string; // Formatted with commas
  price: string; // Formatted with currency
  features: string[];
  icon: LucideIcon;
  color: string; // Tailwind gradient classes
  borderColor: string; // Tailwind border class
  bestSeller?: boolean;
  premium?: boolean;
}

interface PricingCardsProps {
  packages?: PricingPackage[];
  sectionTitle?: string;
  sectionSubtitle?: string;
}
```

### Example Data
```typescript
import { Star, Flame, Zap, Rocket, Crown } from 'lucide-react';

const defaultPackages: PricingPackage[] = [
  {
    name: "STARTER",
    level: 2,
    followers: "2,500",
    price: "$29.99",
    features: [],
    icon: Star,
    color: "from-purple-600 to-purple-800",
    borderColor: "border-purple-500",
  },
  {
    name: "VIRAL",
    level: 3,
    followers: "5,000",
    price: "$49.49",
    features: [
      "500 Likes",
      "10 Comentarios (3 posts)"
    ],
    icon: Flame,
    color: "from-gray-700 to-gray-900",
    borderColor: "border-gray-600",
  },
  {
    name: "PRO",
    level: 4,
    followers: "10,000",
    price: "$99.99",
    features: [
      "1,000 Likes",
      "30 Comentarios (5 posts)"
    ],
    icon: Zap,
    color: "from-yellow-500 to-orange-600",
    borderColor: "border-yellow-500",
    bestSeller: true,
  },
  {
    name: "PLATINUM",
    level: 5,
    followers: "50,000",
    price: "$389.00",
    features: [
      "5,000 Likes",
      "50 Comentarios"
    ],
    icon: Rocket,
    color: "from-blue-600 to-cyan-600",
    borderColor: "border-blue-500",
  },
  {
    name: "SUPREMO",
    level: 6,
    followers: "100,000",
    price: "$799.00",
    features: [
      "10,000 Likes",
      "100 Comentarios"
    ],
    icon: Crown,
    color: "from-pink-600 to-purple-700",
    borderColor: "border-pink-500",
    premium: true,
  },
];
```

### Validation Rules
- `name`: Required, uppercase, max 20 chars
- `level`: Required, number 1-10
- `followers`: Required, formatted string
- `price`: Required, currency format
- `features`: Array, can be empty
- `icon`: Required, valid Lucide icon
- `color`: Required, valid Tailwind gradient
- `borderColor`: Required, valid Tailwind border color

---

## 🔌 Integration Notes

### API Endpoints
```typescript
// Future: Fetch dynamic pricing
GET /api/pricing/packages
Response: PricingPackage[]
```

### Dependencies
- `@/components/ui/card`: Card, CardHeader, CardTitle, CardContent
- `@/components/ui/button`: Button
- `lucide-react`: Star, Flame, Zap, Rocket, Crown, Check
- `next/link`: Link

### Parent Components
- Used in: `app/page.tsx` (main landing)
- Section ID: `#pricing` (for anchor navigation)

### Child Components
- Card (shadcn/ui)
- Button (shadcn/ui)

---

## ✅ Acceptance Criteria

- [x] All 5 packages display correctly
- [x] Responsive grid works on all screen sizes
- [x] Badges show on correct packages
- [x] Hover animations are smooth
- [x] CTAs link to correct purchase page
- [x] Features list displays with checkmarks
- [x] Gradients render correctly
- [x] Meets accessibility standards
- [x] TypeScript types defined
- [x] No layout shift on hover

---

## 🔄 Variations

### Variant 1: TikTok Packages
Different pricing structure for TikTok services
```typescript
const tiktokPackages: PricingPackage[] = [
  // Different follower counts and prices
]
```

### Variant 2: Monthly Subscription
Recurring pricing instead of one-time
```typescript
interface SubscriptionPackage extends PricingPackage {
  billingPeriod: 'monthly' | 'yearly';
  savings?: string;
}
```

### Variant 3: Comparison Table
Side-by-side feature comparison
- Horizontal scrolling on mobile
- Fixed header row
- Checkmarks for included features

---

## 📝 Implementation Notes

### V0 Generation Tips
1. Provide complete package data in prompt
2. Specify exact gradient colors
3. Request conditional badge rendering
4. Emphasize responsive grid behavior
5. Mention hover performance (GPU acceleration)

### Common Pitfalls
- **Grid wrapping issues**: Use proper breakpoint classes
- **Gradient not showing**: Ensure `bg-gradient-to-r` syntax
- **Icons not rendering**: Import from lucide-react correctly
- **Hover jank**: Use transform instead of margin/padding
- **Badge positioning**: Ensure parent has `relative` position

### Performance Considerations
- Use CSS transforms for hover (GPU accelerated)
- Minimize re-renders (memoize if needed)
- Lazy load if below fold
- Optimize icon imports (tree-shaking)

---

## 🔗 Related Components

- **Hero**: CTA links to this section
- **ServicesGrid**: Alternative layout for services
- **CheckoutFlow**: Target of CTA buttons
- **Button**: Used for CTAs

---

## 📚 References

- Current implementation: `components/landing/pricing-cards.tsx`
- Design system: `v0-specs/design-system.md`
- Similar examples:
  - [Stripe Pricing](https://stripe.com/pricing)
  - [Vercel Pricing](https://vercel.com/pricing)

---

**Last Updated**: 2025-11-27  
**Author**: TDT Platform Team  
**Status**: Production Ready
