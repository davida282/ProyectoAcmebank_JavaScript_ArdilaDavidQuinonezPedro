function toggleMenu() {
    document.querySelector('.contenedor').classList.toggle('activo');
}

function seleccionarOpcion(event) {
    event.preventDefault(); // Evita el redireccionamiento

    let textoSeleccionado = event.target.textContent; // Captura el texto de la opción

    // Reemplaza la flecha por el texto de la opción seleccionada
    document.querySelector('.flecha').textContent = textoSeleccionado;

    // Oculta las opciones y cierra el menú
    document.querySelector('.contenedor').classList.remove('activo');
}

// Tu configuración personalizada de Firebase
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "tu-proyecto.firebaseapp.com",
  databaseURL: "https://tu-proyecto.firebaseio.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcd1234"
};

// Inicializar Firebase
const app = firebase.initializeApp(firebaseConfig);

// Inicializar la base de datos
const db = firebase.database();