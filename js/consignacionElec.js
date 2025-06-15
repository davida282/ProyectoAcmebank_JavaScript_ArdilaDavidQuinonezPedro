import { db } from './firebaseConfig.js';
import { get, ref } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

// Verificar si hay un usuario logueado
const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));

if (!usuarioActivo) {
  alert("⚠️ No has iniciado sesión. Serás redirigido al login.");
  window.location.href = "login.html"; // Cambia a tu archivo real de login
}

// Botón de confirmar (asegúrate que el botón tenga id="confirmarBtn")
const confirmarBtn = document.getElementById('confirmarBtn');

// Evento click al botón
confirmarBtn.addEventListener('click', async () => {
  const cuentaInput = document.getElementById('numCuenta'); // Asegúrate que el input tenga id="numCuenta"
  const numeroCuenta = cuentaInput.value.trim();

  if (numeroCuenta === "") {
    alert("⚠️ Por favor ingresa un número de cuenta.");
    return;
  }

  try {
    const usuarioRef = ref(db, `usuarios/${numeroCuenta}`);
    const snapshot = await get(usuarioRef);

    if (!snapshot.exists()) {
      alert("❌ El número de cuenta ingresado no existe.");
      return;
    }

    alert("✅ Cuenta válida. Podemos continuar...");
    // Aquí puedes continuar con la lógica de consignación después

  } catch (error) {
    console.error("⚠️ Error al verificar cuenta:", error);
    alert("❌ Ocurrió un error al verificar la cuenta.");
  }
});