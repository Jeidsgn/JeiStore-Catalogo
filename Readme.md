# Catálogo JeiStore

Catálogo virtual sin carrito para pequeños negocios. Navega por categorías, explora productos con galería de fotos y contacta directamente al vendedor por WhatsApp.

Alojado en **GitHub Pages** y gestionado desde **Google Sheets**.

---

## Estado del proyecto

✅ **Versión dinámica activa** — Los datos se cargan en tiempo real desde Google Sheets via Google Apps Script.

| Tecnología | Rol |
|---|---|
| **GitHub Pages** | Hosting del frontend (HTML, CSS, JS) |
| **Google Sheets** | Base de datos (categorías y productos) |
| **Google Drive** | Almacenamiento de imágenes |
| **Google Apps Script** | API que expone los Sheets como JSON |

---

## Estructura de archivos

```
├── index.html              # Esqueleto HTML (SPA)
├── styles.css              # Estilos globales
├── app.js                  # Lógica, enrutamiento y renderizado
├── Codigo_AppsScript.js    # Código del Web App (se pega en Apps Script)
├── Manual_Base_Datos.md    # Guía para gestionar el inventario en Sheets
└── Readme.md               # Este archivo
```

---

## Flujo de datos

```
Google Sheets (inventario)
        ↓
Google Apps Script (Web App → JSON)
        ↓
app.js fetch() → renderizado en el navegador
```

---

## Estructura de la base de datos (Google Sheets)

### Hoja `categorias`

| id | nombre | descripcion | orden |
|---|---|---|---|
| 1 | Tulas | Descripción corta | 1 |

### Hoja `productos`

| id | categoria_id | nombre | descripcion_larga | fotos_ids | orden | precio | disponible | tecnicas_materiales | video_url |
|---|---|---|---|---|---|---|---|---|---|
| 101 | 1 | Tula Playera | Descripción... | `ID1,ID2` | 1 | 85000 | TRUE | Tejido a mano, Fique | https://... |

- **`fotos_ids`**: IDs de Google Drive separados por coma. La imagen se sirve vía `drive.google.com/thumbnail?id=ID`.
- **`tecnicas_materiales`**: Técnicas o materiales separados por coma. Se muestran como etiquetas en la ficha del producto.
- **`video_url`**: URL a video en redes sociales (Instagram, TikTok, YouTube). **Opcional** — dejar vacío si no hay video.

---

## Configuración

Editar las dos variables en `app.js`:

```js
const CONFIG = {
  whatsappNumber: "57XXXXXXXXXX",   // Código de país + número, sin '+' ni espacios
  scriptUrl: "https://script.google.com/macros/s/..."  // URL de tu Web App publicada
};
```

---

## Actualizar el Apps Script

Cuando añadas nuevas columnas a la hoja `productos`, el script las recoge automáticamente (lee cabeceras dinámicamente). Solo necesitas actualizar el código manualmente si cambia la **lógica de parseo** de algún campo especial (actualmente: `fotos_ids`, `tecnicas_materiales`, `disponible`).

Pasos para publicar o republicar:
1. Abre el Apps Script desde Google Sheets → **Extensiones → Apps Script**.
2. Pega el contenido de `Codigo_AppsScript.js`.
3. **Implementar → Nueva implementación** (o _Administrar implementaciones_ para actualizar).
4. Tipo: **Web App** — Acceso: **Cualquier persona**.
5. Copia la URL y pégala en `CONFIG.scriptUrl` de `app.js`.

---

## Personalización

- **WhatsApp y API**: `CONFIG` al inicio de `app.js`.
- **Colores y fuentes**: Variables en `styles.css`.
- **Instagram del footer**: URL en `index.html`.

---

## Requisitos

- Cuenta de Google (Sheets, Drive, Apps Script).
- Repositorio en GitHub con Pages habilitado.
- No se necesita servidor ni dominio propio.

---

## Licencia

MIT. Libre de usar, modificar y distribuir.