// autenticacion.js
import { db } from './firebaseConfig.js';
import { get, ref,  } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

const form = document.getElementById('loginForm');

const tipoDocInput = document.getElementById('tipoDoc');

const documentoInput = document.getElementById('documento');

documentoInput.addEventListener('input', (e) => {
  e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
    });
    
const contrasenaInput = document.getElementById('contrasena');


form.addEventListener('submit', async (e) => {
  e.preventDefault(); 

  
 const tipoDoc = tipoDocInput.value;
const documento = documentoInput.value.trim();
  const contrasena = contrasenaInput.value.trim();

  if (documento === "" || contrasena === "" || tipoDoc === "▼" || tipoDoc === "" ) {
    alert("⚠️ Por favor, completa todos los campos.");
    return;
  }

  try {
    const usuariosRef = ref(db, 'usuarios');
    const snapshot = await get(usuariosRef);
    // 🔒 Validación del documento
    const regexNumeros = /^\d{10}$/;
    if (!regexNumeros.test(documento)) {
    alert("🚫 El número de documento debe tener exactamente 10 dígitos numéricos.");
    return;
     }
    
    if (snapshot.exists()) {
      const usuarios = snapshot.val();
      let accesoConcedido = false;

      for (let key in usuarios) {
        const usuario = usuarios[key];

        if (usuario.documento === documento && usuario.contrasena === contrasena && usuario.tipoDocumento === tipoDoc) {
          accesoConcedido = true;

          // ✅ Puedes guardar el ID de sesión si quieres
          localStorage.setItem('usuarioActivo', JSON.stringify({
            id: key,
            nombres: usuario.nombres,
            numeroCuenta: usuario.numeroCuenta
          }));

          // 🚪 Redirigir al Dashboard
          window.location.href = 'dashboard.html';
          break;
        }
      }

      if (!accesoConcedido) {
        alert("🚫 Documento o contraseña incorrectos.");
      }

    } else {
      alert("❌ No hay usuarios registrados en el sistema.");
    }

  } catch (error) {
    console.error("Error durante el login:", error);
    alert("❌ Ocurrió un error al iniciar sesión.");
  }
});

