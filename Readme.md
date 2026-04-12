```markdown
# Galería Minimalista · Catálogo de productos

Sitio web tipo catálogo / tienda virtual (sin carrito) con vista por categorías, galería de productos y botón de contacto directo por WhatsApp.  
Desarrollado como **MVP estático**, preparado para evolucionar hacia un **backend dinámico gestionado desde Google Drive + Google Sheets + Apps Script**.

## Estado actual del proyecto

✅ **Versión actual: MVP estático**  
- Frontend completo con HTML, CSS y JavaScript puro.  
- Datos de ejemplo incluidos (categorías, productos, descripciones, IDs de imágenes simuladas).  
- Navegación por hash (compatible con GitHub Pages).  
- Botón "Hacer pedido" que abre WhatsApp con mensaje predefinido: `"Hola, me interesa [nombre del producto]"`.  
- Diseño minimalista tipo Notion (grid, tarjetas, galería de imágenes en detalle).  
- Totalmente responsive y autocontenido en un solo archivo `index.html`.

**Limitaciones actuales**:  
- Las imágenes son placeholders (no se integran con Google Drive).  
- Los datos son estáticos (cambios requieren editar el código).  
- No hay conexión con ningún servicio externo.

---

## Objetivo a futuro 🚀

Convertir el sitio en una **web dinámica autogestionable** usando únicamente servicios gratuitos:

| Componente | Rol futuro |
|------------|-------------|
| **Google Sheets** | Base de datos (categorías, productos, descripciones, IDs de fotos). |
| **Google Drive** | Almacenamiento de imágenes (subir y compartir públicamente). |
| **Google Apps Script** | API personalizada que lee Sheets y Drive, y devuelve JSON. |
| **GitHub Pages** | Sigue siendo el alojamiento del frontend. |

### Flujo futuro (dinámico)

1. El administrador edita los productos en **Google Sheets** (nombre, descripción, categoría, IDs de fotos).
2. Sube las imágenes a una carpeta de **Google Drive** y obtiene sus IDs.
3. Un **Web App de Google Apps Script** expone los datos en formato JSON.
4. El frontend (alojado en GitHub Pages) consume esa API y renderiza el catálogo dinámicamente.
5. Los cambios en la hoja de cálculo se reflejan en la web en pocos minutos.

---

## Estructura de datos (futura)

### Hoja `categorias`

| id | nombre      | descripcion_corta | orden |
|----|-------------|-------------------|-------|
| 1  | Lámparas    | Iluminación artesanal | 1 |

### Hoja `productos`

| id | categoria_id | nombre        | descripcion_larga | fotos_ids              | orden |
|----|--------------|---------------|-------------------|------------------------|-------|
| 1  | 1            | Lámpara Aro   | Metal y madera... | abc123, def456, ghi789 | 1     |

- `fotos_ids`: IDs de Google Drive separados por comas (sin espacios).  
- La imagen se muestra con: `https://drive.google.com/uc?export=view&id=ID`

---

## Pasos para migrar a la versión dinámica

Cuando estés listo para conectar con Google:

1. **Crea el spreadsheet** con las hojas `categorias` y `productos` (estructura arriba).
2. **Crea un proyecto de Google Apps Script** y pega el código proporcionado (en la documentación previa).
3. **Publica el script como Web App** (acceso: cualquiera). Copia la URL.
4. **En el frontend actual** (dentro de la función `loadData()`):
   - Reemplaza `appData = STATIC_DATA;` por el `fetch` a la URL del Web App.
   - Modifica `getImageUrl()` para que use `https://drive.google.com/uc?export=view&id=${photoId}`.
5. **Configura el número de WhatsApp** en la variable `CONFIG.whatsappNumber`.
6. **Sube tus imágenes a Drive**, compártelas públicamente y copia sus IDs en la columna `fotos_ids`.

---

## Requisitos técnicos

- **Actual**: navegador moderno (Chrome, Edge, Firefox, Safari).  
- **Futuro**: cuenta de Google (para Sheets, Drive y Apps Script) y repositorio en GitHub.  
- No se necesita servidor, base de datos propia ni dominio.

---

## Instalación y uso actual (MVP estático)

1. Clona o descarga el archivo `index.html`.
2. Ábrelo directamente en tu navegador o súbelo a GitHub Pages.
3. Explora la galería de ejemplo:
   - Categorías → Productos → Detalle del producto.
   - Prueba el botón de WhatsApp (simulado, mensaje personalizado).
4. Para modificar los datos de ejemplo, edita el objeto `STATIC_DATA` dentro del script.

---

## Personalización

- **Colores, fuentes y espaciado**: modifica las variables CSS en la etiqueta `<style>`.
- **Número de WhatsApp**: cambia `CONFIG.whatsappNumber`.
- **Mensaje del botón**: edita la línea `mensaje` dentro de `renderDetalleProducto()`.
- **Placeholder de imágenes**: actualiza la función `getImageUrl()`.

---

## Créditos

Desarrollado como solución híbrida (estática → dinámica) para pequeños negocios, emprendedores o artistas que necesitan un catálogo online sin costes de mantenimiento.

---

## Licencia

MIT. Libre de usar, modificar y distribuir.
```