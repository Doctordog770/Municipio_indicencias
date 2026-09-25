// Guard de sesión + botón "Cerrar sesión" para las páginas de incidentes/.
// Todas las páginas viven en html/, así que la ruta al login es siempre la misma.
const rutaLogin = "SignInSignUp.html";

// Si no hay sesión iniciada, no tiene sentido mostrar la página.
const token = localStorage.getItem('token');
if (!token) {
    window.location.href = rutaLogin;
}

const btnSalir = document.getElementById("btnSalir");
if (btnSalir) {
    btnSalir.addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('rol');
        window.location.href = rutaLogin;
    });
}
