import { fetch_endpoints } from "../../assets/js/fetch.js";

const token = localStorage.getItem('token');
if (!token) {
    window.location.href = "../auth/SignInSignUp.html";
}

const contenedor = document.getElementById("listaIncidentes");

const ESTADOS = {
    "PENDIENTE": "pendiente",
    "EN PROCESO": "proceso",
    "RESUELTO": "resuelto"
};

function claseEstado(estado) {
    return ESTADOS[(estado || "").toUpperCase()] || "otro";
}

function escapar(texto) {
    const div = document.createElement('div');
    div.textContent = texto ?? "";
    return div.innerHTML;
}

function formatearFecha(fecha) {
    if (!fecha) return "";
    const d = new Date(fecha.replace(' ', 'T'));
    if (isNaN(d)) return fecha;
    return d.toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' });
}

function renderizar(lista) {
    if (!lista || lista.length === 0) {
        contenedor.innerHTML = `<p class="estado-vacio">Todavía no hay incidentes cargados.</p>`;
        return;
    }

    contenedor.innerHTML = lista.map(inc => `
        <article class="incidente-item">
            <div class="incidente-item-info">
                <p class="incidente-tipo">${escapar(inc.TIPO_INCIDENTE)}</p>
                <p class="incidente-detalles">${escapar(inc.DETALLES)}</p>
                <div class="incidente-meta">
                    <span>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s7-7.5 7-12a7 7 0 1 0-14 0c0 4.5 7 12 7 12Z"/><circle cx="12" cy="9" r="2.5"/></svg>
                        ${escapar(inc.UBICACION)}
                    </span>
                    <span>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 10h18M8 2v4M16 2v4"/></svg>
                        ${escapar(formatearFecha(inc.FECHA_CREACION))}
                    </span>
                </div>
            </div>
            <span class="badge-estado ${claseEstado(inc.ESTADO)}">${escapar(inc.ESTADO || "PENDIENTE")}</span>
        </article>
    `).join("");
}

async function cargar() {
    try {
        const formVacio = document.createElement('form');
        const json = await fetch_endpoints(formVacio, "../../api/CRUB/Listar_incidencias_code.php");

        if (!json.ok) {
            contenedor.innerHTML = `<p class="estado-error">${escapar(json.mensaje || "No se pudo cargar el listado.")}</p>`;
            return;
        }

        renderizar(json.lista_incidentes);
    } catch (err) {
        contenedor.innerHTML = `<p class="estado-error">Ocurrió un error al conectar con el servidor.</p>`;
    }
}

cargar();
