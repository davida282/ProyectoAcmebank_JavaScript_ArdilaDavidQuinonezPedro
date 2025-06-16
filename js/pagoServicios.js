// Se importa el firebase a pagoServicios.js

import { db } from './firebaseConfig.js';
import { get, ref, update, push } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

// Espera a que el DOM esté completamente cargado antes de ejecutar el código
window.addEventListener('DOMContentLoaded', () => {
  
  // Se obtienen las constantes desde las ID propuestas en el HTML
  const cuentaInput = document.getElementById('cuenta');
  const usuarioInput = document.getElementById('usuario');
  const servicioSelect = document.getElementById('servicio');
  const referenciaInput = document.getElementById('referencia');
  const cantidadInput = document.getElementById('cantidad');
  const form = document.querySelector('.formulario');

  // Este evento rectifica que la persona se encuentre como UsuarioActivo en el sistema, si el usuario no ha iniciado sesión, alerta que no ha iniciado sesión y redirije a login
  const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));

  if (!usuarioActivo) {
    alert("No hay sesión activa. Por favor inicia sesión.");
    window.location.href = "login.html";
    return;
  }

  cuentaInput.value = usuarioActivo.numeroCuenta || '';
  usuarioInput.value = `${usuarioActivo.nombres} ${usuarioActivo.apellidos}`.trim() || '';

  // Validar que referencia solo tenga números y máx. 10 dígitos
  referenciaInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
  });

  // Validar que cantidad solo tenga números
  cantidadInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '');
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const cuenta = cuentaInput.value.trim();
    const usuario = usuarioInput.value.trim();
    const servicio = servicioSelect.value;
    const referencia = referenciaInput.value.trim();
    const cantidad = cantidadInput.value.trim();

    if (!cuenta || !usuario || servicio === "Seleccionar servicio a pagar" || !referencia || !cantidad) {
      alert("Todos los campos son obligatorios. Por favor complétalos.");
      return;
    }

    if (referencia.length !== 10) {
      alert("La referencia del recibo debe tener exactamente 10 dígitos.");
      return;
    }

    const cantidadNumerica = parseInt(cantidad);
    const numeroReferencia = Math.floor(100000000 + Math.random() * 900000000);
    if (cantidadNumerica < 10000) {
      alert("El valor a pagar debe ser mínimo $10.000.");
      return;
    }

    // Se inicia el bloque de código que va a manejar los posibles errores que se van presentando
    try {
      const userRef = ref(db, `usuarios/${usuarioActivo.numeroCuenta}`);
      const userSnapshot = await get(userRef);

      if (!userSnapshot.exists()) {
        alert("No se encontró la cuenta del usuario.");
        return;
      }

      const userData = userSnapshot.val();

      if (userData.saldo < cantidadNumerica) {
        alert("Saldo insuficiente para realizar el pago.");
        return;
      }

      // Descontar el saldo
      const nuevoSaldo = userData.saldo - cantidadNumerica;

      await update(userRef, { saldo: nuevoSaldo });

      // Guardar transacción en el historial de Firebase
    const transaccionRef = ref(db, `transacciones/${usuarioActivo.numeroCuenta}`);
    await push(transaccionRef, {
    fecha: new Date().toISOString(),
    referencia: numeroReferencia,
    tipo: "Retiro",
    concepto: `Pago de servicio público ${servicio}`,
    valor: cantidadNumerica
    });
    // Guardar permiso y datos en localStorage
  localStorage.setItem('permisoServicio', 'true');
  localStorage.setItem('datosPagoServicio', JSON.stringify({
  fecha: new Date().toLocaleString(),
  referencia: numeroReferencia,
  servicio: servicio,
  valor: cantidadNumerica
}));

      // Redirección si todo sale bien
      window.location.href = "/screens/completedServicio.html";
    } catch (error) {
      console.error("Error al procesar el pago:", error);
      alert("Ocurrió un error al procesar el pago.");
    }
  });
});

