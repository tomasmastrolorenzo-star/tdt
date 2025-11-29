# V0 Component Specifications

Este directorio contiene especificaciones detalladas de cada componente y página del sistema TDT Platform, optimizadas para implementación rápida en **v0.dev**.

## 🎯 Objetivo

Proporcionar prompts completos, estructurados y listos para usar en v0.dev, incluyendo:
- Descripción funcional completa
- Requisitos de diseño y UX
- Estructura de datos y props
- Estados y comportamientos
- Tokens de diseño (colores, tipografía, espaciado)
- Casos de uso y ejemplos

## 📁 Estructura

```
v0-specs/
├── README.md (este archivo)
├── _template.md (plantilla base)
├── design-system.md (tokens y guías de diseño)
├── landing/
│   ├── header.md
│   ├── hero.md
│   ├── pricing.md
│   └── ...
├── auth/
│   ├── login.md
│   ├── register.md
│   └── ...
├── dashboard/
│   ├── vendor/
│   ├── operator/
│   └── admin/
└── components/
    ├── forms/
    ├── cards/
    └── ...
```

## 🚀 Cómo Usar

1. **Selecciona el componente** que necesitas implementar
2. **Abre el archivo .md** correspondiente
3. **Copia el prompt completo** de la sección "V0 Prompt"
4. **Pégalo en v0.dev** y genera el componente
5. **Ajusta según necesidad** usando las variaciones sugeridas

## 🎨 Design System

Todos los componentes siguen el design system definido en `design-system.md`:
- Paleta de colores consistente
- Tipografía y escalas
- Espaciado y grid system
- Componentes base reutilizables
- Animaciones y transiciones

## 📝 Formato de Especificación

Cada archivo de especificación incluye:

### 1. Overview
- Propósito del componente
- Contexto de uso
- Dependencias

### 2. V0 Prompt
- Prompt completo y optimizado para v0.dev
- Incluye todos los detalles necesarios

### 3. Functional Requirements
- Comportamientos esperados
- Estados del componente
- Interacciones del usuario

### 4. Design Specifications
- Layout y estructura
- Colores y tipografía
- Responsive breakpoints
- Animaciones

### 5. Data Structure
- Props/interfaces TypeScript
- Ejemplos de datos
- Validaciones

### 6. Integration Notes
- APIs a consumir
- Dependencias de otros componentes
- Consideraciones de estado global

## 🔄 Workflow Recomendado

1. **Fase 1: Definición** (Aquí con Antigravity)
   - Crear/actualizar especificaciones
   - Definir estructura de datos
   - Establecer requisitos funcionales

2. **Fase 2: Implementación** (v0.dev)
   - Copiar prompt a v0.dev
   - Generar componente base
   - Iterar sobre el diseño visual

3. **Fase 3: Integración** (Proyecto)
   - Copiar código generado
   - Conectar con APIs/datos reales
   - Testing y ajustes finales

## 📊 Estado de Especificaciones

- ✅ Completo y listo para v0
- 🚧 En progreso
- ⏳ Pendiente

### Landing Pages
- 🚧 Header
- 🚧 Hero
- ⏳ Platform Selector
- ⏳ Pricing Cards
- ⏳ Features
- ⏳ FAQ

### Auth Pages
- ⏳ Login
- ⏳ Register
- ⏳ Password Recovery

### Dashboards
- ⏳ Vendor Dashboard
- ⏳ Operator Dashboard
- ⏳ Admin Dashboard

## 💡 Tips para V0

1. **Sé específico**: Incluye detalles de colores, tamaños, espaciado
2. **Usa ejemplos**: Proporciona datos de ejemplo realistas
3. **Define estados**: Especifica loading, error, empty states
4. **Menciona responsive**: Indica breakpoints y comportamiento mobile
5. **Incluye interacciones**: Hover, click, focus states
6. **Referencia componentes**: Menciona shadcn/ui components cuando aplique

## 🔗 Referencias

- [v0.dev](https://v0.dev)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Next.js](https://nextjs.org/)
