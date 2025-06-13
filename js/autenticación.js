function toggleMenu() {
    document.querySelector('.contenedor').classList.toggle('activo');
}

function seleccionarOpcion(event) {
    event.preventDefault(); 

    let textoSeleccionado = event.target.textContent; 

    
    document.querySelector('.flecha').textContent = textoSeleccionado;

    
    document.querySelector('.contenedor').classList.remove('activo');
}

