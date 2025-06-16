// Se importa el firebase a resumenTrans.js

import { db } from './firebaseConfig.js';
import { get, ref } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

// Espera a que el DOM esté completamente cargado antes de ejecutar el código
window.addEventListener('DOMContentLoaded', async () => {

  // Se obtienen las constantes desde las ID propuestas en el HTML
  const tablaTransacciones = document.getElementById('tabla-transacciones');
  const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));

  // Si el usuario no se encuentra en el Local Storage como usuario activo, la página dice con una alerta que no ha iniciado sesión y lo redirije a login
  if (!usuarioActivo) {
    alert("No has iniciado sesión.");
    window.location.href = '/html/login.html';
    return;
  }

  // Se inicia el bloque de código que va a manejar los posibles errores que se van presentando
  try {
    const transaccionesRef = ref(db, `transacciones/${usuarioActivo.id}`);
    const snapshot = await get(transaccionesRef);

    if (snapshot.exists()) {
      const transaccionesObj = snapshot.val();
      const transacciones = Object.values(transaccionesObj);

      // Ordenar por fecha descendente (más recientes primero)
      transacciones.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

      // Tomar solo las últimas 10
      const ultimas10 = transacciones.slice(0, 10);

      ultimas10.forEach(tx => {
        const fila = document.createElement('tr');

        const fecha = new Date(tx.fecha).toLocaleDateString('es-CO', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });

        fila.innerHTML = `
          <td>${fecha}</td>
          <td>${tx.referencia || 'N/A'}</td>
          <td>${tx.tipo || 'N/A'}</td>
          <td>${tx.concepto || 'Sin descripción'}</td>
          <td>$ ${Number(tx.valor).toLocaleString('es-CO')}</td>
        `;

        tablaTransacciones.appendChild(fila);
      });

    } else {
      const fila = document.createElement('tr');
      fila.innerHTML = `<td colspan="5">No se encontraron transacciones recientes.</td>`;
      tablaTransacciones.appendChild(fila);
    }

  } catch (error) {
    console.error("Error al cargar transacciones:", error);
    alert("Ocurrió un error al obtener las transacciones.");
  }
});

const volverBtn = document.getElementById('volver');
// Volver al dashboard
volverBtn.addEventListener('click', () => {
  window.location.href = "/html/dashboard.html";
});
// Botón de imprimir
document.getElementById('btnImprimir').addEventListener('click', () => {
  window.print();
});
