if (window.RU) {
    window.RU.inicializarTopbar();
}

const opcionAdmin = document.getElementById("opcionAdmin");
if (opcionAdmin) {
    opcionAdmin.hidden = true;

    try {
        const token = localStorage.getItem("token");
        const partePayload = token && token.split(".")[1];
        const base64 = partePayload.replace(/-/g, "+").replace(/_/g, "/");
        const payload = JSON.parse(atob(base64 + "===".slice((base64.length + 3) % 4)));

        if (String(payload.ROL || "").trim().toLowerCase() === "admin") {
            opcionAdmin.hidden = false;
        }
    } catch (error) {
        opcionAdmin.hidden = true;
    }
}
