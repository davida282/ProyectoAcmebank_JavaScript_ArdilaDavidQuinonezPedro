// Se obtienen las constantes desde las ID propuestas en el HTML

const volverBtn = document.getElementById('volver');
const fechaSpan = document.getElementById('fecha');
const referenciaSpan = document.getElementById('referencia');
const tipoSpan = document.getElementById('tipoTransaccion');
const descripcionSpan = document.getElementById('descripcion');
const valorSpan = document.getElementById('valor');

//  Verificar si el usuario tiene sesión iniciada Y a oprimido el botón de enviar consignación 

const permiso = localStorage.getItem('permisoRetiro');

if (permiso !== 'true') {
  alert("No tienes permiso para acceder a esta página directamente.");
  window.location.href = "/html/dashboard.html";
} else {
  
  // Elimina el permiso de estar en la página una vez el usuario se retira de la página
  localStorage.removeItem('permisoRetiro');
}

// Constante que obtiene los datos del localStorage guardados desde retiroDinero.js
const datosTransaccion = JSON.parse(localStorage.getItem('datosRetiro'));

// Si hay datos de la transacción obtenidos desde el localStorage
if (datosTransaccion) {
  // Mostrar la fecha de el retiro
  fechaSpan.textContent = datosTransaccion.fecha;

  // Mostrar referencia de el retiro
  referenciaSpan.textContent = datosTransaccion.referencia;

  // Mostrar tipo y descripción de el retiro
  tipoSpan.textContent = "Retiro";
  descripcionSpan.textContent = "Retiro de dinero por canal electrónico";

  // Mostrar valor de el retiro
  valorSpan.textContent = parseFloat(datosTransaccion.valor).toLocaleString();

  // Elimina los datos de la consignación del almacenamiento
  localStorage.removeItem('datosRetiro');
  
  // Si no se cumplió la condición entonces que alerte que no se encontraron los datos de la transacción, y redirija a el dashboard.
} else {
  alert("No se encontraron datos del retiro. Serás redirigido.");
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
