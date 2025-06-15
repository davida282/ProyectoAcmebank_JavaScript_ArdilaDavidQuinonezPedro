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
const permiso = localStorage.getItem('permisoServicio');

if (permiso !== 'true') {
  alert("🚫 No tienes permiso para acceder a esta página directamente.");
  window.location.href = "/html/dashboard.html";
} else {
  // ✅ Elimina el permiso apenas se usa
  localStorage.removeItem('permisoServicio');
}

// 🕒 Obtener los datos desde localStorage (guardados desde el pago de servicio)
const datosTransaccion = JSON.parse(localStorage.getItem('datosPagoServicio'));

if (datosTransaccion) {
  // 🗓 Mostrar fecha
  fechaSpan.textContent = datosTransaccion.fecha;

  // 🔢 Mostrar referencia
  referenciaSpan.textContent = datosTransaccion.referencia;

  // 📄 Mostrar tipo y descripción
  tipoSpan.textContent = "Retiro";
  descripcionSpan.textContent = `Pago de servicio público ${datosTransaccion.servicio}`;

  // 💰 Mostrar valor
  valorSpan.textContent = parseFloat(datosTransaccion.valor).toLocaleString();

  localStorage.removeItem('datosPagoServicio');
} else {
  alert("⚠️ No se encontraron datos del pago. Serás redirigido.");
  window.location.href = "/html/dashboard.html";
}

// 🔙 Volver al dashboard
volverBtn.addEventListener('click', () => {
  window.location.href = "/html/dashboard.html";
});
