// Se importa el firebase a register.js

import { db } from './firebaseConfig.js';
import { get, ref, set } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

const form = document.getElementById('registroForm');
    const documentoInput = document.getElementById('documento');

    // Impedir letras y limitar a 10 caracteres
    documentoInput.addEventListener('input', (e) => {
  e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
    });
    const telefonoInput = document.getElementById('telefono');
    telefonoInput.addEventListener('input', (e) => {
  e.target.value = e.target.value.replace(/\D/g, '');
});
    const nombresInput = document.getElementById('nombres');
    const apellidosInput = document.getElementById('apellidos');

    // Solo letras (permite tildes y espacios)
    const soloLetras = (e) => {
    e.target.value = e.target.value.replace(/[^a-zA-ZÁÉÍÓÚáéíóúÑñ\s]/g, '');
    };

nombresInput.addEventListener('input', soloLetras);
apellidosInput.addEventListener('input', soloLetras);

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); 
      
        // Captura los valores
        const tipoDoc = document.getElementById('tipoDoc').value;
        const genero = document.getElementById('genero').value;
        const ciudad = document.getElementById('ciudad').value;
        const documento = document.getElementById('documento').value.trim();
        const telefono = document.getElementById('telefono').value.trim();
        const nombres = document.getElementById('nombres').value.trim();
        const apellidos = document.getElementById('apellidos').value.trim();
        const direccion = document.getElementById('direccion').value.trim();
        const contrasena = document.getElementById('contrasena').value.trim();
        const email = document.getElementById('email').value.trim();
      
        // Si los campos no se encuentran completados, entonces el programa tira una alerta pidiendole que los complete
        if (
          tipoDoc === "Tipo de documento" || tipoDoc === "" ||
          genero === "Género" || genero === "" ||
          ciudad === "Ciudad de residencia" || ciudad === "" ||
          documento === "" || telefono === "" || nombres === "" ||
          apellidos === "" || direccion === "" || contrasena === "" || email === ""
        ) {
          alert("Todos los campos son obligatorios. Por favor complétalos.");
          return; 
        }
        
        // Validación para que nombres y apellidos sean solo letras
        const regexSoloLetras = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]+$/;

        if (!regexSoloLetras.test(nombres) || !regexSoloLetras.test(apellidos)) {
            alert("Los nombres y apellidos deben contener solo letras.");
        return;
        }

        // Se inicia el bloque de código que va a manejar los posibles errores que se van presentando
        try {
            
        const usuariosRef = ref(db, 'usuarios');
        const snapshotUsuarios = await get(usuariosRef);

        // Validación del documento
        const regexNumeros = /^\d{10}$/;
        if (!regexNumeros.test(documento)) {
        alert("El número de documento debe tener exactamente 10 dígitos numéricos.");
        return;
     }

     // Si el número de telefono no contiene exactamente 10 dígitos, la página le tira una alerta pidiendole que ingrese los 10 dígitos 
     if (telefono.length !== 10) {
        alert("El número de teléfono debe tener exactamente 10 dígitos.");
        return;
      }
        
        
        if (snapshotUsuarios.exists()) {
        const usuarios = snapshotUsuarios.val();
      
      for (let key in usuarios) {
        const usuario = usuarios[key];
        // Si el usuario ingresa datos que ya se encuentran en la base de datos, entonces la página tira una alerta diciendo que ya existe
        if (usuario.documento === documento) {
          alert("Ya existe un usuario con este número de documento.");
          return;
        }
        if (usuario.telefono === telefono) {
          alert("Ya existe un usuario con este número de teléfono.");
          return;
        }
        if (usuario.email === email) {
          alert("Ya existe un usuario con este correo electrónico.");
          return;
        }
      }
    }
            // Obtener el contador actual
            const contadorRef = ref(db, 'contadorCuentas');
            const snapshot = await get(contadorRef);
        
            let numeroCuenta = 1000000000000000;
            if (snapshot.exists()) {
              numeroCuenta = snapshot.val() + 1;
            }
        
            // Actualizar el contador en Firebase
            await set(contadorRef, numeroCuenta);
        
            // Guardar el usuario con su número de cuenta
            const userId = numeroCuenta;
            // Datos que van a guardarse en el Firebase
            await set(ref(db, 'usuarios/' + userId), {
             numeroCuenta: numeroCuenta,
              tipoDocumento: tipoDoc,
              genero: genero,
              ciudad: ciudad,
              documento: documento,
              telefono: telefono,
              nombres: nombres,
              apellidos: apellidos,
              direccion: direccion,
              contrasena: contrasena,
              email: email,
              fechaCreacion: new Date().toISOString(),
              saldo: 500000
            });
        
            alert(`Usuario registrado exitosamente.\nNúmero de cuenta: ${numeroCuenta}`);
            form.reset();
        
          } catch (error) {
            console.error("Error al registrar usuario:", error);
            alert("Ocurrió un error al registrar el usuario.");
          }
        });
      