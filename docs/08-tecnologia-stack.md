# 8. Tecnología y Stack

## Stack Principal

### Frontend
- **Framework:** Next.js 15 (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS v4
- **Iconos:** Lucide React
- **Componentes:** Shadcn/ui (Radix UI)

### Backend & Base de Datos
- **Plataforma:** Supabase
- **Base de Datos:** PostgreSQL
- **Autenticación:** Supabase Auth (Email/Password + Social)
- **Almacenamiento:** Supabase Storage (Imágenes de perfil, comprobantes)

### Herramientas Adicionales
- **Diagramas:** Mermaid.js
- **Gestión de Estado:** React Context / Zustand (si es necesario)
- **Validación de Formularios:** React Hook Form + Zod

## Estructura del Proyecto

```
/app
  /(auth)       # Rutas de autenticación (login, register)
  /(public)     # Landing pages públicas (Trend Up, Trenzo)
  /(dashboard)  # Rutas protegidas (Vendor, Admin, Affiliate)
  /api          # Endpoints de API (Webhooks, integraciones)
/components
  /ui           # Componentes base (botones, inputs)
  /features     # Componentes específicos de negocio
/lib            # Utilidades y configuración (Supabase client)
/supabase       # Definiciones de tipos y migraciones
```
