# Component Specification: Ticker / Marquee

**Category**: Landing  
**Priority**: Low  
**Status**: ✅ Complete (Base version exists)

---

## 🎯 Overview

### Purpose
Ticker animado con mensajes clave de valor que se desplazan horizontalmente de forma continua, creando dinamismo visual y reforzando beneficios.

### Context
- Ubicación: Después del Hero, antes de Features
- Crea separación visual entre secciones
- Refuerza mensajes de valor de forma sutil

### Key Features
- Scroll horizontal infinito
- Múltiples mensajes con emojis
- Animación suave y continua
- Background oscuro para contraste
- No requiere interacción del usuario

---

## 🤖 V0 Prompt

```
Create an infinite scrolling ticker/marquee component for a landing page using Next.js 14, TypeScript, Tailwind CSS.

COMPONENT PURPOSE:
Animated horizontal ticker displaying key value propositions and benefits. Creates visual interest and reinforces brand messages through continuous scrolling animation.

DESIGN REQUIREMENTS:
- Style: Modern, dynamic, subtle
- Color Scheme:
  - Background: Black (#000000)
  - Text: White (#ffffff)
  - Border: White with 10% opacity
- Typography: Inter font, medium weight
- Layout: Full width, single line, overflow hidden
- Animation: Smooth infinite scroll (marquee effect)

FUNCTIONAL REQUIREMENTS:
1. Display repeating messages with emojis
2. Infinite horizontal scroll animation
3. Seamless loop (no gaps)
4. No user interaction needed
5. Pause on hover (optional)

COMPONENTS TO USE:
- No external components needed
- Pure CSS animation or Tailwind animate

STATES:
- Animating: Default continuous scroll
- Paused: Optional on hover

INTERACTIONS:
- Hover: Optional pause animation
- No clicks needed

DATA STRUCTURE:
```typescript
interface TickerProps {
  messages: string[];
  speed?: 'slow' | 'medium' | 'fast';
  pauseOnHover?: boolean;
}
```

EXAMPLE DATA:
```typescript
const tickerMessages = [
  "🚀 Boost Your Reach",
  "📈 Track Your Growth",
  "🛡️ Build Social Proof",
  "✨ Spark Authentic Engagement",
  "🌍 Expand Your Audience"
];
```

STYLING DETAILS:
- Background: bg-black
- Text: text-white
- Padding: py-3 (12px vertical)
- Border top: border-t border-white/10
- Overflow: overflow-hidden
- Whitespace: whitespace-nowrap
- Font size: text-sm
- Font weight: font-medium
- Letter spacing: tracking-wide

Animation:
```css
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.animate-marquee {
  animation: marquee 30s linear infinite;
}
```

ACCESSIBILITY:
- ARIA label: "Promotional messages"
- Reduced motion: Respect prefers-reduced-motion
- Not critical content (decorative)

RESPONSIVE BEHAVIOR:
- Same on all screen sizes
- Full width always

ANIMATIONS:
- Continuous scroll: 30s duration
- Linear easing (constant speed)
- Infinite loop
- Optional: Pause on hover

ADDITIONAL NOTES:
- Duplicate content to create seamless loop
- Use transform for better performance
- Consider using CSS animation over JS
- Messages should be concise (3-5 words each)
- Emojis add visual interest
```

---

## 💾 Data Structure

```typescript
interface TickerProps {
  messages: string[];
  speed?: number; // Animation duration in seconds
  pauseOnHover?: boolean;
}
```

---

**Last Updated**: 2025-11-27  
**Status**: Production Ready
