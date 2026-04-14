// ============================================================
// 1. CONFIGURACIÓN
// ============================================================
const CONFIG = {
  whatsappNumber: "573134098921",   // Código de país + número (sin '+' ni espacios)
  scriptUrl: "https://script.google.com/macros/s/AKfycbyXYJXKXchISU02q1GCoK0_DLm8Oj6rPbPa6GdZwonm6fK_UfHvswWSTDc4gRivxpA/exec"
};

// Helper para generar URL de imagen desde Google Drive
function getImageUrl(photoId) {
  if (!photoId) return '';
  return `https://drive.google.com/thumbnail?id=${photoId.trim()}&sz=w1000`;
}

// Estado de la aplicación
let appData = { categorias: [], productos: [] };

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
      <h1>Colecciones Jei Store</h1>
      <div class="grid">
        ${cats.map(cat => {
    // Extraer la primera foto válida del primer producto de la categoría
    const primerProd = appData.productos.find(p => p.categoria_id == cat.id && p.fotos_ids && p.fotos_ids.length > 0);
    const imgHtml = primerProd
      ? `<img class="card-img" src="${getImageUrl(primerProd.fotos_ids[0])}" alt="${escapeHtml(cat.nombre)}" loading="lazy">`
      : `<div class="card-img" style="background:#eaeef3; display:flex; align-items:center; justify-content:center; font-size:3rem;">🖼️</div>`;

    return `
          <div class="card" data-nav="categoria/${cat.id}">
            ${imgHtml}
            <h3>${escapeHtml(cat.nombre)}</h3>
          </div>
        `}).join('')}
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
      ${cat.descripcion ? `<p class="category-description">${escapeHtml(cat.descripcion)}</p>` : ''}
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

  // Galería de imágenes
  const imagenesHtml = prod.fotos_ids.map(fid => `
      <img src="${getImageUrl(fid)}" alt="${escapeHtml(prod.nombre)}" loading="lazy">
    `).join('');

  const formatPrecio = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(prod.precio || 0);

  // Mensaje WhatsApp
  const catObj = appData.categorias.find(c => c.id == categoriaId);
  const nombreParaMsj = catObj ? `${prod.nombre} (${catObj.nombre})` : prod.nombre;
  const mensaje = prod.disponible
    ? `Hola, me interesa el artículo: ${nombreParaMsj}`
    : `Hola, me gustaría saber si volverán a tener disponible el artículo: ${nombreParaMsj}`;
  const whatsappUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(mensaje)}`;
  const botonHtml = prod.disponible
    ? `<a href="${whatsappUrl}" target="_blank" class="whatsapp-btn">📲 Hacer pedido</a>`
    : `<a href="${whatsappUrl}" target="_blank" class="whatsapp-btn btn-agotado">Consultar disponibilidad</a>`;

  // Técnicas y materiales (opcional)
  const tecnicasHtml = prod.tecnicas_materiales && prod.tecnicas_materiales.length > 0
    ? `<div class="product-tecnicas">
        <h2 class="section-label">Técnicas y materiales</h2>
        <ul class="tecnicas-list">
          ${prod.tecnicas_materiales.map(t => `<li>${escapeHtml(t)}</li>`).join('')}
        </ul>
      </div>`
    : '';

  // Video de proceso (opcional)
  const videoHtml = prod.video_url
    ? `<div class="product-video">
        <a href="${escapeHtml(prod.video_url)}" target="_blank" rel="noopener noreferrer" class="video-btn">🎬 Ver video del proceso</a>
      </div>`
    : '';

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
        ${tecnicasHtml}
        ${videoHtml}
        ${botonHtml}
      </div>
    `;
  document.getElementById('app').innerHTML = html;
  attachCardNavigation();

  // Activar zoom de imágenes en el modal
  document.querySelectorAll('.detail-gallery img').forEach(img => {
    img.addEventListener('click', (e) => {
      const modal = document.getElementById('image-modal');
      const modalImg = document.getElementById('zoomed-image');
      if (modal && modalImg) {
        modal.style.display = "block";
        modalImg.src = e.target.src;
      }
    });
  });
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
// 3. CARGA DE DATOS (Dinámicos vía API)
// ============================================================
async function loadData() {
  const appEl = document.getElementById('app');
  try {
    const response = await fetch(CONFIG.scriptUrl);
    if (!response.ok) throw new Error(`Error HTTP ${response.status}`);
    appData = await response.json();
  } catch (error) {
    console.error('Error al conectar con Google Sheets:', error);
    if (appEl) appEl.innerHTML = `<p style="color:#ef4444;text-align:center;padding:4rem;">No se pudo cargar el catálogo. Intenta recargar la página.</p>`;
    return;
  }
  router();
}

// Escuchar cambios de hash
window.addEventListener('hashchange', router);

// Gestión del Modal Global
const globalModal = document.getElementById('image-modal');
const closeModalBtn = document.querySelector('.close-modal');

if (closeModalBtn) {
  closeModalBtn.addEventListener('click', () => {
    globalModal.style.display = "none";
  });
}

if (globalModal) {
  globalModal.addEventListener('click', (e) => {
    if (e.target === globalModal) {
      globalModal.style.display = "none";
    }
  });
}

// Iniciar
loadData();
