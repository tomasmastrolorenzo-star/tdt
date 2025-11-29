# 6. Sistema Financiero y Wallet

![Ciclo de Vida de la Comisión](/uploaded_image_1764211129067.png)

## Arquitectura de Wallet

**Cada vendedor tiene:**
- **Balance Total:** Suma de todas las comisiones
- **Saldo Pendiente:** Comisiones de órdenes no completadas
- **Saldo Disponible:** Comisiones de órdenes completadas (retirable)
- **Saldo Retirado:** Historial de retiros hechos

**Ejemplo:**
```
Balance Total: $500
  ├─ Saldo Pendiente: $200 (órdenes en progreso)
  ├─ Saldo Disponible: $300 (órdenes completadas)
  └─ Saldo Retirado: $0
```

---

## Flujo de Acreditación

**Cronología:**
1. **Orden Creada** → Comisión calculada → Estado: `PENDING`
2. **Orden Asignada a Proveedor** → Estado: `IN_PROGRESS`
3. **Proveedor Completa** → Operador verifica → Estado: `COMPLETED`
4. **Sistema Acredita** → Comisión pasa a `AVAILABLE`
5. **Vendedor Solicita Retiro** → Estado: `WITHDRAWAL_REQUESTED`
6. **Finanzas Aprueba** → Pago procesado → Estado: `PAID`

---

## Métodos de Retiro

**Configurables:**
- 💳 Transferencia Bancaria
- 🪙 Crypto (USDT)

**Límites:**
- Retiro mínimo: $50
- Procesamiento: 24-48 horas
- Comisión del sistema: 3% (configurable)
