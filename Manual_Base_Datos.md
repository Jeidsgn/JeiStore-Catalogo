# Manual de Base de Datos - JeiStore 📝

Esta guía explica paso a paso cómo gestionar el inventario del catálogo de forma dinámica usando herramientas gratuitas de Google (Sheets y Drive).

## 1. Configuración de Google Drive (Imágenes)

Debes organizar y almacenar tus fotos en Google Drive para que la página web pueda acceder a ellas públicamente.

1. **Crear carpeta:** Crea una carpeta en tu Google Drive exclusiva para el catálogo (ej: `Fotos JeiStore`).
2. **Formato:** Se recomienda usar **imágenes cuadradas** para que no se corten en el diseño visual de las tarjetas.
3. **Compartir:** Haz clic derecho sobre tu nueva carpeta -> `Compartir` -> Cambiar "Restringido" por **"Cualquier persona con el enlace"** con rol de "Lector". Esto es **obligatorio**.
4. **Obtener el ID de la foto:** Para poder referenciar imágenes en tu base de datos, no usarás todo el enlace general de compartir; usarás solo el *ID*.
   - Si creas un enlace para una foto, se verá parecido a esto:
     `https://drive.google.com/file/d/1wXYZ_AbCDef1234_hIJ56K/view?usp=sharing`
   - El **ID** de la foto es únicamente el código alfanumérico largo ubicado en el medio de la URL: **`1wXYZ_AbCDef1234_hIJ56K`**.

---

## 2. Estructura de Google Sheets (Base de Datos)

Debes crear un archivo de Google Sheets (hoja de cálculo) y prepararlo con estas dos pestañas (hojas) específicas ubicadas en la parte inferior del documento. **Es vital que los nombres de las pestañas estén en minúscula y tal como aparecen aquí.**

### Pestaña 1: `categorias`
En la primera fila (los encabezados) ingresa los siguientes nombres exactos:

| id | nombre | descripcion | orden |
| :--- | :--- | :--- | :--- |
| 1  | Tulas        | Descripción corta de las tulas | 1     |
| 2  | Sombreros    | Descripción corta para sombreros | 2     |

* **`id`:** Número identificador de categoría (debe ser único, ej: 1, 2, 3).
* **`nombre`:** El título principal de tu categoría.
* **`descripcion`:** Texto secundario visible bajo la miniatura de categoría.
* **`orden`:** El orden numérico para definir quién sale primero (1 será la que aparece más arriba).

### Pestaña 2: `productos`
Crea otra pestaña haciendo clic en el `+` de abajo, llámala `productos` y nombra la primera fila exactamente con estos encabezados:

| id | categoria_id | nombre | descripcion_larga | fotos_ids | orden | precio | disponible | tecnicas_materiales | video_url |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 101 | 1 | Tula Playera | Excelente material con bolsillos. | *`ID_foto1`*, *`ID_foto2`* | 1 | 85000 | TRUE | Tejido a mano, Fique natural | https://... |

* **`id`:** Identificador único numérico para este producto (ej: 101, 102).
* **`categoria_id`:** El número de la categoría a la que pertenece (el mismo número de la columna `id` de tu hoja `categorias`).
* **`nombre`:** Nombre completo a mostrar del producto.
* **`descripcion_larga`:** El contenido descriptivo principal (puedes usar la combinación `Alt + Enter` en Windows sobre una celda para separar líneas).
* **`fotos_ids`:** Los IDs de tu Google Drive separados **únicamente con coma** (ej: `1wXYZ,2aBCD,v7HjkL`).
* **`orden`:** Posición en la que quieres que salga en la vista de la categoría (1 sale de primeras).
* **`precio`:** Solo el valor numérico sin decimales (ej: `120000`). No pongas `$` ni puntos, la página le dará formato automáticamente.
* **`disponible`:** Ingresa `TRUE` (hay unidades) o `FALSE` (agotado).
* **`tecnicas_materiales`:** Lista de técnicas o materiales separados por coma (ej: `Tejido a mano, Fique natural, Tinte vegetal`). Se mostrará como etiquetas en la ficha del producto. **Dejar vacío si no aplica.**
* **`video_url`:** URL completa a un video del proceso en redes sociales (Instagram, TikTok, YouTube, etc.). Se mostrará como un botón "Ver video del proceso". **Dejar vacío si el producto no tiene video.**

---

## 3. Integración a Desarrollo

*El sistema actualmente usa datos fijos o estáticos simulando esta hoja exactamente tal cual para su presentación (en el archivo `app.js`).* 

Una vez que tengas esta plantilla terminada con los datos reales de prueba, usaremos la opción "Extensiones > Apps Script" en Google Sheets para crear la URL pública final que `app.js` leerá automáticamente.
