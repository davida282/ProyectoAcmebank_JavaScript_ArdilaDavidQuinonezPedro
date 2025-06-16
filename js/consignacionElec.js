// Se importa el firebase a consignacionElec.js 

import { db } from './firebaseConfig.js';
import { get, ref, update, push } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";



const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));

// Espera a que el DOM esté completamente cargado antes de ejectura el código
window.addEventListener('DOMContentLoaded', () => {

  // Obtiene el usuario almacenado en el localStorage
  const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));

  // Si no se encuentra el usuario con una cuenta en sesión, entonces que le alerte que no ha iniciado sesión y lo redirija a el login
if (!usuarioActivo) {
  alert("No has iniciado sesión. Serás redirigido al login.");
  window.location.href = "login.html";
}

// Se obtienen las constantes desde las ID propuestas en el HTML
 const cuentaInput = document.getElementById('numCuenta');
  
  const nombreInput = document.getElementById('usuario');
  
  const cantidadInput = document.getElementById('cantidad');

// Este Evento permite solamente letras en el input 
nombreInput.addEventListener('input', () => {
  nombreInput.value = nombreInput.value.replace(/[^a-zA-ZÁÉÍÓÚáéíóúÑñ\s]/g, '');
});

// Este Evento permite solamente números en el input y limíta a 10 caracteres
cuentaInput.addEventListener('input', () => {
  cuentaInput.value = cuentaInput.value.replace(/\D/g, '');
});

cantidadInput.addEventListener('input', () => {
  cantidadInput.value = cantidadInput.value.replace(/[^0-9.]/g, '');
});

// Constate que agarra el id obtenido del boton de confirmar del HTML
const confirmarBtn = document.getElementById('confirmarBtn');

// Agrega un evento al botón cuando se hace click
confirmarBtn.addEventListener('click', async (e) => {
  // Evita que el evento realice su acción predeterminada 
  e.preventDefault();

  // Obtiene y limpia los valores ingresados
  const numeroCuenta = cuentaInput.value.trim();
  const nombreIngresado = nombreInput.value.trim().toLowerCase();
  const cantidad = cantidadInput.value.trim();

  // Si el usuario deja alguno de los campos vacios, que la página le alerte que todos los campos son obligatorios
  if (!numeroCuenta || !nombreIngresado || !cantidad) {
    alert("Todos los campos son obligatorios.");
    return;
  }

  // Si el usuario ingresa menos de 16 digitos en el numero de cuenta, la página le alerta
  const regexCuenta = /^\d{16}$/;
  if (!regexCuenta.test(numeroCuenta)) {
    alert("El número de cuenta debe tener exactamente 16 dígitos numéricos.");
    return;
  }

  // Si el trata de ingresar cualquier otro dígito que no sean letras o espacios, la página le alerta 
  const regexNombre = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]+$/;
  if (!regexNombre.test(nombreIngresado)) {
    alert("El nombre de usuario solo puede contener letras y espacios.");
    return;
  }

  // Si el usuario ingresa un número menor o igual a cero, la página le alerta
  const cantidadNumerica = parseFloat(cantidad);

  if (isNaN(cantidadNumerica) || cantidadNumerica <= 0) {
    alert("La cantidad ingresada debe ser un número mayor a 0.");
    return;
  }

  // Se inicia el bloque de código que va a manejar los posibles errores que se van presentando
  try {
    // Consultar la cuenta destino
    const destinoRef = ref(db, `usuarios/${numeroCuenta}`);
    // Generar UNA vez la referencia
    const numeroReferencia = Math.floor(100000000 + Math.random() * 900000000);
    const snapshotDestino = await get(destinoRef);
  
    // Verifica que la cuenta a la que se enviara el dinero exista en el firebase, si no existe la alerta la página alerta
    if (!snapshotDestino.exists()) {
      alert("El número de cuenta ingresado no existe.");
      return;
    }

    const datosDestino = snapshotDestino.val();
    const nombreRegistrado = `${datosDestino.nombres} ${datosDestino.apellidos}`.toLowerCase();

    // Si el nombre ingresado no coincide con un nombre registrado en la base de datos
    if (nombreIngresado !== nombreRegistrado) {
      alert("El nombre y apellido no coinciden con la cuenta.");
      return;
    }

    // Evitar transferencias a uno mismo
    if (numeroCuenta === usuarioActivo.numeroCuenta.toString()) {
      alert("No puedes hacer una consignación a tu propia cuenta.");
      return;
    }

    // Validar saldo del usuario activo
    const remitenteRef = ref(db, `usuarios/${usuarioActivo.numeroCuenta}`);
    const snapshotRemitente = await get(remitenteRef);

    if (!snapshotRemitente.exists()) {
      alert("No se pudo verificar tu cuenta. Intenta iniciar sesión de nuevo.");
      return;
    }

    const datosRemitente = snapshotRemitente.val();
    
    // Si la cantidad de dinero ingresada es mayor a la cantidad de dinero con la que uno cuenta en el banco, entonces que la página tire una alerta
    if (cantidadNumerica > datosRemitente.saldo) {
      alert("No tienes suficiente saldo para realizar esta consignación.");
      return;
    }

    // Realizar la transferencia
    const nuevoSaldoRemitente = datosRemitente.saldo - cantidadNumerica;
    const nuevoSaldoDestino = datosDestino.saldo + cantidadNumerica;
    

    // Actualizar ambos saldos en Firebase
    await update(ref(db, `usuarios/${usuarioActivo.numeroCuenta}`), {
      saldo: nuevoSaldoRemitente
    });

    await update(ref(db, `usuarios/${numeroCuenta}`), {
      saldo: nuevoSaldoDestino
    });

    

// Guardar transacción en Firebase (historial del remitente)
const transaccionRef = ref(db, `transacciones/${usuarioActivo.numeroCuenta}`);
await push(transaccionRef, {
  fecha: new Date().toISOString(),
  referencia: numeroReferencia, // la misma referencia
  tipo: "Consignación electrónica",
  concepto: `Consignación a la cuenta ${numeroCuenta}`,
  valor: cantidadNumerica
});
    alert(`Consignación exitosa de $${cantidadNumerica.toLocaleString()} a ${datosDestino.nombres} ${datosDestino.apellidos}.`);

    // Guardar datos de la transacción y permiso antes de redirigir
localStorage.setItem('datosConsignacion', JSON.stringify({
  fecha: new Date().toLocaleString(),
  referencia: numeroReferencia, // usamos la misma
  valor: cantidadNumerica
}));

localStorage.setItem('permisoConsignacion', 'true');

// Redirigir luego de guardar los datos
setTimeout(() => {
  window.location.href = "/screens/completedConsign.html";
}, 300); // pequeño delay por seguridad
    
    setTimeout(() => {
   window.location.href = "/screens/completedConsign.html";
}, 1000); // 1 segundo

    // Puedes resetear el form si quieres
    cuentaInput.value = "";
    nombreInput.value = "";
    cantidadInput.value = "";

  } catch (error) {
    console.error("Error durante la consignación:", error);
    alert("Ocurrió un error al procesar la consignación.");
  }
});
});