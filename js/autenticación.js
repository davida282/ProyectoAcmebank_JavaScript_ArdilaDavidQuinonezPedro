// Se importa el firebase a autenticación.js 

import { db } from './firebaseConfig.js';
import { get, ref,  } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

// Se obtienen las constantes desde las ID propuestas en el HTML

const form = document.getElementById('loginForm');

const tipoDocInput = document.getElementById('tipoDoc');

const documentoInput = document.getElementById('documento');

// Este Evento permite solamente números en el input y limíta a 10 caracteres

documentoInput.addEventListener('input', (e) => {
  e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
    });
    
const contrasenaInput = document.getElementById('contrasena');

// Evento que evita que el formulario racargue la página al enviarlo

form.addEventListener('submit', async (e) => {
  e.preventDefault(); 

  // Constantes que obtienen y limpian los valores de los inputs

 const tipoDoc = tipoDocInput.value;
  const documento = documentoInput.value.trim();
  const contrasena = contrasenaInput.value.trim();
  
  // Condicional que alerta que si los campos se encuentran vacios no puede avanzar 

  if (documento === "" || contrasena === "" || tipoDoc === "▼" || tipoDoc === "" ) {
    alert("Por favor, complete todos los campos para avanzar.");
    return;
  }
  
  // Se inicia el bloque de código que va a manejar los posibles errores que se van presentando

  try {
    const usuariosRef = ref(db, 'usuarios');
    const snapshot = await get(usuariosRef);
    
    // Se valida que el usuario solamente pueda escribir como máximo 10 dígitos numéricos

    const regexNumeros = /^\d{10}$/;
    if (!regexNumeros.test(documento)) {
    alert("🚫 El número de documento debe tener exactamente 10 dígitos numéricos.");
    return;
     }
    
    // Vertifica si los datos existen en el snapshot

    if (snapshot.exists()) {

      // Obtiene los datos de los usuarios desde Firebase

      const usuarios = snapshot.val();
      let accesoConcedido = false;

      // Recorre cada usuario en el objeto obtenido

      for (let key in usuarios) {
        const usuario = usuarios[key];

        // Verifica si los datos que ha ingresado el usuario coinciden con los datos registrados en el firebase

        if (usuario.documento === documento && usuario.contrasena === contrasena && usuario.tipoDocumento === tipoDoc) {
          accesoConcedido = true;

          
          // Guarda los datos del usuario que ha iniciado sesión en el almacenamiento local
          localStorage.setItem('usuarioActivo', JSON.stringify({
            id: key,
            nombres: usuario.nombres,
            numeroCuenta: usuario.numeroCuenta,
            apellidos: usuario.apellidos,
            fechaCreacion : usuario.fechaCreacion
          }));

          // Redirige a el dashboard una el accesoConcedido sea igual a True

          window.location.href = 'dashboard.html';
          break;
        }
      }

      // Si no se cumplieros las condiciones y son diferentes de acceso concedido, que alerte que el documento o contraseña son erroneos

      if (!accesoConcedido) {
        alert("Documento o contraseña incorrectos, ingrese los datos nuevamente.");
      }
      
      // Si directamente ninguno de los datos es valido y no hay ningún documento registrado, que alerte que no hay usuarios registrados en el sistema
    } else {
      alert("No hay usuarios registrados en el sistema con ese documento.");
    }
    
    // Si encontro algún error de backend, que alerte que ocurrió un error al iniciar sesión y muestre en la consola que tipo de error es

  } catch (error) {
    console.error("Error durante el login:", error);
    alert("Ocurrió un error al iniciar sesión.");
  }
});

// Si ya hay una sesión iniciada, evitar que vuelva al login con la flecha atrás
const usuarioActivo = localStorage.getItem('usuarioActivo');

if (usuarioActivo) {
  history.pushState(null, null, location.href); // reemplaza el estado actual
  window.addEventListener('popstate', function () {
    history.pushState(null, null, location.href); // impide retroceder
  });
}
// Si no hay usuarioActivo, evitar volver al dashboard con la flecha atrás
window.addEventListener('pageshow', function (event) {
  const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));

  // Si viene del dashboard y no hay sesión activa, redirige al login
  if (event.persisted && !usuarioActivo) {
    history.pushState(null, null, location.href); // Bloquea flecha atrás
    window.addEventListener('popstate', () => {
      history.pushState(null, null, location.href);
    });
  }
});

