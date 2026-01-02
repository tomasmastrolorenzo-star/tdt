# Instrucciones de Actualización del Webhook (Google Sheets)

Como no tengo acceso directo a tu cuenta de Google, debes actualizar el script manualmente para recibir los nuevos datos del Analizador 2.0.

### Paso 1: Abrir Editor de Script
1. Ve a tu Google Sheet.
2. Clic en **Extensiones** > **Apps Script**.

### Paso 2: Reemplazar el Código
Borra el código anterior y pega este nuevo script que soporta los campos de Auditoría (Semáforo, Nicho, Verificación):

```javascript
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Parsear los datos enviados por el Analizador 2.0
    var data = JSON.parse(e.postData.contents);
    
    // Mapeo de Columnas (Asegúrate de tener estos encabezados en la Hoja 1)
    // A: Fecha
    // B: Username
    // C: Nicho
    // D: Tipo de Verificación (Interés)
    // E: Seguidores
    // F: Likes Promedio
    // G: Engagement Rate (ER%)
    // H: Estatus de Salud (CRITICAL/RISK/OPTIMAL)
    // I: Score Final
    // J: Diagnóstico (Título)

    sheet.appendRow([
      new Date(),                 // A
      data.username,              // B
      data.niche,                 // C
      data.verification_type,     // D
      "'" + data.follower_count,  // E (Comilla para forzar texto y evitar recortes)
      data.avg_likes,             // F
      data.engagement_rate + "%", // G
      data.health_status,         // H
      data.final_score,           // I
      data.pain_point             // J
    ]);

    return ContentService.createTextOutput(JSON.stringify({ 'result': 'success' })).setMimeType(ContentService.MimeType.JSON);
  } catch (e) {
    return ContentService.createTextOutput(JSON.stringify({ 'result': 'error', 'error': e })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
```

### Paso 3: Guardar y Desplegar (¡IMPORTANTE!)
1. Clic en el icono de **Guardar** (Disquete).
2. Clic en el botón azul **"Implementar"** (Deploy) > **"Nueva implementación"**.
3. En tipo, selecciona **"Aplicación web"**.
4. **IMPORTANTE**: En "Quién tiene acceso", selecciona **"Cualquier persona"** (Anyone).
5. Dale a "Implementar" y **COPIA la nueva URL** (si cambió) o confirma que sigue siendo la misma.

*(Nota: Si la URL cambia, avísame para actualizarla en el código).*
