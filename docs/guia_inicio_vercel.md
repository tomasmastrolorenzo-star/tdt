# Guía de Inicio y Configuración en Vercel (TDT Platform)

Esta guía detalla los pasos necesarios para configurar tu entorno en Vercel y comenzar con la implementación del sistema de créditos y la integración con JustAnotherPanel (JAP).

## 1. Resumen del Plan Técnico
Hemos diseñado un sistema robusto para manejar las transacciones de tus usuarios y conectarlas con el proveedor (JAP).
*   **Base de Datos (Supabase):** Guardará el saldo de los usuarios (`credits`), el historial de transacciones y los pedidos.
*   **API (Next.js):** Intermediario seguro. Cuando un usuario hace un pedido:
    1.  Verificamos su saldo en Supabase.
    2.  Descontamos los créditos.
    3.  Enviamos la orden a JAP automáticamente.
*   **Panel de Administración:** Te permitirá ver cuánto saldo tienes en JAP vs. cuántos créditos deben tus usuarios.

## 2. Configuración de Variables de Entorno en Vercel
Para que el sistema funcione, necesitamos conectar las "tuberías". Ve a tu proyecto en **Vercel > Settings > Environment Variables** y asegúrate de tener las siguientes claves:

### A. Supabase (Base de Datos)
Estas suelen configurarse automáticamente si usaste la integración de Vercel, pero verifícalas:
*   `NEXT_PUBLIC_SUPABASE_URL`: Tu URL de proyecto Supabase.
*   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Tu clave pública (segura para el navegador).
*   `SUPABASE_SERVICE_ROLE_KEY`: **CRÍTICO**. Esta clave permite al servidor modificar saldos. **Nunca la compartas**.

### B. JustAnotherPanel (Proveedor)
Necesitamos la API Key que solicitaste.
*   `JAP_API_KEY`: Pega aquí la API Key completa que te dé JustAnotherPanel.
*   `JAP_API_URL`: `https://justanotherpanel.com/api/v2` (Por defecto).

## 3. Próximos Pasos (Lo que haré yo)
Una vez confirmes que las variables están listas (especialmente la de Supabase, la de JAP puede esperar un poco si aún no llega), procederé a:

1.  **Crear la Base de Datos:** Ejecutaré un script para crear las tablas `credits`, `transactions` y `orders` en tu Supabase.
2.  **Programar la Conexión:** Crearé el código (`jap-client.ts`) que habla con JustAnotherPanel.
3.  **Crear el Servicio de Créditos:** La lógica matemática para sumar y restar dinero virtual de forma segura.

## 4. Instrucciones para ti
1.  **Verifica Vercel:** Entra a Vercel y confirma que el dominio `trenddigitaltrade.com` tiene el "check" verde ✅.
2.  **Variables:** Agrega las variables mencionadas arriba.
3.  **Confirma:** Avísame cuando hayas revisado esto para que yo empiece a escribir el código de la base de datos y la API.
