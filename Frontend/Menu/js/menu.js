// La ruta hacia el login cambia según desde qué página se cargue este
// script (menu_opciones.html o las subpáginas dentro de incidentes/), por eso se
// lee del atributo data-login del propio <script>.
const scriptActual = document.currentScript;
const rutaLogin = (scriptActual && scriptActual.dataset.login) || "../auth/SignInSignUp.html";

// Si no hay sesión iniciada, no tiene sentido mostrar el menú.
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
