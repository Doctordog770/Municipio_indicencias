import { fetch_endpoints } from "./fetch.js";

const formulario = document.getElementById("form");
const detalles = document.getElementById("detalles");
const contador = document.getElementById("contador");
const boton = document.getElementById("btnEnviar");
const mensaje = document.getElementById("mensaje");

detalles.addEventListener('input', () => {
    contador.textContent = `${detalles.value.length}/1000`;
});

formulario.addEventListener('submit', async (e) => {
    e.preventDefault();

    boton.disabled = true;
    boton.textContent = "Enviando…";
    mensaje.textContent = "";
    mensaje.className = "msg-form";

    try {
        const json = await fetch_endpoints(formulario, "../../api/CRUB/Crear_incidencia_code.php");

        if (json.ok) {
            mensaje.textContent = json.mensaje;
            mensaje.classList.add("ok");
            formulario.reset();
            contador.textContent = "0/1000";
        } else {
            mensaje.textContent = json.mensaje;
            mensaje.classList.add("error");
        }
    } catch (err) {
        mensaje.textContent = "Ocurrió un error al conectar con el servidor.";
        mensaje.classList.add("error");
    } finally {
        boton.disabled = false;
        boton.textContent = "Crear incidente";
    }
});
