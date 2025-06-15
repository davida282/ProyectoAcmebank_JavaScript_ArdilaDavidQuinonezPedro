import { db } from './firebaseConfig.js';
import { get, ref } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

// 🔁 Obtener elementos del DOM
const volverBtn = document.getElementById('volver');
const fechaSpan = document.getElementById('fecha');
const referenciaSpan = document.getElementById('referencia');
const tipoSpan = document.getElementById('tipoTransaccion');
const descripcionSpan = document.getElementById('descripcion');
const valorSpan = document.getElementById('valor');
// ❌ Verificar si hay permiso para ver esta página
const permiso = localStorage.getItem('permisoConsignacion');

if (permiso !== 'true') {
  alert("🚫 No tienes permiso para acceder a esta página directamente.");
  window.location.href = "/html/dashboard.html";
} else {
  // ✅ Elimina el permiso apenas se usa
  localStorage.removeItem('permisoConsignacion');
}

// 🕒 Obtener los datos desde localStorage (guardados desde consignacionElec.js)
const datosTransaccion = JSON.parse(localStorage.getItem('datosConsignacion'));


if (datosTransaccion) {
  // 🗓 Mostrar fecha
  fechaSpan.textContent = datosTransaccion.fecha;

  // 🔢 Mostrar referencia
  referenciaSpan.textContent = datosTransaccion.referencia;

  // 📄 Mostrar tipo y descripción
  tipoSpan.textContent = "Consignación";
  descripcionSpan.textContent = "Consignación por canal electrónico";

  // 💰 Mostrar valor
  valorSpan.textContent = parseFloat(datosTransaccion.valor).toLocaleString();

  localStorage.removeItem('datosConsignacion');
} else {
  alert("⚠️ No se encontraron datos de la transacción. Serás redirigido.");
  window.location.href = "/html/dashboard.html";
}

// 🔙 Volver al dashboard
volverBtn.addEventListener('click', () => {
  window.location.href = "/html/dashboard.html";
});

const imprimirBtn = document.getElementById("imprimir");
imprimirBtn.addEventListener("click", () => {
  window.print();
});
