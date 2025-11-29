# 7. Dashboard del Vendedor (Oficina Virtual)

![Dashboard del Vendedor](/uploaded_image_1764211404018.png)

## Secciones Principales

### 1. Overview
- **Tarjetas de métricas:**
  - Ventas del mes
  - Comisiones ganadas
  - Saldo disponible
  - Próximo pago estimado
- **Gráfico de rendimiento:** Últimos 6 meses

### 2. Calculadora de Ganancias

**UI Interactiva:**
```text
┌─────────────────────────────────────┐
│  💰 Calculadora de Ganancias        │
├─────────────────────────────────────┤
│  Precio de Venta:     $  [100.00]   │
│  Costo Proveedor:     $  [ 40.00]   │
│  ═══════════════════════════════════│
│  Margen Bruto:        $   60.00     │
│  Tu Comisión (40%):   $   24.00 ✅  │
│  Sistema (60%):       $   36.00     │
└─────────────────────────────────────┘
```
**Propósito:** Transparencia total para que el vendedor sepa cuánto gana antes de vender.

### 3. Cargar Ventas

**Formulario simple:**
- Seleccionar servicio (dropdown)
- Seleccionar calidad (Active/Premium/VIP)
- Cantidad
- Link del cliente (Instagram/TikTok)
- Notas adicionales (opcional)

**Botón:** "Crear Orden"

**Resultado:**
- Orden creada en sistema
- Notificación al operador
- Comisión calculada y agregada a "Pendiente"

### 4. Wallet

**Vista:**
```text
┌──────────────────────────────────────┐
│  💼 Mi Wallet                        │
├──────────────────────────────────────┤
│  💰 Balance Total:       $  500.00   │
│  ⏳ Pendiente:           $  200.00   │
│  ✅ Disponible:          $  300.00   │
│  📤 Retirado:            $ 1,200.00  │
├──────────────────────────────────────┤
│  [Solicitar Retiro] 💸               │
└──────────────────────────────────────┘
```

**Historial de Transacciones:**
- Tabla con fecha, concepto, monto, estado

### 5. Código de Afiliado

**Vista:**
```text
┌────────────────────────────────────────┐
│  🔗 Tu Código de Afiliado              │
├────────────────────────────────────────┤
│  Panel:  trendup.com?ref=JUAN123       │
│  [Copiar] [Compartir]                  │
│                                        │
│  Agency: trenzo.agency?ref=JUAN123     │
│  [Copiar] [Compartir]                  │
├────────────────────────────────────────┤
│  📊 Estadísticas:                      │
│  • 47 clicks este mes                  │
│  • 3 conversiones                      │
│  • $87 en comisiones                   │
└────────────────────────────────────────┘
```

### 6. Historial de Ventas

**Tabla completa:**

| Fecha | Servicio | Cliente | Estado | Comisión | Acción |
|-------|----------|---------|--------|----------|--------|
| 25/11 | IG Followers 1000 | @cliente1 | Completado | $24.00 | Ver |
| 24/11 | TT Likes 5000 | @cliente2 | En Progreso | $15.00 | Ver |

### 7. Materiales de Marketing

**Descargables:**
- Banners promocionales
- Plantillas de posts
- Scripts de venta
- FAQs para clientes
- Videos explicativos
