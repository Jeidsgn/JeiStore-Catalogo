// ============================================================
// 1. DATOS ESTÁTICOS (MVP)
//    Estructura exactamente igual a la que devolverá Google Apps Script
//    Más adelante reemplazarás este bloque por un fetch() a tu Web App
// ============================================================
const STATIC_DATA = {
  categorias: [
    { id: 1, nombre: "Tulas", descripcion: "Iluminación cálida y artesanal", orden: 1 },
    { id: 2, nombre: "Sombreros", descripcion: "Diseño minimalista para plantas", orden: 2 },
    { id: 3, nombre: "Máscaras", descripcion: "Arte textil y abstracto", orden: 3 }
  ],
  productos: [
    {
      id: 101,
      categoria_id: 1,
      nombre: "Lámpara Aro",
      descripcion_larga: "Estructura metálica en acabado negro mate. Pantalla de lino natural. Altura 35cm, diámetro 25cm. Bombilla LED incluida (3000K). Ideal para mesitas o consolas.",
      fotos_ids: ["lampara_aro_1", "lampara_aro_2"],  // Estos IDs se usarán para generar URLs simuladas
      orden: 1,
      precio: 120000,
      disponible: true
    },
    {
      id: 102,
      categoria_id: 1,
      nombre: "Lámpara Nube",
      descripcion_larga: "Pantalla de algodón orgánico en forma de nube. Cable textil trenzado. Bombilla E27 (no incluida). Crea un ambiente muy suave y onírico.",
      fotos_ids: ["lampara_nube_1", "lampara_nube_2", "lampara_nube_3"],
      orden: 2,
      precio: 95000,
      disponible: false
    },
    {
      id: 201,
      categoria_id: 2,
      nombre: "Macetero Geo",
      descripcion_larga: "Cerámica esmaltada en tono terracota. Forma hexagonal. Medidas: 15cm alto x 12cm ancho. Incluye plato a juego. Ideal para suculentas o cactus.",
      fotos_ids: ["macetero_geo_1", "macetero_geo_2"],
      orden: 1,
      precio: 45000,
      disponible: true
    },
    {
      id: 202,
      categoria_id: 2,
      nombre: "Macetero Colgante",
      descripcion_larga: "Cuerda de algodón trenzada con maceta de barro cocido. Sostiene plantas de hasta 2kg. Longitud 60cm. Muy resistente para interiores.",
      fotos_ids: ["macetero_colgante_1"],
      orden: 2,
      precio: 38000,
      disponible: true
    },
    {
      id: 301,
      categoria_id: 3,
      nombre: "Composición Textil",
      descripcion_larga: "Tapiz tejido a mano en telar. Lana de oveja y fibras naturales. Tamaño 80x60cm. Bastidor de madera incluido. Colores: beige, arena y terracota.",
      fotos_ids: ["textil_1", "textil_2"],
      orden: 1,
      precio: 150000,
      disponible: false
    }
  ]
};

// Configuración (número de WhatsApp + mensaje base)
const CONFIG = {
  whatsappNumber: "573001234567",   // Código de país + número (sin '+' ni espacios)
  // La función para generar el mensaje se usa en detalle
};

// Helper para generar URL de imagen (simulada, porque en el MVP no tenemos imágenes reales)
// Esto luego se reemplazará por: `https://drive.google.com/uc?export=view&id=${fotoId}`
function getImageUrl(photoId) {
  // Para el MVP usamos imágenes placeholder de Unsplash con distintos colores según el ID
  // Así se ve visualmente distinto cada producto.
  const hash = Math.abs(photoId.split('').reduce((a, b) => a + b.charCodeAt(0), 0));
  const color = `bg=${hash % 360},80,70&fg=ffffff&text=${encodeURIComponent(photoId.slice(0, 8))}`;
  return `https://placehold.co/400x400?${color}`;
  // NOTA: Cuando tengas Google Drive, cambia por:
  // return `https://drive.google.com/uc?export=view&id=${photoId}`;
}

// Estado de la aplicación
let appData = STATIC_DATA;   // Más tarde: appData = await fetch(URL_SCRIPT).then(r=>r.json())

// Helper para escapar HTML (seguridad)
function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>]/g, function (m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  }).replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, function (c) {
    return c;
  });
}

// ============================================================
// 2. RENDERIZADO DE VISTAS (enrutamiento por hash)
// ============================================================
function renderCategorias() {
  const cats = appData.categorias.sort((a, b) => (a.orden || 0) - (b.orden || 0));
  const html = `
      <h1>Colecciones</h1>
      <div class="grid">
        ${cats.map(cat => `
          <div class="card" data-nav="categoria/${cat.id}">
            <div class="card-img" style="background:#eaeef3; display:flex; align-items:center; justify-content:center; font-size:3rem;">
              🖼️
            </div>
            <h3>${escapeHtml(cat.nombre)}</h3>
            <p>${escapeHtml(cat.descripcion || '')}</p>
          </div>
        `).join('')}
      </div>
    `;
  document.getElementById('app').innerHTML = html;
  attachCardNavigation();
}

function renderProductosPorCategoria(categoriaId) {
  const cat = appData.categorias.find(c => c.id == categoriaId);
  if (!cat) {
    renderCategorias();
    return;
  }
  const productosFiltrados = appData.productos
    .filter(p => p.categoria_id == categoriaId)
    .sort((a, b) => (a.orden || 0) - (b.orden || 0));

  const html = `
      <button class="back-button" data-nav="/">← Volver a categorías</button>
      <h1>${escapeHtml(cat.nombre)}</h1>
      <div class="grid">
        ${productosFiltrados.map(prod => {
    const primeraFoto = prod.fotos_ids[0] || '';
    const imgUrl = primeraFoto ? getImageUrl(primeraFoto) : '';
    return `
            <div class="card" data-nav="producto/${prod.id}">
              <div class="card-img-container">
                <img class="card-img" src="${imgUrl}" alt="${escapeHtml(prod.nombre)}" loading="lazy">
                <span class="tag ${prod.disponible ? 'tag-disponible' : 'tag-agotado'}">${prod.disponible ? 'Disponible' : 'Agotado'}</span>
              </div>
              <h3>${escapeHtml(prod.nombre)}</h3>
            </div>
          `;
  }).join('')}
      </div>
    `;
  document.getElementById('app').innerHTML = html;
  attachCardNavigation();
}

function renderDetalleProducto(productoId) {
  const prod = appData.productos.find(p => p.id == productoId);
  if (!prod) {
    renderCategorias();
    return;
  }
  const categoriaId = prod.categoria_id;
  // Generar galería de imágenes
  const imagenesHtml = prod.fotos_ids.map(fid => `
      <img src="${getImageUrl(fid)}" alt="${escapeHtml(prod.nombre)}" loading="lazy">
    `).join('');

  const formatPrecio = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(prod.precio || 0);

  const mensaje = prod.disponible ? `Hola, me interesa ${prod.nombre}` : `Hola, me gustaría saber si volverán a tener disponible ${prod.nombre}`;
  const whatsappUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(mensaje)}`;

  const botonHtml = prod.disponible 
    ? `<a href="${whatsappUrl}" target="_blank" class="whatsapp-btn">📲 Hacer pedido</a>`
    : `<a href="${whatsappUrl}" target="_blank" class="whatsapp-btn btn-agotado">Consultar disponibilidad</a>`;

  const html = `
      <button class="back-button" data-nav="categoria/${categoriaId}">← Volver a productos</button>
      <div class="product-detail">
        <div class="detail-gallery">
          ${imagenesHtml}
        </div>
        <h1>${escapeHtml(prod.nombre)}</h1>
        <div class="product-meta">
          <span class="price">${formatPrecio}</span>
          <span class="tag detail-tag ${prod.disponible ? 'tag-disponible' : 'tag-agotado'}">${prod.disponible ? 'Disponible' : 'Agotado'}</span>
        </div>
        <div class="product-description">${escapeHtml(prod.descripcion_larga || '').replace(/\n/g, '<br>')}</div>
        ${botonHtml}
      </div>
    `;
  document.getElementById('app').innerHTML = html;
  attachCardNavigation();
}

// Función que agrega eventos a cualquier elemento con data-nav
function attachCardNavigation() {
  document.querySelectorAll('[data-nav]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const navPath = el.getAttribute('data-nav');
      if (navPath) {
        window.location.hash = navPath;
      }
    });
  });
}

// Enrutador principal (lee hash)
function router() {
  const hash = window.location.hash.slice(1) || '/';
  const parts = hash.split('/');
  const route = parts[0];
  const id = parts[1];

  if (route === 'categoria' && id) {
    renderProductosPorCategoria(parseInt(id));
  } else if (route === 'producto' && id) {
    renderDetalleProducto(parseInt(id));
  } else {
    renderCategorias();
  }
}

// ============================================================
// 3. CARGA DE DATOS (ahora estáticos, luego dinámicos)
//    Aquí es donde conectarás con Google Apps Script
// ============================================================
async function loadData() {
  // ==== PARA EL MVP: datos estáticos inmediatos ====
  // Más adelante, descomenta y borra la línea de STATIC_DATA:
  /*
  try {
    const response = await fetch('https://script.google.com/macros/s/TU_ID/exec');
    if (!response.ok) throw new Error('Error en la red');
    appData = await response.json();
  } catch (error) {
    console.error('Falló la carga desde Google Apps Script, usando datos estáticos de respaldo', error);
    appData = STATIC_DATA;
  }
  */
  appData = STATIC_DATA;  // <-- Reemplazar por fetch cuando tengas la API
  router(); // una vez cargados, renderizar según hash actual
}

// Escuchar cambios de hash
window.addEventListener('hashchange', router);

// Iniciar
loadData();
