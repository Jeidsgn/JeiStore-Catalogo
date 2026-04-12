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
    // Transformar los IDs separados por comas en una lista real para JavaScript
    if (p.fotos_ids) {
      if (typeof p.fotos_ids === 'string') {
         p.fotos_ids = p.fotos_ids.split(',').map(id => id.trim()).filter(id => id !== '');
      } else {
         p.fotos_ids = [String(p.fotos_ids).trim()]; 
      }
    } else {
      p.fotos_ids = [];
    }
    
    // Asegurar que 'disponible' sea interpretado como boolean (verdadero o falso)
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
