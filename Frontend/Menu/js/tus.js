(function(){
  "use strict";

  RU.inicializarTopbar();
  var visor = RU.inicializarVisor();
  var datos = RU.cargarDatos();

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

  render();
})();
