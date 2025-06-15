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
const permiso = localStorage.getItem('permisoRetiro');

if (permiso !== 'true') {
  alert("🚫 No tienes permiso para acceder a esta página directamente.");
  window.location.href = "/html/dashboard.html";
} else {
  // ✅ Elimina el permiso apenas se usa
  localStorage.removeItem('permisoRetiro');
}

// 🕒 Obtener los datos desde localStorage (guardados desde retiroDinero.js)
const datosTransaccion = JSON.parse(localStorage.getItem('datosRetiro'));

if (datosTransaccion) {
  // 🗓 Mostrar fecha
  fechaSpan.textContent = datosTransaccion.fecha;

  // 🔢 Mostrar referencia
  referenciaSpan.textContent = datosTransaccion.referencia;

  // 📄 Mostrar tipo y descripción
  tipoSpan.textContent = "Retiro";
  descripcionSpan.textContent = "Retiro de dinero por canal electrónico";

  // 💰 Mostrar valor
  valorSpan.textContent = parseFloat(datosTransaccion.valor).toLocaleString();

  // 🧹 Limpiar localStorage
  localStorage.removeItem('datosRetiro');
} else {
  alert("⚠️ No se encontraron datos del retiro. Serás redirigido.");
  window.location.href = "/html/dashboard.html";
}

// 🔙 Volver al dashboard
volverBtn.addEventListener('click', () => {
  window.location.href = "/html/dashboard.html";
});
