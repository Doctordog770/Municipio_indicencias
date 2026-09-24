(function(){
  "use strict";

  RU.inicializarTopbar();
  var visor = RU.inicializarVisor();
  var datos = { misInformes: [] };

  var cuerpoTus = document.getElementById("cuerpoTus");
  var vacioTus = document.getElementById("vacioTus");
  var buscarTus = document.getElementById("buscarTus");
  var filtroEstadoTus = document.getElementById("filtroEstadoTus");
  var ordenTus = document.getElementById("ordenTus");
  var resumenTus = document.getElementById("resumenTus");

  [buscarTus, filtroEstadoTus, ordenTus].forEach(function(el){
    el.addEventListener("input", render);
    el.addEventListener("change", render);
  });

  function obtenerIdUsuario(){
    var idGuardado = localStorage.getItem("id_usuario");
    if (idGuardado) return String(idGuardado);

    var token = localStorage.getItem("token");
    if (!token) return null;

    try {
      var partePayload = token.split(".")[1];
      var base64 = partePayload.replace(/-/g, "+").replace(/_/g, "/");
      while (base64.length % 4) base64 += "=";
      var payload = JSON.parse(atob(base64));
      return payload.ID_USUARIO ? String(payload.ID_USUARIO) : null;
    } catch (error) {
      return null;
    }
  }

  function iconoIncidente(tipo){
    var buscado = RU.normalizar(String(tipo || ""));
    var encontrado = RU.INCIDENTES.find(function(incidente){
      return RU.normalizar(incidente.nombre).indexOf(buscado) !== -1 ||
             buscado.indexOf(RU.normalizar(incidente.nombre)) !== -1;
    });
    return encontrado ? encontrado.ic : "•";
  }

  function normalizarEstado(estado){
    var estadoNormalizado = RU.normalizar(String(estado || "pendiente")).replace(/\s+/g, "_");
    return estadoNormalizado === "en_proceso" ? "proceso" : estadoNormalizado;
  }

  function adaptarIncidente(incidente){
    var ubicacion = incidente.UBICACION || "Sin ubicación";
    var tipo = incidente.TIPO_INCIDENTE || "Incidente sin tipo";

    return {
      nro: "INF-" + incidente.ID_INCIDENTE,
      fecha: incidente.FECHA_CREACION,
      incidente: tipo,
      ic: iconoIncidente(tipo),
      direccion: ubicacion,
      barrio: ubicacion,
      descripcion: incidente.DETALLES || "Sin detalles",
      foto: incidente.IMAGEN || null,
      estado: normalizarEstado(incidente.ESTADO)
    };
  }

  async function cargarInformes(){
    try {
      var moduloFetch = await import("../../assets/js/fetch.js");
      var respuesta = await moduloFetch.fetch_autenticado(
        "../../api/CRUB/Listar_incidencias_code.php",
        "POST"
      );
      var idUsuario = obtenerIdUsuario();

      if (!respuesta.ok || !Array.isArray(respuesta.lista_incidentes) || !idUsuario) {
        throw new Error(respuesta.mensaje || "No se pudieron cargar tus informes.");
      }

      datos.misInformes = respuesta.lista_incidentes
        .filter(function(incidente){ return String(incidente.ID_USUARIO) === idUsuario; })
        .map(adaptarIncidente);
      render();
    } catch (error) {
      cuerpoTus.innerHTML = "";
      vacioTus.hidden = false;
      vacioTus.textContent = "No se pudieron cargar tus informes. Revisá tu sesión e intentá nuevamente.";
      resumenTus.textContent = "Error al consultar tus informes.";
    }
  }

  function render(){
    var q = RU.normalizar(buscarTus.value.trim());
    var est = filtroEstadoTus.value;

    var lista = datos.misInformes.filter(function(i){
      if (est && i.estado !== est) return false;
      if (q && RU.normalizar(i.incidente + " " + i.direccion + " " + i.barrio).indexOf(q) === -1) return false;
      return true;
    });

    var orden = ordenTus.value;
    lista.sort(function(a,b){
      if (orden === "fecha_asc") return new Date(a.fecha) - new Date(b.fecha);
      if (orden === "estado") return RU.ORDEN_ESTADO[a.estado] - RU.ORDEN_ESTADO[b.estado];
      return new Date(b.fecha) - new Date(a.fecha);
    });

    cuerpoTus.innerHTML = "";
    lista.forEach(function(i){
      var tr = document.createElement("tr");
      tr.appendChild(RU.td(i.nro));
      tr.appendChild(RU.td(RU.formatFecha(i.fecha)));
      tr.appendChild(RU.celdaIncidente(i));

      var tdDir = document.createElement("td");
      var calle = document.createElement("div"); calle.textContent = i.direccion;
      var bar = document.createElement("div"); bar.className = "td-desc"; bar.textContent = i.barrio;
      tdDir.appendChild(calle); tdDir.appendChild(bar);
      tr.appendChild(tdDir);

      tr.appendChild(RU.celdaFoto(i, visor && visor.abrir));
      tr.appendChild(RU.celdaEstado(i));
      cuerpoTus.appendChild(tr);
    });

    vacioTus.hidden = lista.length > 0;
    var pendientes = datos.misInformes.filter(function(i){ return i.estado !== "resuelta"; }).length;
    resumenTus.textContent = datos.misInformes.length + " informes tuyos · " + pendientes + " sin resolver.";
  }

  cargarInformes();
})();
