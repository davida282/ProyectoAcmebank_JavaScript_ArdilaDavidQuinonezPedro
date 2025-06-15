import { db } from './firebaseConfig.js';
import { get, ref, update } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.getElementById("recuperarForm");
  const inputDocumento = document.getElementById("documento");

inputDocumento.addEventListener("input", (e) => {
  // Quita cualquier letra y limita a 10 números
  e.target.value = e.target.value.replace(/\D/g, "").slice(0, 10);
});

  formulario.addEventListener("submit", async (e) => {
    e.preventDefault();

    const documento = document.getElementById("documento").value.trim();
    const tipoDoc = document.getElementById("tipoDoc").value.trim();
    const correo = document.getElementById("correo").value.trim();

    if (!documento || !tipoDoc || tipoDoc === "▼" || !correo) {
      alert("⚠️ Por favor, complete todos los campos antes de continuar.");
      return;
    }

    try {
      const usuariosRef = ref(db, 'usuarios');
      const snapshot = await get(usuariosRef);

      if (snapshot.exists()) {
        const usuarios = snapshot.val();
        let usuarioEncontrado = null;
        let userId = null;

        for (let key in usuarios) {
          const usuario = usuarios[key];
          if (
            usuario.documento === documento &&
            usuario.tipoDocumento === tipoDoc &&
            usuario.email === correo
          ) {
            usuarioEncontrado = usuario;
            userId = key; // este sería el número de cuenta
            break;
          }
        }

        if (usuarioEncontrado) {
          // ✅ Usuario válido, redirigir
          window.location.href = `/screens/nuevaContra.html?uid=${userId}`;
        } else {
          alert("🚫 Los datos no coinciden con ningún usuario registrado.");
        }
      } else {
        alert("⚠️ No hay usuarios registrados en la base de datos.");
      }

    } catch (error) {
      console.error("❌ Error al verificar los datos:", error);
      alert("❌ Ocurrió un error al verificar los datos. Intenta más tarde.");
    }
  });
});