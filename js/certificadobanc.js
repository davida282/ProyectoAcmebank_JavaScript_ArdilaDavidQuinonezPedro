// Se importa el firebase a certificadobanc.js

import { db } from './firebaseConfig.js';
import { get, ref } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

// Se obtienen las constantes desde las ID propuestas en el HTML

const volverBtn = document.getElementById("volver");
const mensaje = document.getElementById("mensajeCertificado");
const numeroCuenta = document.getElementById("numeroCuenta");
const fechaApertura = document.getElementById("fechaApertura");

// Este evento rectifica que la persona se encuentre como UsuarioActivo en el sistema, si el usuario no ha iniciado sesión, alerta que no ha iniciado sesión y redirije a login

const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));

if (!usuarioActivo) {
  alert("No has iniciado sesión.");
  window.location.href = '/html/login.html';
}
// Crea una referencia en Firebase al usuario autenticado   

const usuarioRef = ref(db, `usuarios/${usuarioActivo.id}`);

// Este va a obtener los datos del usuario desde el firebase 

get(usuarioRef)
  .then(snapshot => {
    if (snapshot.exists()) { // Verifica si el snapchot tiene datos 
      const datos = snapshot.val(); // Extrae los datos del usuario

      // Construye el nombre completo del usuario
      const nombreCompleto = `${datos.nombres} ${datos.apellidos}`;
      //Muestra un mensaje con los datos del usuario y el mensaje de el certificado bancario

      mensaje.textContent = `BANCO ACME se permite informar que ${nombreCompleto.toUpperCase()}, identificado con ${datos.tipoDocumento} ${datos.documento}, tiene con el banco los siguientes productos:`;

      numeroCuenta.textContent = datos.numeroCuenta;
      
      // Convierte la fecha de creación a un formato más legible para el usuario
      const fecha = new Date(datos.fechaCreacion);
      const fechaFormateada = fecha.toLocaleDateString('es-CO', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      });

      fechaApertura.textContent = fechaFormateada;
      
      // Si no se encuentran datos del usuario de alguna forma que se escriba en la página que no se encontraron los datos
    } else {
      mensaje.textContent = "No se encontraron datos del usuario.";
    }
  })

  // Si ocurre un error en el backend entonces que ponga que ocurrio en la página y en consola se muestre la información del error
  .catch(error => {
    console.error("Error al obtener los datos:", error);
    mensaje.textContent = "Error al cargar información del usuario.";
  });

// Evento de botón que permite volver a el dashboard

volverBtn.addEventListener("click", () => {
  window.location.href = "/html/dashboard.html";
});

//Constante y evento que permiten imprimir la página

const imprimirBtn = document.getElementById("imprimir");

imprimirBtn.addEventListener("click", () => {
  window.print();
});