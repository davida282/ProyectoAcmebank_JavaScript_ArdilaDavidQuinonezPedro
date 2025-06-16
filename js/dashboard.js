// Se importa el firebase a dashboard.js 
import { db } from './firebaseConfig.js';
import { get, ref } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";


// Ejecuta la función cuando el DOM esté completamente cargado
window.addEventListener('DOMContentLoaded', async () => {
  const contenedorPrincipal = document.querySelector('main');

  // Obtener datos del usuario desde localStorage
  const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));

  // Si no se encuentra el usuario con una cuenta en sesión, entonces que le alerte que no ha iniciado sesión y lo redirija a el login
  if (!usuarioActivo) {
    alert("No has iniciado sesión.");
    window.location.href = '/html/login.html';
    return;
  }

  // Se inicia el bloque de código que va a manejar los posibles errores que se van presentando
  try {

    // Crea una referencia en Firebase al usuario autenticado
    const usuarioRef = ref(db, `usuarios/${usuarioActivo.id}`);

    // Obtiene los datos del usuario desde la base de datos de Firebase
    const snapshot = await get(usuarioRef);

    if (snapshot.exists()) {
      const datos = snapshot.val();

      // Formatear la fecha
      const fecha = new Date(datos.fechaCreacion);
      const fechaFormateada = fecha.toLocaleDateString('es-CO', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

      // Crear saludo personalizado
      const bienvenida = document.createElement('div');
      bienvenida.classList.add('bienvenida');
      bienvenida.textContent = `Bienvenido, ${datos.nombres}`;

      // Crear tarjeta con datos de cuenta
      const tarjeta = document.createElement('div');
      tarjeta.classList.add('tarjeta');
      tarjeta.innerHTML = `
        <h3>Mi cuenta de ACME - ${datos.nombres} ${datos.apellidos}</h3>
        <p class="numcuenta">${datos.numeroCuenta}</p>
        <p class="fechaCreacion">Cuenta creada el: ${fechaFormateada}</p>
        <p>Saldo Disponible</p>
        <p class="saldo">$ ${Number(datos.saldo).toLocaleString('es-CO')}</p>
      `;

      // Agregar al DOM
      document.body.insertBefore(bienvenida, contenedorPrincipal);
      contenedorPrincipal.appendChild(tarjeta);

    } else {
      alert("No se encontraron los datos del usuario.");
    }

  } catch (error) {
    console.error("Error al cargar los datos del usuario:", error);
    alert("Error al obtener información del usuario.");
  }
});
// Evitar que vuelva al dashboard después de cerrar sesión usando flechita
window.addEventListener('pageshow', function (event) {
  const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));

  // Si la página fue cargada desde la caché flecha atrás/adelante y no hay usuarioActivo, redirigir
  if (event.persisted && !usuarioActivo) {
    window.location.href = '/html/login.html';
  }
});


const cerrarSesionBtn = document.getElementById('cerrarSesion');

cerrarSesionBtn.addEventListener('click', (e) => {
  e.preventDefault();

  // Eliminar sesión
  localStorage.removeItem('usuarioActivo');

  // Redireccionar sin que quede en historial
  location.replace('/html/login.html');
});

// Selecciona todos los elementos con la clase accion, recorre cada y elemento y agrega un evento que permite que el usuario pueda ir a la página de su respectivo data-href
document.addEventListener("DOMContentLoaded", () => {
  const acciones = document.querySelectorAll(".accion");

  acciones.forEach(accion => {
    accion.addEventListener("click", () => {
      const destino = accion.getAttribute("data-href");
      if (destino) {
        window.location.href = destino;
      }
    });
  });
});