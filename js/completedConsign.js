// Se obtienen las constantes desde las ID propuestas en el HTML

const volverBtn = document.getElementById('volver');
const fechaSpan = document.getElementById('fecha');
const referenciaSpan = document.getElementById('referencia');
const tipoSpan = document.getElementById('tipoTransaccion');
const descripcionSpan = document.getElementById('descripcion');
const valorSpan = document.getElementById('valor');

//  Verificar si el usuario tiene sesión iniciada Y a oprimido el botón de enviar consignación 

const permiso = localStorage.getItem('permisoConsignacion');

if (permiso !== 'true') {
  alert("No tienes permiso para acceder a esta página directamente.");
  window.location.href = "/html/dashboard.html";
} else {

  // Elimina el permiso de estar en la página una vez el usuario se retira de la página

  localStorage.removeItem('permisoConsignacion');
}

// Constante que obtiene los datos del localStorage guardados desde consignacionElec.js
const datosTransaccion = JSON.parse(localStorage.getItem('datosConsignacion'));

// Si hay datos de la transacción obtenidos desde el localStorage

if (datosTransaccion) {
  // Mostrar fecha de la consignación
  fechaSpan.textContent = datosTransaccion.fecha;

  // Mostrar referencia de la consignación
  referenciaSpan.textContent = datosTransaccion.referencia;

  // Mostrar tipo y descripción de la consignación
  tipoSpan.textContent = "Consignación";
  descripcionSpan.textContent = "Consignación por canal electrónico";

  // Mostrar valor de la consignación
  valorSpan.textContent = parseFloat(datosTransaccion.valor).toLocaleString();

  // Elimina los datos de la consignación del almacenamiento
  localStorage.removeItem('datosConsignacion');
  
  // Si no se cumplió la condición entonces que alerte que no se encontraron los datos de la transacción, y redirija a el dashboard.
} else {
  alert("No se encontraron datos de la transacción. Serás redirigido.");
  window.location.href = "/html/dashboard.html";
}

// Evento que permite que el botón de volver regrese a el dashboard
volverBtn.addEventListener('click', () => {
  window.location.href = "/html/dashboard.html";
});

//Constante y evento que permiten imprimir la página
const imprimirBtn = document.getElementById("imprimir");
imprimirBtn.addEventListener("click", () => {
  window.print();
});
