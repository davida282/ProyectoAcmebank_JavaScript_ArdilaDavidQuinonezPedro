// Si ya hay una sesión iniciada, evitar que vuelva al login con la flecha atrás
window.addEventListener('DOMContentLoaded', () => {
  const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));

  if (!usuarioActivo) {
    alert("No has iniciado sesión. Serás redirigido al login.");
    window.location.href = "login.html";
    return;
  }

  // Se obtienen las constantes desde las ID propuestas en el HTML
  const cuentaInput = document.getElementById('numCuenta');
  const nombreInput = document.getElementById('usuario');
  const anioInput = document.getElementById('anio');
  const mesSelect = document.getElementById('mes');
  const confirmarBtn = document.getElementById('confirmarBtn');

  // Autocompletar datos del usuario
  cuentaInput.value = usuarioActivo.numeroCuenta || '';
  nombreInput.value = `${usuarioActivo.nombres} ${usuarioActivo.apellidos}`.trim();

  confirmarBtn.addEventListener('click', async (e) => {
  e.preventDefault();

  // Obtiene y limpia los valores de input año y del mes
  const anio = anioInput.value.trim();
  const mes = mesSelect.value;

    // Si el usuario no ingresa valores validos entre el año 2000 y 2099 entonces que el usuario la página alerte
  if (!anio || isNaN(parseInt(anio)) || parseInt(anio) < 2000 || parseInt(anio) > 2099) {
    alert("Ingresa un año válido entre 2000 y 2099.");
    return;
  }

  // Si la persona no selecciona ningún mes, la página le da una alerta 
  if (!mes) {
    alert("Selecciona un mes para generar el extracto.");
    return;
  }

  // Se inicia el bloque de código que va a manejar los posibles errores que se van presentando
  try {
    // Guardar los filtros seleccionados
    localStorage.setItem('filtrosExtracto', JSON.stringify({ anio, mes }));

    // Redirigir a la pantalla de resultado
    window.location.href = "/screens/resultExtracto.html";

  } catch (error) {
    console.error("Error al generar el extracto:", error);
    alert("Ocurrió un error al intentar obtener el extracto.");
  }
});
});
