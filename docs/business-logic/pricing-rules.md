# Pricing Rules & Commission Structure

## 💰 Overview
Este documento define la lógica de precios, márgenes y comisiones para el sistema TDT.
**Moneda Base:** USD (Dólares Americanos)

---

## 🏷️ Estructura de Precios (Trend Up Panel)

### 1. Instagram Followers
| Calidad | Cantidad | Precio Venta (PVP) | Costo Base (API) | Margen Bruto | Comisión Vendor | Net System Profit |
|---------|----------|--------------------|------------------|--------------|-----------------|-------------------|
| **Active** | 1,000 | $15.00 | $2.00 | $13.00 | 40% ($5.20) | $7.80 |
| **Premium** | 1,000 | $25.00 | $5.00 | $20.00 | 40% ($8.00) | $12.00 |
| **VIP** | 1,000 | $45.00 | $10.00 | $35.00 | 40% ($14.00) | $21.00 |

### 2. TikTok Followers
| Calidad | Cantidad | Precio Venta (PVP) | Costo Base (API) | Margen Bruto | Comisión Vendor | Net System Profit |
|---------|----------|--------------------|------------------|--------------|-----------------|-------------------|
| **Active** | 1,000 | $12.00 | $1.50 | $10.50 | 40% ($4.20) | $6.30 |
| **Premium** | 1,000 | $20.00 | $4.00 | $16.00 | 40% ($6.40) | $9.60 |

### 3. Likes & Views (Paquetes)
| Servicio | Cantidad | Precio Venta (PVP) | Costo Base | Margen | Comisión Vendor |
|----------|----------|--------------------|------------|--------|-----------------|
| IG Likes | 1,000 | $5.00 | $0.50 | $4.50 | 40% ($1.80) |
| IG Views | 10,000 | $8.00 | $0.20 | $7.80 | 40% ($3.12) |
| TT Views | 10,000 | $5.00 | $0.10 | $4.90 | 40% ($1.96) |

---

## 🤝 Reglas de Comisiones (Affiliates/Vendors)

### Vendor Standard
- **Comisión Base:** 40% del Margen Bruto (Profit).
- **Cálculo:** `(Precio Venta - Costo Base) * 0.40`
- **Pago Mínimo:** $50.00 acumulados.
- **Ciclo de Pago:** Semanal (Viernes).

### Vendor Elite (Top Performer)
- **Requisito:** +$1000 en ventas mensuales.
- **Comisión:** 50% del Margen Bruto.
- **Beneficios:** Pagos instantáneos, soporte prioritario.

### Referidos (Affiliate System)
- **Comisión:** 10% de las ganancias del vendor referido.
- **Duración:** De por vida mientras el referido esté activo.

---

## 🏆 Loyalty Program (Trend Rank)

Sistema de rangos basado en gasto histórico (`total_spend`) para incentivar retención.

| Rango | Requisito (Gasto Total) | Beneficio |
|-------|-------------------------|-----------|
| **Bronze** | $0 - $100 | Acceso estándar |
| **Silver** | $100 - $500 | **5% OFF** automático en todas las órdenes |
| **Gold** | > $500 | **10% OFF** automático + Soporte Prioritario |

*Nota: El descuento se aplica sobre el precio final antes de cupones.*

---

## 📉 Descuentos y Promociones

### Cupones
- **WELCOME10:** 10% OFF primera compra (Asumido por el Sistema).
- **FLASH20:** 20% OFF (50% asumido por Sistema, 50% por Vendor si opt-in).

### Wholesale (Mayoreo)
- **Bulk Orders:** Pedidos > $500 tienen 15% descuento automático.

---

## 🧮 Fórmulas de Sistema

### Profit Calculator
```typescript
const calculateProfit = (price: number, cost: number, vendorLevel: 'standard' | 'elite') => {
  const grossMargin = price - cost;
  const commissionRate = vendorLevel === 'elite' ? 0.50 : 0.40;
  
  const vendorProfit = grossMargin * commissionRate;
  const systemProfit = grossMargin - vendorProfit;
  
  return {
    grossMargin,
    vendorProfit,
    systemProfit
  };
}
```
