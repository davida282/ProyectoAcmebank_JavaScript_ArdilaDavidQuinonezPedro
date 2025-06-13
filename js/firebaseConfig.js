import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
    import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-analytics.js";
    import { getDatabase, ref, set, get, child, onValue } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";
  
    const firebaseConfig = {
      apiKey: "AIzaSyCnVIPEevJRjIk5rOryUofw9mLmZzVFUj0",
      authDomain: "banco-acme-a5567.firebaseapp.com",
      databaseURL: "https://banco-acme-a5567-default-rtdb.firebaseio.com",
      projectId: "banco-acme-a5567",
      storageBucket: "banco-acme-a5567.firebasestorage.app",
      messagingSenderId: "304465915351",
      appId: "1:304465915351:web:8da84d30dea719fb0a6f92",
      measurementId: "G-Y22KLMB354"
    };
  
    
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
  
    
    const db = getDatabase();
  
    const form = document.getElementById('registroForm');

    form.addEventListener('submit', (e) => {
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
      
        
        if (
          tipoDoc === "Tipo de documento" || tipoDoc === "" ||
          genero === "Género" || genero === "" ||
          ciudad === "Ciudad de residencia" || ciudad === "" ||
          documento === "" || telefono === "" || nombres === "" ||
          apellidos === "" || direccion === "" || contrasena === "" || email === ""
        ) {
          alert("⚠️ Todos los campos son obligatorios. Por favor complétalos.");
          return; 
        }
        
        const userId = documento;
      
        set(ref(db, 'usuarios/' + userId), {
          tipoDocumento: tipoDoc,
          genero: genero,
          ciudad: ciudad,
          documento: documento,
          telefono: telefono,
          nombres: nombres,
          apellidos: apellidos,
          direccion: direccion,
          contrasena: contrasena,
          email: email
        })
        .then(() => {
          alert("✅ Usuario registrado exitosamente");
          form.reset(); 
        })
        .catch((error) => {
          alert("❌ Error al registrar usuario");
          console.error(error);
        });
      });
      