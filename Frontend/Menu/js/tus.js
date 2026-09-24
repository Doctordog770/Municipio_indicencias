(function(){
  "use strict";

  RU.inicializarTopbar();
  var visor = RU.inicializarVisor();
  var informes = [];
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

  function eliminar(id){
    if (!window.confirm("¿Querés borrar este informe?")) return;
    var form = new FormData();
    form.append("id_incidente", id);
    RU.apiFetch("../../api/CRUB/Eliminar_code.php", { method:"POST", body:form })
      .then(function(){ informes = informes.filter(function(item){ return item.id !== id; }); render(); })
      .catch(function(error){ window.alert(error.message); });
  }

  function render(){
    var q = RU.normalizar(buscarTus.value.trim());
    var est = filtroEstadoTus.value;
    var lista = informes.filter(function(i){
      if (est && i.estado !== est) return false;
      return !q || RU.normalizar(i.incidente + " " + i.direccion).indexOf(q) !== -1;
    });
    lista.sort(function(a,b){
      if (ordenTus.value === "fecha_asc") return new Date(a.fecha) - new Date(b.fecha);
      if (ordenTus.value === "estado") return RU.ORDEN_ESTADO[a.estado] - RU.ORDEN_ESTADO[b.estado];
      return new Date(b.fecha) - new Date(a.fecha);
    });
    cuerpoTus.innerHTML = "";
    lista.forEach(function(i){
      var tr = document.createElement("tr");
      tr.appendChild(RU.td(i.nro));
      tr.appendChild(RU.td(RU.formatFecha(i.fecha)));
      tr.appendChild(RU.celdaIncidente(i));
      tr.appendChild(RU.td(i.direccion));
      tr.appendChild(RU.celdaFoto(i, visor && visor.abrir));
      tr.appendChild(RU.celdaEstado(i));
      cuerpoTus.appendChild(tr);
    });
    vacioTus.hidden = lista.length > 0;
    resumenTus.textContent = informes.length + " informes tuyos · " +
      informes.filter(function(i){ return i.estado !== "resuelta"; }).length + " sin resolver.";
  }

  RU.apiFetch("../../api/CRUB/Listar_incidencias_code.php")
    .then(function(json){
      informes = (json.lista_incidentes || [])
        .filter(function(item){ return Number(item.ID_USUARIO) === Number(localStorage.getItem("id_usuario")); })
        .map(RU.normalizarIncidente);
      render();
    })
    .catch(function(error){ resumenTus.textContent = error.message; vacioTus.hidden = false; });
})();
