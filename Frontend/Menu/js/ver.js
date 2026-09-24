(function(){
  "use strict";

  RU.inicializarTopbar();
  var visor = RU.inicializarVisor();
  var datos = RU.cargarDatos();

  var cuerpoCom = document.getElementById("cuerpoComunidad");
  var vacioCom = document.getElementById("vacioComunidad");
  var buscarZona = document.getElementById("buscarZona");
  var filtroEstadoCom = document.getElementById("filtroEstadoCom");
  var resumenCom = document.getElementById("resumenComunidad");
  var zonaCabecera = document.getElementById("zonaCabecera");

  buscarZona.addEventListener("input", render);
  filtroEstadoCom.addEventListener("change", render);
  document.getElementById("btnBuscarZona").addEventListener("click", render);
  document.getElementById("btnLimpiarZona").addEventListener("click", function(){
    buscarZona.value = "";
    filtroEstadoCom.value = "";
    render();
  });
  buscarZona.addEventListener("keydown", function(e){
    if (e.key === "Enter"){ e.preventDefault(); render(); }
  });

  function zonaCoincidente(q){
    if (!q) return null;
    var encontrada = null;
    RU.ZONAS.forEach(function(z){
      if (RU.normalizar(z).indexOf(q) !== -1 && !encontrada) encontrada = z;
    });
    return encontrada;
  }

  function render(){
    var q = RU.normalizar(buscarZona.value.trim());
    var est = filtroEstadoCom.value;

    var lista = datos.comunidad.filter(function(i){
      if (est && i.estado !== est) return false;
      if (q && RU.normalizar(i.barrio + " " + i.direccion).indexOf(q) === -1) return false;
      return true;
    });

    lista.sort(function(a,b){ return new Date(b.fecha) - new Date(a.fecha); });

    /* cabecera con el semáforo de la zona buscada */
    var zona = zonaCoincidente(q);
    if (zona){
      var r = RU.riesgoZona(datos.comunidad, zona);
      zonaCabecera.hidden = false;
      zonaCabecera.setAttribute("data-riesgo", r.nivel);
      document.getElementById("zonaNombre").textContent = zona;
      document.getElementById("zonaDetalle").textContent =
        r.total + " informes en la zona · " + r.sinResolver + " sin resolver.";
      var nivelEl = document.getElementById("zonaNivel");
      nivelEl.className = "zona-nivel " + r.nivel;
      nivelEl.textContent = RU.ETIQUETA_RIESGO[r.nivel];
    } else {
      zonaCabecera.hidden = true;
    }

    cuerpoCom.innerHTML = "";
    lista.forEach(function(i){
      var r = RU.riesgoZona(datos.comunidad, i.barrio);
      var tr = document.createElement("tr");

      tr.appendChild(RU.td(i.nro));
      tr.appendChild(RU.td(RU.formatFecha(i.fecha)));
      tr.appendChild(RU.celdaIncidente(i));

      var tdZona = document.createElement("td");
      var bar = document.createElement("div"); bar.className = "td-titulo"; bar.textContent = i.barrio;
      var calle = document.createElement("div"); calle.className = "td-desc"; calle.textContent = i.direccion;
      tdZona.appendChild(bar); tdZona.appendChild(calle);
      tr.appendChild(tdZona);

      tr.appendChild(RU.td(i.vecino));
      tr.appendChild(RU.celdaFoto(i, visor && visor.abrir));

      var tdRiesgo = document.createElement("td");
      var punto = document.createElement("span");
      punto.className = "punto " + r.nivel;
      punto.textContent = RU.ETIQUETA_RIESGO[r.nivel];
      tdRiesgo.appendChild(punto);
      tr.appendChild(tdRiesgo);

      tr.appendChild(RU.celdaEstado(i));
      cuerpoCom.appendChild(tr);
    });

    vacioCom.hidden = lista.length > 0;
    resumenCom.textContent = zona
      ? "Informes de " + zona + " — " + lista.length + " resultados."
      : "Últimos reportes cargados por los vecinos · " + lista.length + " informes.";
  }

  render();
})();
