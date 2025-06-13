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
