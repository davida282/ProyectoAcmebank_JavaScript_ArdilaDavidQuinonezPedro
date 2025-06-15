import { db } from './firebaseConfig.js';
import { get, ref, update, push } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

window.addEventListener('DOMContentLoaded', () => {
  const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));

  if (!usuarioActivo) {
    alert("⚠️ No has iniciado sesión. Serás redirigido al login.");
    window.location.href = "login.html";
    return;
  }

  const cuentaInput = document.getElementById('numCuenta');
  const nombreInput = document.getElementById('usuario');
  const cantidadInput = document.getElementById('cantidad');
  const confirmarBtn = document.getElementById('confirmarBtn');

  // Autocompletar los datos del usuario activo
  cuentaInput.value = usuarioActivo.numeroCuenta || '';
  nombreInput.value = `${usuarioActivo.nombres} ${usuarioActivo.apellidos}`.trim();

  // Validación de cantidad
  cantidadInput.addEventListener('input', () => {
    cantidadInput.value = cantidadInput.value.replace(/[^0-9]/g, '');
  });

  confirmarBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    const cantidad = cantidadInput.value.trim();
    const cantidadNumerica = parseInt(cantidad);

    if (!cantidad || isNaN(cantidadNumerica) || cantidadNumerica <= 0) {
      alert("🚫 Ingresa un valor válido mayor a $0.");
      return;
    }

    if (cantidadNumerica < 10000) {
      alert("🚫 El valor mínimo de retiro es de $10.000.");
      return;
    }

    try {
      const userRef = ref(db, `usuarios/${usuarioActivo.numeroCuenta}`);
      const userSnapshot = await get(userRef);

      if (!userSnapshot.exists()) {
        alert("❌ No se encontró la cuenta del usuario.");
        return;
      }

      const userData = userSnapshot.val();

      if (cantidadNumerica > userData.saldo) {
        alert("💸 No tienes suficiente saldo para retirar esa cantidad.");
        return;
      }

      const nuevoSaldo = userData.saldo - cantidadNumerica;
      const referencia = Math.floor(1000000000 + Math.random() * 9000000000);

      // Actualizar saldo
      await update(userRef, { saldo: nuevoSaldo });

      // Guardar transacción como "Retiro"
      const transaccionRef = ref(db, `transacciones/${usuarioActivo.numeroCuenta}`);
      await push(transaccionRef, {
        fecha: new Date().toISOString(),
        referencia: referencia,
        tipo: "Retiro",
        concepto: "Retiro de dinero por canal electrónico",
        valor: cantidadNumerica
      });

      // Guardar datos para la pantalla de confirmación
      localStorage.setItem('datosRetiro', JSON.stringify({
        fecha: new Date().toLocaleString(),
        referencia: referencia,
        valor: cantidadNumerica
      }));

      localStorage.setItem('permisoRetiro', 'true');

      // Redirigir
      window.location.href = "/screens/completedRetiro.html";

    } catch (error) {
      console.error("❌ Error al procesar el retiro:", error);
      alert("⚠️ Hubo un error al procesar tu retiro.");
    }
  });
});
