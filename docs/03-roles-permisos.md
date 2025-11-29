# 3. Roles y Permisos de Usuario

## Matriz de Roles

![Matriz de Roles y Permisos](/uploaded_image_1764209439870.png)

| Rol | Acceso | Funciones Principales | Dashboard |
|-----|--------|----------------------|-----------|
| **Vendedor** | Landing Panel + Agency | Generar ventas, usar código afiliado, ver comisiones | Oficina Virtual |
| **Operador de Tráfico** | Admin Panel | Coordinar órdenes de panel y agencia, asignar proveedores | Panel Operaciones |
| **Finanzas** | Admin Panel | Aprobar pagos, gestionar wallets, reportes financieros | Panel Finanzas |
| **Afiliado** | Código de referido | Promover landings, generar comisiones por referidos y servicios | Panel Afiliado |
| **Admin/Owner** | Full Access | Configuración del sistema, usuarios, reportes globales | Super Admin |

---

## Detalle de Roles

### Rol 2: Operador de Tráfico

**Función:** Coordinar la ejecución de órdenes entre clientes y proveedores.

![Traffic Operator Dashboard](/uploaded_image_1764209624274.png)

#### Permisos
- ✅ Ver todas las órdenes del sistema (panel + agencia)
- ✅ Asignar órdenes a proveedores
- ✅ Marcar órdenes como completadas
- ✅ Comunicarse con clientes (soporte)
- ✅ Gestionar refills/garantías
- ❌ No puede aprobar pagos
- ❌ No puede crear usuarios

#### Dashboard
- Vista de órdenes pendientes
- Vista de órdenes en progreso
- Vista de órdenes completadas
- Sistema de tickets/soporte
- Métricas de tiempo de entrega

### Rol 3: Finanzas

**Función:** Control total sobre flujo de dinero, wallet, y retiros.

![Finanzas Dashboard](/uploaded_image_0_1764210299307.png)

#### Permisos
- ✅ Ver todos los balances de wallets
- ✅ Aprobar/rechazar solicitudes de retiro
- ✅ Registrar pagos hechos
- ✅ Generar reportes financieros
- ✅ Ver comisiones de afiliados
- ✅ Configurar métodos de pago
- ❌ No puede crear órdenes
- ❌ No puede asignar proveedores

#### Dashboard
- Solicitudes de retiro pendientes
- Historial de pagos
- Balance general del sistema
- Reportes de ganancia por vendedor
- Reportes de comisiones de afiliados

### Rol 4: Afiliado

**Función:** Promover landings con código único, ganar comisiones.

#### Tipos de Comisiones
1. **Comisión por Referido:** Trae a un nuevo vendedor → Gana % de sus ventas
2. **Comisión por Servicio:** Cliente compra con su código → Gana % de la venta

#### Permisos
- ✅ Ver link de afiliado único
- ✅ Dashboard con estadísticas de referidos
- ✅ Ver comisiones ganadas
- ✅ Solicitar retiros
- ❌ No accede a sistema de órdenes

#### Posibilidades
- Un vendedor puede ser afiliado (código doble función)
- Un afiliado puro solo promueve, no vende directamente
