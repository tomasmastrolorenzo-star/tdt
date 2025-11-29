# 4. Sistema de Afiliados

![Flujo de Doble Comisión](/uploaded_image_1_1764210299307.png)

## Estructura de Códigos

![Estructura de Códigos](/uploaded_image_2_1764210299307.png)

**Formato:**
```
Landing Panel: trendup.com?ref=CODIGO123
Landing Agency: trenzo.agency?ref=CODIGO123
```

**Registro de Conversión:**
- Cookie/LocalStorage guarda el código por 30 días
- Si el usuario compra → Sistema asocia la venta al código
- Comisión se registra automáticamente

---

## Modelo de Comisiones

![Modelo de Comisiones](/uploaded_image_3_1764210299307.png)

### Tipo 1: Comisión por Referido de Vendedor

**Escenario:**
- Juan (afiliado) refiere a María
- María se registra como vendedora
- María genera $1,000 en ventas en su primer mes

**Comisión Juan:**
- 10% de las comisiones de María durante 6 meses
- María gana $400 (40% de $1,000) → Juan gana $40

### Tipo 2: Comisión por Venta Directa

**Escenario:**
- Juan comparte `trendup.com?ref=JUAN123`
- Cliente compra paquete de $100
- Costo del servicio: $40
- Margen: $60

**Comisión Juan:**
- 20% del margen = $12

---

## Dashboard del Afiliado

![Panel del Afiliado](/uploaded_image_4_1764210299307.png)

**Métricas Clave:**
- 📊 Clicks totales en link
- 👥 Referidos registrados
- 💰 Comisiones totales ganadas
- 💳 Saldo disponible para retiro
- 📈 Gráfico de performance mensual
