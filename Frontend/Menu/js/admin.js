(function(){
  "use strict";
  if ((localStorage.getItem("rol") || "").toLowerCase() !== "admin") {
    window.location.replace("menu_opciones.html");
    return;
  }
  RU.inicializarTopbar();
  var lista = [], cuerpo = document.getElementById("cuerpoAdmin");
  var buscar = document.getElementById("buscarAdmin"), filtro = document.getElementById("filtroAdmin");
  var estados = { pendiente:"PENDIENTE", proceso:"EN PROCESO", resuelta:"RESUELTO" };

  function render(){
    var q = RU.normalizar(buscar.value.trim());
    var visible = lista.filter(function(i){
      return (!filtro.value || i.estado === filtro.value) &&
        (!q || RU.normalizar(i.incidente + " " + i.direccion).indexOf(q) !== -1);
    });
    cuerpo.innerHTML = "";
    visible.forEach(function(i){
      var tr = document.createElement("tr");
      tr.appendChild(RU.td(i.nro)); tr.appendChild(RU.td(RU.formatFecha(i.fecha)));
      tr.appendChild(RU.celdaIncidente(i)); tr.appendChild(RU.td(i.direccion)); tr.appendChild(RU.celdaEstado(i));
      var acciones = document.createElement("td");
      var select = document.createElement("select");
      ["pendiente","proceso","resuelta"].forEach(function(estado){
        var option = document.createElement("option"); option.value = estado; option.textContent = RU.ESTADOS[estado]; option.selected = estado === i.estado; select.appendChild(option);
      });
      select.addEventListener("change", function(){
        var form = new FormData(); form.append("id_incidente", i.id); form.append("estado", estados[select.value]);
        RU.apiFetch("../../api/CRUB/Cambiar_estado_code.php", { method:"POST", body:form })
          .then(function(){ i.estado = select.value; render(); }).catch(function(error){ window.alert(error.message); render(); });
      });
      var borrar = document.createElement("button"); borrar.type = "button"; borrar.className = "btn-limpiar"; borrar.textContent = "Borrar";
      borrar.addEventListener("click", function(){
        if (!window.confirm("¿Borrar este informe definitivamente?")) return;
        var form = new FormData(); form.append("id_incidente", i.id);
        RU.apiFetch("../../api/CRUB/Eliminar_code.php", { method:"POST", body:form })
          .then(function(){ lista = lista.filter(function(item){ return item.id !== i.id; }); render(); })
          .catch(function(error){ window.alert(error.message); });
      });
      acciones.appendChild(select); acciones.appendChild(borrar); tr.appendChild(acciones); cuerpo.appendChild(tr);
    });
    document.getElementById("vacioAdmin").hidden = visible.length > 0;
  }
  buscar.addEventListener("input", render); filtro.addEventListener("change", render);
  RU.apiFetch("../../api/CRUB/Listar_incidencias_code.php").then(function(json){
    lista = (json.lista_incidentes || []).map(RU.normalizarIncidente); render();
  }).catch(function(error){ document.getElementById("estadoAdmin").textContent = error.message; });
})();
