# Component Specification: Platform Selector

**Category**: Landing  
**Priority**: Medium  
**Status**: ⏳ Pending

---

## 🤖 V0 Prompt

```
Create a platform selector toggle component for switching between Instagram and TikTok services using Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui.

COMPONENT PURPOSE:
Allow users to toggle between Instagram and TikTok service offerings. Updates the displayed services and pricing based on selected platform.

DESIGN: Modern toggle/tabs, vibrant colors per platform

KEY FEATURES:
1. Two-option toggle (Instagram / TikTok)
2. Platform icons
3. Active state highlighting
4. Smooth transition animation
5. Callback on platform change

DATA STRUCTURE:
```typescript
interface PlatformSelectorProps {
  selected: 'instagram' | 'tiktok';
  onChange: (platform: 'instagram' | 'tiktok') => void;
}
```

STYLING:
- Container: Centered, inline-flex
- Instagram: Purple-600 gradient when active
- TikTok: Pink-600 to Cyan-500 gradient when active
- Inactive: Gray-300
- Toggle: Rounded-full, smooth transition
- Icons: Platform logos (Instagram, TikTok icons)

INTERACTIONS:
- Click Instagram: Set active, trigger onChange
- Click TikTok: Set active, trigger onChange
- Smooth color transition: 200ms

EXAMPLE USAGE:
```tsx
<PlatformSelector
  selected="instagram"
  onChange={(platform) => setSelectedPlatform(platform)}
/>
```
```

**Status**: Specification Complete
