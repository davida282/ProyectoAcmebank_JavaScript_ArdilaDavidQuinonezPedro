import { db } from './firebaseConfig.js';
import { get, ref } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

window.addEventListener('DOMContentLoaded', () => {
  const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));

  if (!usuarioActivo) {
    alert("⚠️ No has iniciado sesión. Serás redirigido al login.");
    window.location.href = "login.html";
    return;
  }

  // Elementos del DOM
  const cuentaInput = document.getElementById('numCuenta');
  const nombreInput = document.getElementById('usuario');
  const anioInput = document.getElementById('anio');
  const mesSelect = document.getElementById('mes');
  const confirmarBtn = document.getElementById('confirmarBtn');

  // Autocompletar datos del usuario
  cuentaInput.value = usuarioActivo.numeroCuenta || '';
  nombreInput.value = `${usuarioActivo.nombres} ${usuarioActivo.apellidos}`.trim();

  confirmarBtn.addEventListener('click', async (e) => {
  e.preventDefault();

  const anio = anioInput.value.trim();
  const mes = mesSelect.value;

  if (!anio || isNaN(parseInt(anio)) || parseInt(anio) < 2000 || parseInt(anio) > 2099) {
    alert("🚫 Ingresa un año válido entre 2000 y 2099.");
    return;
  }

  if (!mes) {
    alert("📅 Selecciona un mes para generar el extracto.");
    return;
  }

  try {
    // Guardar los filtros seleccionados
    localStorage.setItem('filtrosExtracto', JSON.stringify({ anio, mes }));

    // Redirigir a la pantalla de resultado
    window.location.href = "/screens/resultExtracto.html";

  } catch (error) {
    console.error("❌ Error al generar el extracto:", error);
    alert("⚠️ Ocurrió un error al intentar obtener el extracto.");
  }
});
});
