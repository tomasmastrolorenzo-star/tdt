# Design System - TDT Platform

## 🎨 Brand Identity

### Trend Up (Instagram/TikTok Growth Landing)
- **Primary**: Vibrant, energetic, youth-focused
- **Colors**: Yellow/Orange gradients, Purple/Pink accents
- **Vibe**: Fast growth, viral, trending, social proof

### TDT System (B2B Platform)
- **Primary**: Professional, trustworthy, premium
- **Colors**: Blue/Navy, Dark themes
- **Vibe**: Sophisticated, data-driven, efficient

## 🎨 Color Palette

### Trend Up Landing
```css
/* Primary Gradients */
--gradient-primary: linear-gradient(135deg, #fbbf24 0%, #f97316 100%); /* Yellow to Orange */
--gradient-secondary: linear-gradient(135deg, #9333ea 0%, #ec4899 100%); /* Purple to Pink */

/* Solid Colors */
--yellow-500: #fbbf24;
--orange-500: #f97316;
--purple-600: #9333ea;
--pink-600: #ec4899;
--blue-600: #2563eb;
--blue-700: #1d4ed8;

/* Backgrounds */
--bg-primary: #ffffff;
--bg-secondary: #f9fafb;
--bg-accent: #fef3c7; /* Yellow tint */

/* Text */
--text-primary: #111827;
--text-secondary: #6b7280;
--text-muted: #9ca3af;
```

### TDT Dashboard
```css
/* Dark Theme */
--bg-dark: #0f172a;
--bg-dark-secondary: #1e293b;
--bg-dark-card: #334155;

/* Accent Colors */
--accent-blue: #3b82f6;
--accent-green: #10b981;
--accent-red: #ef4444;
--accent-yellow: #f59e0b;

/* Text on Dark */
--text-dark-primary: #f1f5f9;
--text-dark-secondary: #cbd5e1;
--text-dark-muted: #94a3b8;
```

## 📐 Typography

### Font Families
```css
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-display: 'Inter', sans-serif; /* For headings */
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

### Font Sizes
```css
/* Mobile First */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
--text-5xl: 3rem;      /* 48px */
--text-6xl: 3.75rem;   /* 60px */
--text-7xl: 4.5rem;    /* 72px */
--text-8xl: 6rem;      /* 96px */
```

### Font Weights
```css
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-extrabold: 800;
```

## 📏 Spacing Scale

```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */
--space-32: 8rem;     /* 128px */
```

## 🔲 Border Radius

```css
--radius-sm: 0.375rem;   /* 6px */
--radius-md: 0.5rem;     /* 8px */
--radius-lg: 0.75rem;    /* 12px */
--radius-xl: 1rem;       /* 16px */
--radius-2xl: 1.5rem;    /* 24px */
--radius-full: 9999px;   /* Pill shape */
```

## 🌊 Shadows

```css
/* Elevation */
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
--shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);

/* Colored Shadows (for CTAs) */
--shadow-blue: 0 10px 25px -5px rgb(37 99 235 / 0.3);
--shadow-purple: 0 10px 25px -5px rgb(147 51 234 / 0.3);
--shadow-yellow: 0 10px 25px -5px rgb(251 191 36 / 0.3);
```

## 🎬 Animations

### Transitions
```css
--transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-base: 200ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-slow: 300ms cubic-bezier(0.4, 0, 0.2, 1);
```

### Common Animations
```css
/* Fade In */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide Up */
@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

/* Scale In */
@keyframes scaleIn {
  from { 
    opacity: 0;
    transform: scale(0.95);
  }
  to { 
    opacity: 1;
    transform: scale(1);
  }
}

/* Pulse */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

## 📱 Responsive Breakpoints

```css
/* Mobile First Approach */
--breakpoint-sm: 640px;   /* Small devices */
--breakpoint-md: 768px;   /* Tablets */
--breakpoint-lg: 1024px;  /* Laptops */
--breakpoint-xl: 1280px;  /* Desktops */
--breakpoint-2xl: 1536px; /* Large screens */
```

## 🧩 Component Patterns

### Buttons

#### Primary CTA
```tsx
className="h-12 px-6 text-base font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 transition-all hover:scale-105"
```

#### Secondary
```tsx
className="h-12 px-6 text-base font-medium rounded-lg border-2 border-gray-300 hover:border-gray-400 bg-white text-gray-700 transition-colors"
```

#### Gradient CTA (Trend Up)
```tsx
className="h-14 px-8 text-lg font-bold rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xl shadow-purple-200 hover:shadow-2xl transition-all hover:scale-105"
```

### Cards

#### Basic Card
```tsx
className="p-6 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
```

#### Premium Card
```tsx
className="p-8 rounded-2xl bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
```

#### Dark Card (Dashboard)
```tsx
className="p-6 rounded-xl bg-slate-800 border border-slate-700 shadow-lg"
```

### Inputs

#### Text Input
```tsx
className="w-full h-12 px-4 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
```

#### Search Input
```tsx
className="w-full h-10 pl-10 pr-4 rounded-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
```

### Badges

#### Status Badge
```tsx
className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
```

#### Notification Badge
```tsx
className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold bg-red-500 text-white"
```

## 🎯 Usage Guidelines

### Trend Up Landing
- Use vibrant gradients for CTAs
- Include emojis strategically (🚀 🔥 ⚡ 💎)
- High contrast, bold typography
- Social proof elements (stars, avatars, numbers)
- Animated elements for engagement

### TDT Dashboard
- Clean, data-focused layouts
- Consistent spacing and alignment
- Clear hierarchy with typography
- Subtle animations (no distractions)
- Dark mode friendly

### Accessibility
- Minimum contrast ratio: 4.5:1 for text
- Focus states on all interactive elements
- Keyboard navigation support
- ARIA labels where needed
- Responsive touch targets (min 44x44px)

## 📦 Shadcn/UI Components

Base components to use from shadcn/ui:
- Button
- Card
- Input
- Label
- Select
- Dialog
- Dropdown Menu
- Tabs
- Badge
- Avatar
- Separator
- Skeleton

## 🔗 Integration with V0

When creating prompts for v0.dev, reference these tokens:

```
Use the following design system:
- Colors: [specify from palette above]
- Typography: Inter font family, [specify sizes]
- Spacing: [specify scale]
- Shadows: [specify elevation]
- Border radius: [specify size]
- Transitions: 200ms ease-in-out
```

## 📝 Notes

- Always prioritize mobile-first responsive design
- Use semantic HTML elements
- Maintain consistent spacing rhythm
- Test in both light and dark modes
- Optimize for performance (lazy load images, minimize animations)
