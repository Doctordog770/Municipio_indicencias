  /* ---- Deslizador login / registro (igual que reporte_urbano.html) ---- */
  var authContenedor = document.getElementById("authContenedor");
  function mostrarLogin(){ authContenedor.classList.remove("derecha"); }
  function mostrarRegistro(){ authContenedor.classList.add("derecha"); }

  document.getElementById("irRegister").addEventListener("click", mostrarRegistro);
  document.getElementById("irRegisterMovil").addEventListener("click", mostrarRegistro);
  document.getElementById("irLogin").addEventListener("click", mostrarLogin);
  document.getElementById("irLoginMovil").addEventListener("click", mostrarLogin);
