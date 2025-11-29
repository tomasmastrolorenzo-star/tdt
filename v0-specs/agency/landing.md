# Component Specification: Trenzo Agency Landing Page

## 📌 Overview
Landing page premium para "Trenzo Agency", enfocada en servicios B2B de alto valor (gestión de redes, estrategia, contenido). Estética minimalista, sofisticada y corporativa (Dark Premium).

## 🤖 V0 Prompt
```markdown
Create a premium, high-end agency landing page for "Trenzo Agency".
The design should be "Dark Premium" using slate-900, slate-800, and subtle gold/blue accents.
Typography should be elegant (Inter or similar sans-serif).

Structure:
1. **Hero Section**:
   - Headline: "Elevamos tu Presencia Digital al Nivel de Arte"
   - Subheadline: "Estrategia, Contenido y Crecimiento para marcas que exigen excelencia."
   - CTA: "Agendar Consultoría" (Primary, Gold/Gradient), "Ver Portfolio" (Secondary, Outline)
   - Background: Subtle animated mesh or dark gradient.

2. **Services Grid (Bento Grid Style)**:
   - Card 1: "Gestión de Redes Sociales" - Icon: LayoutGrid
   - Card 2: "Growth Hacking" - Icon: TrendingUp
   - Card 3: "Creación de Contenido" - Icon: Video
   - Card 4: "Consultoría Estratégica" - Icon: BrainCircuit
   - Style: Glassmorphism cards on dark background.

3. **Methodology (Steps)**:
   - Step 1: "Análisis" - Auditoría profunda.
   - Step 2: "Estrategia" - Plan a medida.
   - Step 3: "Ejecución" - Implementación impecable.
   - Step 4: "Optimización" - Mejora continua.

4. **Portfolio / Case Studies**:
   - Carousel or Grid of high-quality project mockups.
   - "Marca de Moda" - +200% Ventas
   - "Tech Startup" - +50k Seguidores
   - "Personal Brand" - Verificación Azul

5. **Pricing / Plans**:
   - "Essential" (Startups)
   - "Professional" (Growth)
   - "Enterprise" (Full Service) - Highlighted

6. **Contact Section**:
   - Minimalist form: Name, Company, Email, Budget Range.
   - "Hablemos de tu próximo éxito."

Use shadcn/ui components (Button, Card, Input, Label, Textarea).
Use lucide-react icons.
Ensure fully responsive design.
```

## 📋 Functional Requirements
- **Navigation**: Sticky header con links a secciones (Servicios, Portfolio, Planes, Contacto).
- **Form**: Validación de campos en formulario de contacto.
- **Responsive**: Adaptable a móvil (stack vertical) y desktop.

## 🎨 Design Specifications
- **Background**: `#0f172a` (Slate 900)
- **Cards**: `#1e293b` (Slate 800) con borde sutil `#334155`.
- **Accent**: Gold (`#fbbf24`) o Electric Blue (`#3b82f6`) para CTAs.
- **Text**: White (`#f8fafc`) y Slate 400 (`#94a3b8`) para secundario.

## 💾 Data Structure
```typescript
interface Service {
  title: string;
  description: string;
  icon: string;
}

interface CaseStudy {
  client: string;
  metric: string;
  image: string;
  category: string;
}

interface Plan {
  name: string;
  price: string; // e.g., "Desde $997/mo"
  features: string[];
  isPopular?: boolean;
}
```

## 📝 Content (Copy)
- **Hero Headline**: "Tu Socio Estratégico en la Era Digital"
- **Hero Sub**: "Ayudamos a marcas visionarias a construir comunidades leales y generar ingresos escalables."
- **Trust**: "Confían en nosotros: [Logos de empresas]"

## 🔗 Integration Notes
- Crear en `app/agency/page.tsx`
- Usar layout separado si es necesario (`app/agency/layout.tsx`) para diferenciar del panel Trend Up.
```
