# Component Specification: Create Order Form

**Category**: Shared / Forms  
**Priority**: High  
**Status**: ⏳ Pending

---

## 🤖 V0 Prompt

```markdown
Create an order creation form for vendors using Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui.

COMPONENT PURPOSE:
Form for vendors to create new orders. Selects service, quality tier, quantity, and customer link.
Includes an "Order Bump" (Upsell) feature to increase AOV.

DESIGN: Dark premium theme, single-page form with real-time price updates.

KEY FEATURES:
1. Service selection (Cards with icons)
2. Quality tier selection (Active/Premium/VIP)
3. Quantity input (Slider + Number input)
4. Customer link input (Validation based on platform)
5. **Order Bump (Upsell)**: Checkbox to add related service (e.g., "Add 1k Likes for $2.99")
6. Price calculation display (Base + Bump - Discounts)
7. Submit button with dynamic price label

DATA STRUCTURE:
```typescript
interface OrderFormData {
  service: string; // e.g., "instagram-followers"
  quality: 'active' | 'premium' | 'vip';
  quantity: number;
  customerLink: string;
  notes?: string;
  hasOrderBump: boolean; // CEO Optimization
}

interface ServiceOption {
  id: string;
  name: string;
  platform: 'instagram' | 'tiktok';
  basePrice: number;
  bumpOffer?: {
    label: string;
    price: number;
  };
}
```

LAYOUT:
1. **Service Selector**: Grid of cards.
2. **Quality Tiers**: Segmented control or tabs.
3. **Quantity**: Input field with quick select buttons (+100, +1000).
4. **Link Input**: Text field with platform icon.
5. **Order Bump Box**: 
   - Yellow/Gold border dashed container.
   - Checkbox: "🚀 **One-Time Offer**: Add 1,000 Likes for just $2.99 (50% OFF)"
   - "Yes, add this to my order" label.
6. **Price Summary**: Sticky bottom or card footer.
7. **Submit Button**: Large, gradient background.

STYLING:
- **Form**: `bg-slate-800` border `border-slate-700` rounded-xl.
- **Bump Box**: `bg-yellow-900/20` border-2 `border-yellow-500/50` border-dashed p-4 rounded-lg.
- **Inputs**: `bg-slate-900` border-slate-700 focus:ring-blue-500.
- **Typography**: Inter font, clear hierarchy.

VALIDATION:
- **Link**: Regex validation for Instagram/TikTok URLs.
- **Quantity**: Min/Max limits based on service.
- **Balance**: Check if user has enough funds (mock check).

INTERACTIONS:
- **Service Change**: Updates available quality tiers and bump offer.
- **Bump Toggle**: Instantly updates Total Price.
- **Submit**: 
  - Loading state.
  - Success confetti.
  - Redirect to Orders list.

EXAMPLE USAGE:
```tsx
<OrderForm
  services={servicesCatalog}
  userBalance={150.00}
  onSubmit={handleOrderCreate}
/>
```
```

## 📋 Functional Requirements
- **Real-time Math**: Price = (Base * Qty) + (Bump ? BumpPrice : 0).
- **Responsive**: Stacked layout on mobile.
- **Accessibility**: ARIA labels for inputs and checkbox.

## 🔗 Integration Notes
- Connects to `useOrder` hook.
- Fetches services from `supabase`.
- Updates `wallet_balance` on success.
