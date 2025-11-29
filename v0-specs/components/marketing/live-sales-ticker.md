# Component Specification: Live Sales Ticker (Social Proof)

**Category**: Components / Marketing  
**Priority**: Medium  
**Status**: ⏳ Pending

---

## 🤖 V0 Prompt

```markdown
Create a "Live Sales Ticker" (Social Proof Notification) component using Next.js 14, TypeScript, Tailwind CSS, and Framer Motion.

COMPONENT PURPOSE:
Display small, non-intrusive popups showing recent purchases to build trust and urgency (FOMO).
"Someone from Madrid just bought 1,000 Instagram Followers".

DESIGN:
- Position: Bottom-left (desktop), Top (mobile).
- Style: Glassmorphism, rounded-lg, subtle shadow.
- Animation: Slide in from bottom, stay 5s, slide out.

KEY FEATURES:
1. **Dynamic Content**: Rotates through a list of simulated "recent orders".
2. **Randomization**: Random names, locations, services, and time ago (e.g., "2 mins ago").
3. **Product Image**: Small icon representing the service (IG logo, TikTok logo).
4. **Close Button**: User can dismiss it.

DATA STRUCTURE:
```typescript
interface SaleNotification {
  id: string;
  name: string; // e.g., "Juan M."
  location: string; // e.g., "Madrid, ES"
  service: string; // e.g., "1,000 IG Followers"
  timeAgo: string; // e.g., "Just now"
  image: string; // URL to icon
}
```

STYLING:
- Container: `fixed bottom-4 left-4 z-50`
- Card: `bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl shadow-2xl`
- Text: `text-white text-sm`
- Icon: `w-10 h-10 rounded-full`

ANIMATION (Framer Motion):
- Initial: `y: 100, opacity: 0`
- Animate: `y: 0, opacity: 1`
- Exit: `y: 100, opacity: 0`

BEHAVIOR:
- Show first notification after 5 seconds.
- Show next one every 15-30 seconds (random interval).
- Hide on mobile if user dismisses.

EXAMPLE USAGE:
```tsx
<LiveSalesTicker />
```
```

## 📋 Functional Requirements
- **Simulated Data**: Use a predefined list of 50+ realistic names and locations.
- **Looping**: Infinite loop of notifications.
- **Mobile Optimized**: Smaller size on mobile, positioned at top to avoid blocking navigation.

## 🔗 Integration Notes
- Place in `app/layout.tsx` to show globally or just on Landing Pages.
- Ensure `z-index` is high enough to be above other content but below modals.
