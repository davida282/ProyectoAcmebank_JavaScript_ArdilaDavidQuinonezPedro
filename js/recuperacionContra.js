// Se importa el firebase a recuperacionContra.js

import { db } from './firebaseConfig.js';
import { get, ref, update } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

// Espera a que el DOM esté completamente cargado antes de ejecutar el código
document.addEventListener("DOMContentLoaded", () => {

  // Se obtienen las constantes desde las ID propuestas en el HTML
  const formulario = document.getElementById("recuperarForm");
  const inputDocumento = document.getElementById("documento");

inputDocumento.addEventListener("input", (e) => {
  // Quita cualquier letra y limita a 10 números
  e.target.value = e.target.value.replace(/\D/g, "").slice(0, 10);
});

  formulario.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Constantes que obtienen y limpian los valores de los inputs
    const documento = document.getElementById("documento").value.trim();
    const tipoDoc = document.getElementById("tipoDoc").value.trim();
    const correo = document.getElementById("correo").value.trim();

    // Si alguno de los campos está vacio, la página le tira una alerta
    if (!documento || !tipoDoc || tipoDoc === "▼" || !correo) {
      alert("Por favor, complete todos los campos antes de continuar.");
      return;
    }

    // Se inicia el bloque de código que va a manejar los posibles errores que se van presentando
    try {
      const usuariosRef = ref(db, 'usuarios');
      const snapshot = await get(usuariosRef);

      if (snapshot.exists()) {
        const usuarios = snapshot.val();
        let usuarioEncontrado = null;
        let userId = null;

        // Recorre el documenti, tipo de documento e email para validar que se encuentre en el firebsae, en caso de si encontrarse, el usuario se encuentra
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
    
        // Si el usuario fué encontrado lo redirige a nuevaContra
        if (usuarioEncontrado) {
            sessionStorage.setItem('recuperacionValida', 'true');
            window.location.href = `/screens/nuevaContra.html?uid=${userId}`;
          // Usuario válido, redirigir
          window.location.href = `/screens/nuevaContra.html?uid=${userId}`;

          // Si los datos no coinciden, la página tira una alerta
        } else {
          alert("Los datos no coinciden con ningún usuario registrado.");
        }

        // Si ninguno de los datos coincide, la página menciona que no se encuentran los usuarios en el firebase
      } else {
        alert("No hay usuarios registrados en la base de datos.");
      }

    } catch (error) {
      console.error("Error al verificar los datos:", error);
      alert("Ocurrió un error al verificar los datos. Intenta más tarde.");
    }
  });
});