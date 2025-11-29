# Component Specification: Stat Card

**Category**: Shared / Components  
**Priority**: Medium  
**Status**: ⏳ Pending

---

## 🤖 V0 Prompt

```
Create a reusable stat card component for dashboards using Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui.

COMPONENT PURPOSE:
Reusable metric card showing a single KPI with icon, label, value, and optional trend indicator. Used across all dashboard pages.

DESIGN: Dark premium theme, card-based

KEY FEATURES:
1. Icon (colored, customizable)
2. Label (uppercase, muted)
3. Value (large, bold, formatted)
4. Optional trend (percentage, up/down arrow)
5. Optional click action
6. Hover effect

DATA STRUCTURE:
```typescript
interface StatCardProps {
  icon: LucideIcon;
  iconColor?: string;
  label: string;
  value: string | number;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  onClick?: () => void;
  loading?: boolean;
}
```

STYLING:
- Card: bg-slate-800, border-slate-700, rounded-xl, p-6
- Icon: w-10 h-10, colored by prop
- Label: text-sm, text-slate-400, uppercase
- Value: text-3xl, font-bold, text-slate-100
- Trend up: text-green-500
- Trend down: text-red-500
- Hover: bg-slate-750 (if clickable)
- Loading: Skeleton animation

EXAMPLE USAGE:
```tsx
<StatCard
  icon={Wallet}
  iconColor="text-blue-500"
  label="Wallet Balance"
  value="$1,250.50"
  trend={{ value: 12.5, direction: 'up' }}
  onClick={() => navigate('/wallet')}
/>
```
```

**Status**: Specification Complete
