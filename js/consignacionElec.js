import { db } from './firebaseConfig.js';
import { get, ref, update } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";


const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));

window.addEventListener('DOMContentLoaded', () => {
  const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));
if (!usuarioActivo) {
  alert("⚠️ No has iniciado sesión. Serás redirigido al login.");
  window.location.href = "login.html";
}

 const cuentaInput = document.getElementById('numCuenta');
  
  const nombreInput = document.getElementById('usuario');
  
  const cantidadInput = document.getElementById('cantidad');
// ✅ Validaciones EN TIEMPO REAL (se ejecutan desde el inicio)
nombreInput.addEventListener('input', () => {
  nombreInput.value = nombreInput.value.replace(/[^a-zA-ZÁÉÍÓÚáéíóúÑñ\s]/g, '');
});

cuentaInput.addEventListener('input', () => {
  cuentaInput.value = cuentaInput.value.replace(/\D/g, '');
});

cantidadInput.addEventListener('input', () => {
  cantidadInput.value = cantidadInput.value.replace(/[^0-9.]/g, '');
});
const confirmarBtn = document.getElementById('confirmarBtn');

confirmarBtn.addEventListener('click', async (e) => {
  e.preventDefault();

 
  

  const numeroCuenta = cuentaInput.value.trim();
  const nombreIngresado = nombreInput.value.trim().toLowerCase();
  const cantidad = cantidadInput.value.trim();

  // Validaciones básicas
  if (!numeroCuenta || !nombreIngresado || !cantidad) {
    alert("⚠️ Todos los campos son obligatorios.");
    return;
  }

  const regexCuenta = /^\d{16}$/;
  if (!regexCuenta.test(numeroCuenta)) {
    alert("🚫 El número de cuenta debe tener exactamente 16 dígitos numéricos.");
    return;
  }

  const regexNombre = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]+$/;
  if (!regexNombre.test(nombreIngresado)) {
    alert("🚫 El nombre de usuario solo puede contener letras y espacios.");
    return;
  }

  const cantidadNumerica = parseFloat(cantidad);

  if (isNaN(cantidadNumerica) || cantidadNumerica <= 0) {
    alert("🚫 La cantidad ingresada debe ser un número mayor a 0.");
    return;
  }

  try {
    // 🔍 Consultar la cuenta destino
    const destinoRef = ref(db, `usuarios/${numeroCuenta}`);
    const snapshotDestino = await get(destinoRef);

    if (!snapshotDestino.exists()) {
      alert("❌ El número de cuenta ingresado no existe.");
      return;
    }

    const datosDestino = snapshotDestino.val();
    const nombreRegistrado = `${datosDestino.nombres} ${datosDestino.apellidos}`.toLowerCase();

    if (nombreIngresado !== nombreRegistrado) {
      alert("❌ El nombre y apellido no coinciden con la cuenta.");
      return;
    }

    // 🛑 Evitar transferencias a uno mismo
    if (numeroCuenta === usuarioActivo.numeroCuenta.toString()) {
      alert("🚫 No puedes hacer una consignación a tu propia cuenta.");
      return;
    }

    // 🧮 Validar saldo del usuario activo
    const remitenteRef = ref(db, `usuarios/${usuarioActivo.numeroCuenta}`);
    const snapshotRemitente = await get(remitenteRef);

    if (!snapshotRemitente.exists()) {
      alert("⚠️ No se pudo verificar tu cuenta. Intenta iniciar sesión de nuevo.");
      return;
    }

    const datosRemitente = snapshotRemitente.val();

    if (cantidadNumerica > datosRemitente.saldo) {
      alert("💸 No tienes suficiente saldo para realizar esta consignación.");
      return;
    }

    // 💰 Realizar la transferencia
    const nuevoSaldoRemitente = datosRemitente.saldo - cantidadNumerica;
    const nuevoSaldoDestino = datosDestino.saldo + cantidadNumerica;

    // Actualizar ambos saldos en Firebase
    await update(ref(db, `usuarios/${usuarioActivo.numeroCuenta}`), {
      saldo: nuevoSaldoRemitente
    });

    await update(ref(db, `usuarios/${numeroCuenta}`), {
      saldo: nuevoSaldoDestino
    });

    alert(`✅ Consignación exitosa de $${cantidadNumerica.toLocaleString()} a ${datosDestino.nombres} ${datosDestino.apellidos}.`);
    
    setTimeout(() => {
   window.location.href = "/screens/completedConsign.html";
}, 1000); // 1 segundo

    // Puedes resetear el form si quieres
    cuentaInput.value = "";
    nombreInput.value = "";
    cantidadInput.value = "";

  } catch (error) {
    console.error("❌ Error durante la consignación:", error);
    alert("⚠️ Ocurrió un error al procesar la consignación.");
  }
});
});