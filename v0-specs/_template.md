# Component Specification Template

> **Copy this template for each new component specification**

---

## 📋 Component Name: [Component Name]

**Category**: [Landing / Auth / Dashboard / Shared Component]  
**Priority**: [High / Medium / Low]  
**Status**: [⏳ Pending / 🚧 In Progress / ✅ Complete]

---

## 🎯 Overview

### Purpose
[Brief description of what this component does and why it exists]

### Context
[Where this component is used, parent pages, user journey context]

### Key Features
- Feature 1
- Feature 2
- Feature 3

---

## 🤖 V0 Prompt

```
Create a [component type] component for a [context] using Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui.

COMPONENT PURPOSE:
[Detailed description of what the component should do]

DESIGN REQUIREMENTS:
- Style: [Modern/Premium/Minimal/Vibrant/etc.]
- Color Scheme: [Primary colors from design system]
- Typography: Inter font family
- Layout: [Describe layout structure]
- Responsive: Mobile-first, breakpoints at 640px, 768px, 1024px

FUNCTIONAL REQUIREMENTS:
1. [Requirement 1]
2. [Requirement 2]
3. [Requirement 3]

COMPONENTS TO USE:
- shadcn/ui: [List specific components: Button, Card, Input, etc.]
- Icons: lucide-react [List specific icons]

STATES:
- Default state: [Description]
- Loading state: [Description]
- Error state: [Description]
- Empty state: [Description if applicable]

INTERACTIONS:
- [Interaction 1]: [What happens]
- [Interaction 2]: [What happens]

DATA STRUCTURE:
```typescript
interface [ComponentName]Props {
  // Define props here
}
```

EXAMPLE DATA:
```typescript
const exampleData = {
  // Provide realistic example data
}
```

STYLING DETAILS:
- Background: [Color/gradient]
- Text colors: [Primary/secondary/muted]
- Spacing: [Padding/margins]
- Border radius: [Size]
- Shadows: [Elevation level]
- Hover effects: [Description]
- Animations: [Transitions/keyframes]

ACCESSIBILITY:
- ARIA labels for interactive elements
- Keyboard navigation support
- Focus states visible
- Minimum touch target 44x44px

RESPONSIVE BEHAVIOR:
- Mobile (< 640px): [Description]
- Tablet (640px - 1024px): [Description]
- Desktop (> 1024px): [Description]

ADDITIONAL NOTES:
[Any special considerations, edge cases, or implementation details]
```

---

## 📐 Functional Requirements

### Core Functionality
1. **[Function 1]**
   - Description
   - Expected behavior
   - Edge cases

2. **[Function 2]**
   - Description
   - Expected behavior
   - Edge cases

### User Interactions
- **Click**: [What happens]
- **Hover**: [What happens]
- **Focus**: [What happens]
- **Submit**: [What happens]

### State Management
- **Local State**: [What state is managed locally]
- **Props**: [What data comes from parent]
- **Context/Global**: [What comes from global state if any]

---

## 🎨 Design Specifications

### Layout Structure
```
┌─────────────────────────────────┐
│  [Visual ASCII layout diagram]  │
│                                  │
│  [Show component structure]     │
└─────────────────────────────────┘
```

### Visual Design
- **Background**: [Color/gradient/image]
- **Primary Text**: [Color, size, weight]
- **Secondary Text**: [Color, size, weight]
- **Borders**: [Color, width, radius]
- **Shadows**: [Elevation, color]
- **Spacing**: [Padding, margins, gaps]

### Responsive Breakpoints
| Breakpoint | Behavior |
|------------|----------|
| Mobile (<640px) | [Description] |
| Tablet (640-1024px) | [Description] |
| Desktop (>1024px) | [Description] |

### Animations & Transitions
- **Entry**: [Animation description]
- **Hover**: [Transition description]
- **Exit**: [Animation description]
- **Duration**: [Timing]

---

## 💾 Data Structure

### TypeScript Interfaces
```typescript
interface [ComponentName]Props {
  // Props definition
}

interface [DataType] {
  // Data structure
}
```

### Example Data
```typescript
const exampleData: [DataType] = {
  // Realistic example data
}
```

### Validation Rules
- Field 1: [Validation rules]
- Field 2: [Validation rules]

---

## 🔌 Integration Notes

### API Endpoints
```typescript
// If component fetches data
GET /api/[endpoint]
POST /api/[endpoint]
```

### Dependencies
- Parent components: [List]
- Child components: [List]
- Utilities: [List]
- External libraries: [List]

### State/Context
- Uses: [Context providers used]
- Provides: [Context this component provides]

---

## ✅ Acceptance Criteria

- [ ] Component renders correctly on all screen sizes
- [ ] All interactive elements are accessible via keyboard
- [ ] Loading states display appropriately
- [ ] Error states handled gracefully
- [ ] Data validation works correctly
- [ ] Animations are smooth (60fps)
- [ ] Meets WCAG 2.1 AA accessibility standards
- [ ] TypeScript types are properly defined
- [ ] Component is documented with JSDoc comments

---

## 🔄 Variations

### Variant 1: [Name]
[Description and use case]

### Variant 2: [Name]
[Description and use case]

---

## 📝 Implementation Notes

### V0 Generation Tips
1. [Tip 1]
2. [Tip 2]

### Common Pitfalls
- [Pitfall 1 and how to avoid]
- [Pitfall 2 and how to avoid]

### Performance Considerations
- [Optimization 1]
- [Optimization 2]

---

## 🔗 Related Components

- [Component 1]: [Relationship]
- [Component 2]: [Relationship]

---

## 📚 References

- Design mockup: [Link if available]
- Similar examples: [Links]
- Documentation: [Links]

---

**Last Updated**: [Date]  
**Author**: [Name]  
**Reviewer**: [Name]
