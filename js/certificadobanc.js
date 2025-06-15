import { db } from './firebaseConfig.js';
import { get, ref } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

const volverBtn = document.getElementById("volver");
const mensaje = document.getElementById("mensajeCertificado");
const numeroCuenta = document.getElementById("numeroCuenta");
const fechaApertura = document.getElementById("fechaApertura");

// ⛔ Proteger la vista
const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));

if (!usuarioActivo) {
  alert("⛔ No has iniciado sesión.");
  window.location.href = '/html/login.html';
}

const usuarioRef = ref(db, `usuarios/${usuarioActivo.id}`);

get(usuarioRef)
  .then(snapshot => {
    if (snapshot.exists()) {
      const datos = snapshot.val();

      const nombreCompleto = `${datos.nombres} ${datos.apellidos}`;
      mensaje.textContent = `BANCO ACME se permite informar que USUARIO ${nombreCompleto.toUpperCase()}, identificado con ${datos.tipoDocumento} ${datos.documento}, tiene con el banco los siguientes productos:`;

      numeroCuenta.textContent = datos.numeroCuenta;

      const fecha = new Date(datos.fechaCreacion);
      const fechaFormateada = fecha.toLocaleDateString('es-CO', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      });

      fechaApertura.textContent = fechaFormateada;
    } else {
      mensaje.textContent = "❌ No se encontraron datos del usuario.";
    }
  })
  .catch(error => {
    console.error("Error al obtener los datos:", error);
    mensaje.textContent = "❌ Error al cargar información del usuario.";
  });

volverBtn.addEventListener("click", () => {
  window.location.href = "/html/dashboard.html";
});