import { db } from './firebaseConfig.js';
import { get, ref } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

window.addEventListener('DOMContentLoaded', async () => {
  const tablaTransacciones = document.getElementById('tabla-transacciones');
  const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));
  const filtros = JSON.parse(localStorage.getItem('filtrosExtracto'));

  if (!usuarioActivo || !filtros) {
    alert("⛔ Información incompleta. Redirigiendo al login.");
    window.location.href = "/html/login.html";
    return;
  }

  try {
    const transaccionesRef = ref(db, `transacciones/${usuarioActivo.numeroCuenta}`);
    const snapshot = await get(transaccionesRef);

    if (!snapshot.exists()) {
      tablaTransacciones.innerHTML = `<tr><td colspan="5">No se encontraron transacciones.</td></tr>`;
      setTimeout(() => window.location.href = "/html/dashboard.html", 3000);
      return;
    }

    const transacciones = Object.values(snapshot.val());

    // Filtrar por año y mes
    const transFiltradas = transacciones.filter(tx => {
      const fecha = new Date(tx.fecha);
      const añoTx = fecha.getFullYear();
      const mesTx = fecha.getMonth() + 1; // 0-indexed
      return añoTx == filtros.anio && mesTx == parseInt(filtros.mes);
    });

    if (transFiltradas.length === 0) {
      tablaTransacciones.innerHTML = `<tr><td colspan="5">No hay movimientos registrados para ese mes y año.</td></tr>`;
      setTimeout(() => window.location.href = "/html/dashboard.html", 3000);
      return;
    }

    // Ordenar por fecha descendente
    transFiltradas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    transFiltradas.forEach(tx => {
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

  } catch (error) {
    console.error("❌ Error al obtener el extracto:", error);
    alert("Hubo un error al cargar el extracto.");
    window.location.href = "/html/dashboard.html";
  }
});

// Botón de volver al dashboard
document.getElementById('volver').addEventListener('click', () => {
  window.location.href = "/html/dashboard.html";
});

// Botón de imprimir
document.getElementById('btnImprimir').addEventListener('click', () => {
  window.print();
});
