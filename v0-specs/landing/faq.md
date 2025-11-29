# Component Specification: FAQ Section

**Category**: Landing  
**Priority**: Medium  
**Status**: ⏳ Pending

---

## 🤖 V0 Prompt

```
Create an FAQ accordion section for a landing page using Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui.

COMPONENT PURPOSE:
Answer common questions about the social media growth service. Build trust and reduce friction before purchase.

DESIGN: Clean, white background, accordion-based

KEY FEATURES:
1. Accordion component (expand/collapse)
2. 8-12 common questions
3. Clean, scannable layout
4. Search functionality (optional)

DATA STRUCTURE:
```typescript
interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  items: FAQItem[];
  title?: string;
  subtitle?: string;
}
```

EXAMPLE DATA:
```typescript
const faqItems: FAQItem[] = [
  {
    question: "How long does it take to see results?",
    answer: "Growth starts within 24 hours of purchase. Full delivery depends on package size, typically 3-7 days."
  },
  {
    question: "Are the followers real?",
    answer: "Yes! We provide 100% real, active users. No bots, no fake accounts."
  },
  {
    question: "Do you need my password?",
    answer: "Never! We only need your public profile link. We never ask for passwords."
  },
  {
    question: "What if I don't get my followers?",
    answer: "We offer a 100% money-back guarantee if we don't deliver as promised."
  }
];
```

STYLING:
- Section: bg-white, py-20
- Title: text-4xl, font-bold, gradient purple-pink
- Accordion: bg-white, border-gray-200
- Question: font-semibold, text-lg
- Answer: text-gray-600
- Icon: chevron (rotate on expand)

INTERACTIONS:
- Click question: Expand/collapse answer
- Only one open at a time (optional)
- Smooth animation
```

**Status**: Specification Complete
