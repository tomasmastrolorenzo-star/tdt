# Component Specification: Vendor Affiliate System

**Category**: Dashboard / Vendor  
**Priority**: Medium  
**Status**: ⏳ Pending

---

## 🤖 V0 Prompt

```
Create a vendor affiliate dashboard page showing referral codes, stats, and earnings using Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui.

COMPONENT PURPOSE:
Display vendor's affiliate codes for Trend Up and Trenzo Agency, track referral stats, and show commission earnings.

DESIGN: Dark premium theme, stats-focused

KEY FEATURES:
1. Referral code cards (Trend Up, Trenzo Agency)
2. Copy/Share buttons
3. Stats: Clicks, Conversions, Earnings
4. Referral history table
5. Social sharing options

DATA STRUCTURE:
```typescript
interface AffiliateData {
  codes: {
    trendUp: string;
    trenzoAgency: string;
  };
  stats: {
    clicks: number;
    conversions: number;
    earnings: number;
  };
  referrals: Array<{
    date: Date;
    user: string;
    status: 'pending' | 'completed';
    commission: number;
  }>;
}
```

LAYOUT:
- Referral code cards (2 cards side by side)
- Stats cards (3 metrics)
- Referral history table
- Share buttons

STYLING:
- Code cards: bg-slate-800, monospace font for code
- Copy button: bg-blue-600, with copy icon
- Stats: Same as dashboard overview
- Table: Standard data table styling

INTERACTIONS:
- Click Copy: Copy code to clipboard, show toast
- Click Share: Open share modal/native share
- View referral: Click row to see details
```

**Status**: Specification Complete
