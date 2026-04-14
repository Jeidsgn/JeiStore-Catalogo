function doGet(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. Obtener datos de Categorías
  const sheetCategorias = ss.getSheetByName('categorias');
  if (!sheetCategorias) return errorOut('Falta la hoja "categorias"');
  const catData = getSheetData(sheetCategorias);
  
  // 2. Obtener datos de Productos
  const sheetProductos = ss.getSheetByName('productos');
  if (!sheetProductos) return errorOut('Falta la hoja "productos"');
  const prodData = getSheetData(sheetProductos);

  // Procesamiento especial para los productos
  prodData.forEach(p => {
    // Transformar fotos_ids separados por comas en array
    if (p.fotos_ids) {
      if (typeof p.fotos_ids === 'string') {
        p.fotos_ids = p.fotos_ids.split(',').map(id => id.trim()).filter(id => id !== '');
      } else {
        p.fotos_ids = [String(p.fotos_ids).trim()];
      }
    } else {
      p.fotos_ids = [];
    }

    // Transformar tecnicas_materiales separados por comas en array
    if (p.tecnicas_materiales) {
      if (typeof p.tecnicas_materiales === 'string') {
        p.tecnicas_materiales = p.tecnicas_materiales.split(',').map(t => t.trim()).filter(t => t !== '');
      } else {
        p.tecnicas_materiales = [String(p.tecnicas_materiales).trim()];
      }
    } else {
      p.tecnicas_materiales = [];
    }

    // Limpiar video_url (dejar vacío si la celda está en blanco)
    if (p.video_url !== undefined) {
      p.video_url = String(p.video_url).trim();
      if (p.video_url === '' || p.video_url === '0') p.video_url = '';
    } else {
      p.video_url = '';
    }

    // Asegurar que 'disponible' sea interpretado como boolean
    if (p.disponible !== undefined) {
      p.disponible = (p.disponible === true || String(p.disponible).toUpperCase() === 'TRUE');
    }
  });

  const response = {
    categorias: catData,
    productos: prodData
  };

  // Convertir la estructura a un string en formato JSON y devolver
  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

// Función auxiliar que recicla las filas en objetos con los nombres de tus columnas
function getSheetData(sheet) {
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return []; // Si no hay datos, retornar vacío
  
  const headers = data[0].map(h => h.toString().toLowerCase().trim());
  const rows = data.slice(1);
  
  const result = [];
  rows.forEach(row => {
    // Omitir si la fila en el campo ID está totalmente vacía
    if (row[0] === "" || row[0] === null) return;
    
    let obj = {};
    for (let i = 0; i < headers.length; i++) {
      let key = headers[i];
      if (key !== "") {
        obj[key] = row[i];
      }
    }
    result.push(obj);
  });
  
  return result;
}

// Manejador de errores simple
function errorOut(msg) {
  return ContentService.createTextOutput(JSON.stringify({ error: msg }))
    .setMimeType(ContentService.MimeType.JSON);
}
