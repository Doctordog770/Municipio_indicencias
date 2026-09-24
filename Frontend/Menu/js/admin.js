(function(){
  "use strict";

  function usuarioEsAdmin(){
    try {
      var token = localStorage.getItem("token");
      var partePayload = token && token.split(".")[1];
      var base64 = partePayload.replace(/-/g, "+").replace(/_/g, "/");
      var payload = JSON.parse(atob(base64 + "===".slice((base64.length + 3) % 4)));
      return String(payload.ROL || "").trim().toLowerCase() === "admin";
    } catch (error) {
      return false;
    }
  }

  if (!usuarioEsAdmin()) {
    window.location.replace("menu_opciones.html");
    return;
  }

  document.body.hidden = false;

  RU.inicializarTopbar();

  var cuerpoAdmin = document.getElementById("cuerpoAdmin");
  var vacioAdmin = document.getElementById("vacioAdmin");
  var resumenAdmin = document.getElementById("resumenAdmin");
  var mensajeAdmin = document.getElementById("mensajeAdmin");
  var btnActualizar = document.getElementById("btnActualizar");
  var incidentes = [];

  function mostrarMensaje(texto, tipo){
    mensajeAdmin.textContent = texto || "";
    mensajeAdmin.className = "admin-mensaje" + (tipo ? " " + tipo : "");
  }

  function normalizarEstado(estado){
    var normalizado = RU.normalizar(String(estado || "pendiente")).replace(/\s+/g, "_");
    return normalizado === "en_proceso" ? "proceso" : normalizado;
  }

  function adaptarIncidente(incidente){
    return {
      id: incidente.ID_INCIDENTE,
      fecha: incidente.FECHA_CREACION,
      tipo: incidente.TIPO_INCIDENTE || "Sin tipo",
      detalles: incidente.DETALLES || "Sin detalles",
      ubicacion: incidente.UBICACION || "Sin ubicación",
      usuario: incidente.NOMBRE && incidente.APELLIDO
        ? incidente.NOMBRE + " " + incidente.APELLIDO
        : "Usuario #" + incidente.ID_USUARIO,
      estado: normalizarEstado(incidente.ESTADO)
    };
  }

  async function solicitar(path, datos){
    var token = localStorage.getItem("token");
    var respuesta = await fetch(path, {
      method: "POST",
      headers: { "Authorization": "Bearer " + token },
      body: datos
    });
    return respuesta.json();
  }

  async function cargarIncidentes(){
    btnActualizar.disabled = true;
    mostrarMensaje("");

    try {
      var respuesta = await solicitar("../../api/CRUB/Listar_incidencias_code.php", new FormData());
      if (!respuesta.ok || !Array.isArray(respuesta.lista_incidentes)) {
        throw new Error(respuesta.mensaje || "No se pudieron cargar los informes.");
      }
      incidentes = respuesta.lista_incidentes.map(adaptarIncidente);
      render();
    } catch (error) {
      incidentes = [];
      render();
      mostrarMensaje(error.message || "No se pudieron cargar los informes.", "error");
    } finally {
      btnActualizar.disabled = false;
    }
  }

  function crearEstado(id, estado){
    var select = document.createElement("select");
    ["pendiente", "proceso", "resuelta"].forEach(function(opcion){
      var option = document.createElement("option");
      option.value = opcion;
      option.textContent = RU.ESTADOS[opcion];
      option.selected = opcion === estado;
      select.appendChild(option);
    });
    select.addEventListener("change", function(){ cambiarEstado(id, select); });
    return select;
  }

  function render(){
    cuerpoAdmin.innerHTML = "";
    incidentes.sort(function(a, b){ return new Date(b.fecha) - new Date(a.fecha); });

    incidentes.forEach(function(incidente){
      var fila = document.createElement("tr");
      fila.appendChild(RU.td("INF-" + incidente.id));
      fila.appendChild(RU.td(RU.formatFecha(incidente.fecha)));

      var celdaTipo = document.createElement("td");
      var tipo = document.createElement("div");
      tipo.className = "admin-incidente";
      tipo.textContent = incidente.tipo;
      var detalle = document.createElement("span");
      detalle.className = "admin-detalle";
      detalle.textContent = incidente.detalles;
      celdaTipo.appendChild(tipo);
      celdaTipo.appendChild(detalle);
      fila.appendChild(celdaTipo);

      var celdaUbicacion = RU.td(incidente.ubicacion);
      celdaUbicacion.className = "admin-ubicacion";
      fila.appendChild(celdaUbicacion);
      fila.appendChild(RU.td(incidente.usuario));

      var celdaEstado = document.createElement("td");
      celdaEstado.appendChild(crearEstado(incidente.id, incidente.estado));
      fila.appendChild(celdaEstado);

      var celdaAccion = document.createElement("td");
      var botonBorrar = document.createElement("button");
      botonBorrar.type = "button";
      botonBorrar.className = "admin-accion";
      botonBorrar.textContent = "Borrar";
      botonBorrar.addEventListener("click", function(){ eliminarIncidente(incidente.id, botonBorrar); });
      celdaAccion.appendChild(botonBorrar);
      fila.appendChild(celdaAccion);
      cuerpoAdmin.appendChild(fila);
    });

    vacioAdmin.hidden = incidentes.length > 0;
    resumenAdmin.textContent = incidentes.length + " informes cargados.";
  }

  async function cambiarEstado(id, select){
    var datos = new FormData();
    datos.append("id_incidente", id);
    datos.append("estado", select.value);
    select.disabled = true;

    try {
      var respuesta = await solicitar("../../api/CRUB/Cambiar_estado_code.php", datos);
      if (!respuesta.ok) throw new Error(respuesta.mensaje || "No se pudo cambiar el estado.");
      var incidente = incidentes.find(function(item){ return String(item.id) === String(id); });
      if (incidente) incidente.estado = select.value;
      mostrarMensaje(respuesta.mensaje, "ok");
    } catch (error) {
      mostrarMensaje(error.message || "No se pudo cambiar el estado.", "error");
      render();
    } finally {
      select.disabled = false;
    }
  }

  async function eliminarIncidente(id, boton){
    if (!window.confirm("¿Querés borrar este informe? Esta acción no se puede deshacer.")) return;

    var datos = new FormData();
    datos.append("id_incidente", id);
    boton.disabled = true;

    try {
      var respuesta = await solicitar("../../api/CRUB/Eliminar_code.php", datos);
      if (!respuesta.ok) throw new Error(respuesta.mensaje || "No se pudo borrar el informe.");
      incidentes = incidentes.filter(function(item){ return String(item.id) !== String(id); });
      render();
      mostrarMensaje(respuesta.mensaje, "ok");
    } catch (error) {
      boton.disabled = false;
      mostrarMensaje(error.message || "No se pudo borrar el informe.", "error");
    }
  }

  btnActualizar.addEventListener("click", cargarIncidentes);
  cargarIncidentes();
})();
