# Component Specification: Hero Section

**Category**: Landing  
**Priority**: High  
**Status**: ✅ Complete (Base version exists)

---

## 🎯 Overview

### Purpose
El Hero Section es la primera impresión del usuario al entrar a Trend Up. Debe capturar atención inmediatamente, comunicar la propuesta de valor, y motivar al usuario a tomar acción (scroll o comprar).

### Context
- Ubicación: Inmediatamente debajo del Header en la landing page
- Primera sección visible (above the fold)
- Punto de entrada principal para conversión

### Key Features
- Headline impactante con gradiente vibrante
- Badge de promoción/urgencia (Black Friday, Limited Time)
- CTA prominente que lleva a pricing
- Social proof (avatares, rating 5 estrellas, cantidad de usuarios)
- Diseño mobile-first responsive

---

## 🤖 V0 Prompt

```
Create a hero section component for a social media growth service landing page using Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui.

COMPONENT PURPOSE:
This is the main hero section for "Trend Up" - a service that helps creators grow their Instagram and TikTok following. The hero must immediately grab attention, communicate value, and drive users to take action. Target audience is content creators, influencers, and businesses looking to boost their social media presence.

DESIGN REQUIREMENTS:
- Style: Vibrant, energetic, modern, youth-focused
- Color Scheme: 
  - Primary gradient: Purple (#9333ea) to Pink (#ec4899)
  - Secondary: Blue (#2563eb) for CTAs
  - Accent: Yellow (#fbbf24) to Orange (#f97316) for urgency badges
- Typography: Inter font family, bold and extrabold weights
- Layout: Centered, single column, maximum width container
- Responsive: Mobile-first, full width on mobile, contained on desktop

FUNCTIONAL REQUIREMENTS:
1. Display promotional badge at top (e.g., "🔥 BLACK FRIDAY SALE - LIMITED TIME 🔥")
2. Show main headline with gradient text effect
3. Display value proposition subheading
4. Primary CTA button that scrolls to #pricing section
5. Social proof section with:
   - Avatar stack (4 user images overlapping)
   - 5-star rating display
   - Trust metric (e.g., "Trusted by 30,000 Creators")

COMPONENTS TO USE:
- shadcn/ui: Button
- Icons: lucide-react (Star)
- Next.js: Link, Image

STATES:
- Default state: All elements visible and interactive
- Hover state: CTA button scales slightly (scale-105) with shadow enhancement
- No loading/error states needed (static content)

INTERACTIONS:
- Click CTA button: Smooth scroll to #pricing section
- Hover CTA: Scale up animation + shadow increase
- All animations should be smooth (200-300ms transitions)

DATA STRUCTURE:
```typescript
interface HeroProps {
  badge?: {
    text: string;
    emoji?: string;
  };
  headline: string;
  subheadline: string;
  cta: {
    text: string;
    href: string;
  };
  socialProof: {
    avatarUrls: string[];
    rating: number;
    trustText: string;
  };
}
```

EXAMPLE DATA:
```typescript
const heroData: HeroProps = {
  badge: {
    emoji: "🔥",
    text: "BLACK FRIDAY SALE - LIMITED TIME"
  },
  headline: "10x Your Social Media",
  subheadline: "Over 1.2M followers delivered.\nNo bots, no fake followers, no passwords.",
  cta: {
    text: "Start Growing Now 🚀",
    href: "#pricing"
  },
  socialProof: {
    avatarUrls: [
      "https://i.pravatar.cc/100?img=11",
      "https://i.pravatar.cc/100?img=12",
      "https://i.pravatar.cc/100?img=13",
      "https://i.pravatar.cc/100?img=14"
    ],
    rating: 5.0,
    trustText: "Trusted by 30,000 Creators"
  }
}
```

STYLING DETAILS:
- Background: Pure white (#ffffff)
- Section padding: py-20 on mobile, py-32 on desktop
- Container: max-width container with horizontal padding

Badge:
- Background: Yellow-50 (#fef3c7)
- Text: Yellow-800 (#92400e)
- Border: Yellow-200
- Rounded full pill shape
- Small text (text-sm)
- Font weight: medium

Headline:
- Font size: 5xl on mobile, 6xl on tablet, 7xl on desktop, 8xl on large screens
- Font weight: extrabold (800)
- Gradient: from-purple-600 to-pink-600
- Background clip text for gradient effect
- Tracking: tighter letter spacing

Subheadline:
- Max width: 700px centered
- Font size: lg on mobile, xl on desktop
- Color: Gray-600
- Font weight: medium
- Line breaks for readability

CTA Button:
- Height: 56px (h-14)
- Padding: px-8
- Font size: lg
- Background: Blue-600 with hover Blue-700
- Shadow: xl with blue-200 tint
- Hover: Scale 105%, maintain shadow
- Transition: all properties 200ms

Social Proof Section:
- Margin top: mt-8
- Centered flex column
- Gap between elements: gap-2

Avatar Stack:
- 4 circular avatars
- Size: 40x40px each
- Overlapping: -space-x-2 (negative margin)
- Border: 2px white border
- Rounded full
- Background fallback: gray-200

Star Rating:
- 5 stars displayed
- Size: w-5 h-5
- Color: Yellow-400 (fill and stroke)
- Inline with rating number
- Rating number: font-bold, ml-2

Trust Text:
- Font size: sm
- Color: Gray-500

ACCESSIBILITY:
- Semantic HTML: <section> wrapper
- Heading hierarchy: <h1> for headline, <p> for subheadline
- Alt text for avatar images
- ARIA label for CTA button if needed
- Keyboard accessible (button is focusable)
- Focus visible states

RESPONSIVE BEHAVIOR:
- Mobile (< 640px): 
  - Headline: text-5xl
  - Padding: py-20
  - CTA: full width on small screens
  - Single column layout
  
- Tablet (640px - 1024px): 
  - Headline: text-6xl to text-7xl
  - CTA: auto width, centered
  - Increased spacing
  
- Desktop (> 1024px): 
  - Headline: text-7xl to text-8xl
  - Padding: py-32
  - Maximum content width
  - Generous spacing

ANIMATIONS:
- Badge: Optional subtle pulse animation
- Headline: Fade in on load (optional)
- CTA: Hover scale transform with smooth transition
- Social proof: Stagger fade in (optional enhancement)

ADDITIONAL NOTES:
- Use Next.js Image component for avatars (optimization)
- Ensure gradient text works across browsers (webkit-background-clip)
- CTA should use Next.js Link for client-side navigation
- Consider adding smooth scroll behavior for anchor links
- Emojis should be part of text content (not separate icons)
- Maintain high contrast for accessibility (WCAG AA minimum)
```

---

## 📐 Functional Requirements

### Core Functionality
1. **Promotional Badge Display**
   - Shows time-sensitive offers or announcements
   - Can be toggled on/off via props
   - Supports emoji + text combination

2. **Headline with Gradient**
   - Eye-catching main message
   - Gradient text effect (purple to pink)
   - Responsive font sizing

3. **Call-to-Action**
   - Primary button linking to pricing section
   - Smooth scroll behavior
   - Hover animations for engagement

4. **Social Proof**
   - Avatar stack showing real users
   - 5-star rating display
   - Trust metric text

### User Interactions
- **Click CTA**: Scrolls smoothly to #pricing section
- **Hover CTA**: Button scales up (105%) with enhanced shadow
- **View avatars**: Static display, no interaction needed
- **Read content**: All text is selectable

### State Management
- **Props-based**: All content passed via props
- **No local state**: Component is purely presentational
- **No API calls**: Static content only

---

## 🎨 Design Specifications

### Layout Structure
```
┌─────────────────────────────────────────┐
│         [Promotional Badge]             │
│                                         │
│         [Main Headline]                 │
│         [Gradient Text]                 │
│                                         │
│      [Subheadline / Value Prop]         │
│                                         │
│         [CTA Button 🚀]                 │
│                                         │
│      [Avatar Stack] ⭐⭐⭐⭐⭐ 5.0      │
│      "Trusted by 30,000 Creators"       │
└─────────────────────────────────────────┘
```

### Visual Design
- **Background**: White (#ffffff)
- **Section Padding**: 80px top/bottom (mobile), 128px (desktop)
- **Container**: Centered, max-width, 16px horizontal padding

**Badge**:
- Background: Yellow-50
- Text: Yellow-800
- Border: 1px Yellow-200
- Padding: 4px 12px
- Border radius: Full (pill)

**Headline**:
- Gradient: linear-gradient(135deg, #9333ea, #ec4899)
- Font: Inter, 800 weight
- Size: 48px → 96px (responsive)
- Line height: 1.1

**Subheadline**:
- Color: #6b7280
- Font: Inter, 500 weight
- Size: 18px → 20px
- Max width: 700px

**CTA Button**:
- Background: #2563eb → #1d4ed8 (hover)
- Text: White
- Height: 56px
- Padding: 0 32px
- Border radius: 8px
- Shadow: 0 10px 25px rgba(37, 99, 235, 0.2)

### Responsive Breakpoints
| Breakpoint | Headline Size | Padding | CTA Width |
|------------|---------------|---------|-----------|
| Mobile (<640px) | 48px (3rem) | 80px | Full width |
| Tablet (640-1024px) | 60px (3.75rem) | 96px | Auto |
| Desktop (>1024px) | 72-96px | 128px | Auto |

### Animations & Transitions
- **CTA Hover**: 
  - Transform: scale(1.05)
  - Duration: 200ms
  - Easing: ease-in-out
  
- **Badge** (optional):
  - Subtle pulse animation
  - Infinite loop
  - 2s duration

---

## 💾 Data Structure

### TypeScript Interfaces
```typescript
interface HeroProps {
  badge?: {
    text: string;
    emoji?: string;
  };
  headline: string;
  subheadline: string;
  cta: {
    text: string;
    href: string;
    emoji?: string;
  };
  socialProof: {
    avatarUrls: string[];
    rating: number;
    trustText: string;
  };
}
```

### Example Data
```typescript
// Default configuration
const defaultHeroProps: HeroProps = {
  badge: {
    emoji: "🔥",
    text: "BLACK FRIDAY SALE - LIMITED TIME"
  },
  headline: "10x Your Social Media",
  subheadline: "Over 1.2M followers delivered.\nNo bots, no fake followers, no passwords.",
  cta: {
    text: "Start Growing Now",
    href: "#pricing",
    emoji: "🚀"
  },
  socialProof: {
    avatarUrls: [
      "https://i.pravatar.cc/100?img=11",
      "https://i.pravatar.cc/100?img=12",
      "https://i.pravatar.cc/100?img=13",
      "https://i.pravatar.cc/100?img=14"
    ],
    rating: 5.0,
    trustText: "Trusted by 30,000 Creators"
  }
}

// Alternative for different campaigns
const summerSaleHero: HeroProps = {
  badge: {
    emoji: "☀️",
    text: "SUMMER SALE - 50% OFF"
  },
  headline: "Grow Faster This Summer",
  subheadline: "Join thousands of creators boosting their reach.",
  cta: {
    text: "Get Started",
    href: "#pricing",
    emoji: "🌴"
  },
  socialProof: {
    avatarUrls: ["..."],
    rating: 5.0,
    trustText: "Trusted by 30,000 Creators"
  }
}
```

### Validation Rules
- `headline`: Required, max 60 characters
- `subheadline`: Required, max 150 characters
- `cta.text`: Required, max 30 characters
- `cta.href`: Required, valid URL or anchor
- `socialProof.avatarUrls`: Array of 3-5 valid image URLs
- `socialProof.rating`: Number between 0-5
- `badge`: Optional, if provided text is required

---

## 🔌 Integration Notes

### API Endpoints
No API calls needed - static content component

### Dependencies
- `next/link`: For CTA navigation
- `next/image`: For optimized avatar images
- `lucide-react`: Star icon for rating
- `@/components/ui/button`: shadcn/ui Button component

### Parent Components
- Used in: `app/page.tsx` (main landing page)
- Position: Second section after Header

### Child Components
None - this is a leaf component

---

## ✅ Acceptance Criteria

- [x] Component renders correctly on all screen sizes
- [x] Gradient text displays properly in all browsers
- [x] CTA button navigates to pricing section
- [x] Hover animations are smooth (60fps)
- [x] Social proof elements display correctly
- [x] Avatar images load optimized (Next.js Image)
- [x] Meets WCAG 2.1 AA contrast requirements
- [x] Keyboard accessible (tab navigation)
- [x] TypeScript types properly defined
- [x] No console errors or warnings

---

## 🔄 Variations

### Variant 1: Minimal (No Badge)
Remove promotional badge for evergreen landing page
```typescript
const minimalHero: HeroProps = {
  // badge omitted
  headline: "10x Your Social Media",
  // ... rest of props
}
```

### Variant 2: Video Background
Add background video for more dynamic presentation
- Overlay gradient for text readability
- Autoplay, muted, loop
- Fallback to static image

### Variant 3: Dual CTA
Add secondary CTA for "Learn More" or "Watch Demo"
```tsx
<div className="flex gap-4">
  <Button primary>Start Growing Now</Button>
  <Button secondary>Watch Demo</Button>
</div>
```

---

## 📝 Implementation Notes

### V0 Generation Tips
1. Emphasize the gradient text effect in the prompt
2. Mention specific Tailwind classes for consistency
3. Request Next.js Image optimization
4. Specify exact color codes from design system

### Common Pitfalls
- **Gradient text not showing**: Ensure `-webkit-background-clip: text` and `background-clip: text` are both set
- **Images not loading**: Use Next.js Image with proper width/height
- **Smooth scroll not working**: Add `scroll-behavior: smooth` to CSS or use scroll library
- **Button not full width on mobile**: Add responsive classes `w-full sm:w-auto`

### Performance Considerations
- Use Next.js Image for automatic optimization
- Lazy load avatars if below fold
- Minimize animation complexity
- Use CSS transforms (not position) for animations
- Preload critical images

---

## 🔗 Related Components

- **Header**: Positioned directly above hero
- **Ticker**: Positioned directly below hero
- **PricingCards**: Target of CTA button
- **Button (shadcn/ui)**: Used for CTA

---

## 📚 References

- Current implementation: `components/landing/hero.tsx`
- Design system: `v0-specs/design-system.md`
- Figma mockup: [Not available]
- Similar examples: 
  - [Vercel homepage](https://vercel.com)
  - [Linear homepage](https://linear.app)

---

**Last Updated**: 2025-11-27  
**Author**: TDT Platform Team  
**Status**: Production Ready
