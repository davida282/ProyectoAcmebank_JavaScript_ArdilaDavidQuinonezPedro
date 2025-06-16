import { db } from './firebaseConfig.js';
import { get, update, ref } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("recuperarForm");
  const inputContrasena = document.getElementById("contrasena");
  const inputConfirmar = document.getElementById("confirmarContra");

  // ❌ Bloquear entrada directa
  const accesoValido = sessionStorage.getItem('recuperacionValida');
  if (accesoValido !== 'true') {
    alert("🚫 No puedes acceder a esta página directamente.");
    window.location.href = "/html/login.html";
    return;
  }

  // 🔒 Bloquear navegación atrás
  history.pushState(null, null, location.href);
  window.addEventListener('popstate', () => {
    history.pushState(null, null, location.href);
  });

  // 🛡️ Limitar longitud máxima en tiempo real
  [inputContrasena, inputConfirmar].forEach(input => {
    input.addEventListener('input', () => {
      if (input.value.length > 16) {
        input.value = input.value.slice(0, 16);
      }
    });
  });

  // 🔍 Extraer UID de la URL
  const urlParams = new URLSearchParams(window.location.search);
  const uid = urlParams.get("uid");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nuevaContra = inputContrasena.value.trim();
    const confirmarContra = inputConfirmar.value.trim();

    if (!nuevaContra || !confirmarContra) {
      alert("⚠️ Por favor, complete ambos campos de contraseña.");
      return;
    }

    if (nuevaContra.length < 8) {
      alert("🔒 La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (nuevaContra !== confirmarContra) {
      alert("❌ Las contraseñas no coinciden.");
      return;
    }

    if (!uid) {
      alert("⚠️ No se encontró el usuario. Intente nuevamente desde el inicio.");
      return;
    }

    try {
      const userRef = ref(db, `usuarios/${uid}`);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        const usuario = snapshot.val();
        const contraActual = usuario.contrasena;

        if (contraActual === nuevaContra) {
          alert("⚠️ La nueva contraseña no puede ser igual a la contraseña actual.");
          return;
        }

        await update(userRef, { contrasena: nuevaContra });

        // ✅ Todo bien, borrar el acceso temporal
        sessionStorage.removeItem('recuperacionValida');

        alert("✅ Contraseña cambiada con éxito.");
        window.location.href = "/html/login.html";
      } else {
        alert("❌ No se encontró el usuario.");
      }

    } catch (error) {
      console.error("❌ Error al actualizar la contraseña:", error);
      alert("❌ Ocurrió un error al cambiar la contraseña. Intenta más tarde.");
    }
  });
});
