RU.inicializarTopbar();

var accesoAdmin = document.getElementById("accesoAdmin");
if (accesoAdmin){
	accesoAdmin.hidden = String(localStorage.getItem("rol") || "").trim().toLowerCase() !== "admin";
}
