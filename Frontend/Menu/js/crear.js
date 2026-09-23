(function(){
  "use strict";

  RU.inicializarTopbar();
  var datos = RU.cargarDatos();

  /* ========= Barrio ========= */
  var selectBarrio = document.getElementById("barrio");
  RU.ZONAS.forEach(function(z){
    var op = document.createElement("option");
    op.value = z; op.textContent = z;
    selectBarrio.appendChild(op);
  });

  /* ========= Buscador de incidentes ========= */
  var inputBuscar = document.getElementById("buscarIncidente");
  var listaCombo = document.getElementById("listaIncidentes");
  var elegido = document.getElementById("incidenteElegido");
  var elegidoTexto = document.getElementById("incidenteElegidoTexto");
  var campoOtro = document.getElementById("campo-otro");
  var inputOtro = document.getElementById("otroIncidente");
  var seleccion = null, indiceActivo = -1, resultados = [];

  function buscar(texto){
    var q = RU.normalizar(texto.trim());
    if (!q) return RU.INCIDENTES.slice();
    var hallados = RU.INCIDENTES.filter(function(i){
      if (i.id === "otro") return false;
      return RU.normalizar(i.nombre + " " + i.cat).indexOf(q) !== -1;
    });
    hallados.push(RU.INCIDENTES[RU.INCIDENTES.length - 1]);
    return hallados;
  }

  function abrirCombo(texto){
    resultados = buscar(texto || "");
    indiceActivo = -1;
    listaCombo.innerHTML = "";

    if (resultados.length === 1 && resultados[0].id === "otro"){
      var aviso = document.createElement("p");
      aviso.className = "combo-vacio";
      aviso.textContent = "No encontramos ese incidente en la lista. Podés elegir \u201cOtro\u201d y describirlo vos.";
      listaCombo.appendChild(aviso);
    }

    resultados.forEach(function(item, i){
      var op = document.createElement("button");
      op.type = "button";
      op.className = "combo-op";
      op.setAttribute("role","option");
      op.innerHTML = '<span class="ic" aria-hidden="true">' + item.ic + '</span><span>' + item.nombre + '</span>' +
                     (item.cat ? '<span class="cat">' + item.cat + '</span>' : '');
      op.addEventListener("click", function(){ elegirIncidente(item); });
      op.addEventListener("mouseenter", function(){ marcarActiva(i); });
      listaCombo.appendChild(op);
    });

    listaCombo.hidden = false;
    inputBuscar.setAttribute("aria-expanded","true");
  }

  function cerrarCombo(){
    listaCombo.hidden = true;
    inputBuscar.setAttribute("aria-expanded","false");
    indiceActivo = -1;
  }
  function marcarActiva(i){
    indiceActivo = i;
    listaCombo.querySelectorAll(".combo-op").forEach(function(op, idx){
      op.classList.toggle("activa", idx === i);
    });
  }
  function elegirIncidente(item){
    seleccion = item;
    elegidoTexto.textContent = item.ic + "  " + item.nombre;
    elegido.hidden = false;
    inputBuscar.value = "";
    cerrarCombo();
    campoOtro.hidden = (item.id !== "otro");
    if (item.id === "otro") inputOtro.focus();
    setError("incidente","");
  }

  inputBuscar.addEventListener("input", function(){ abrirCombo(inputBuscar.value); });
  inputBuscar.addEventListener("focus", function(){ abrirCombo(inputBuscar.value); });
  inputBuscar.addEventListener("click", function(e){ e.stopPropagation(); });
  listaCombo.addEventListener("click", function(e){ e.stopPropagation(); });
  document.addEventListener("click", cerrarCombo);
  document.addEventListener("keydown", function(e){ if (e.key === "Escape") cerrarCombo(); });

  inputBuscar.addEventListener("keydown", function(e){
    if (listaCombo.hidden && e.key === "ArrowDown"){ abrirCombo(inputBuscar.value); return; }
    var ops = listaCombo.querySelectorAll(".combo-op");
    if (!ops.length) return;
    if (e.key === "ArrowDown"){ e.preventDefault(); marcarActiva((indiceActivo + 1) % ops.length); }
    else if (e.key === "ArrowUp"){ e.preventDefault(); marcarActiva((indiceActivo - 1 + ops.length) % ops.length); }
    else if (e.key === "Enter" && indiceActivo >= 0){ e.preventDefault(); elegirIncidente(resultados[indiceActivo]); }
  });
  document.getElementById("quitarIncidente").addEventListener("click", function(){
    seleccion = null; elegido.hidden = true; campoOtro.hidden = true; inputOtro.value = "";
    inputBuscar.focus();
  });

  /* ========= Foto opcional ========= */
  var inputFoto = document.getElementById("foto");
  var preview = document.getElementById("previewFoto");
  var previewImg = document.getElementById("previewImg");
  var fotoCargada = null;

  document.getElementById("btnFoto").addEventListener("click", function(){ inputFoto.click(); });
  inputFoto.addEventListener("change", function(){
    var file = inputFoto.files && inputFoto.files[0];
    if (!file) return;
    var lector = new FileReader();
    lector.onload = function(){
      fotoCargada = lector.result;
      previewImg.src = fotoCargada;
      preview.hidden = false;
    };
    lector.readAsDataURL(file);
    document.getElementById("previewNombre").textContent = file.name;
    document.getElementById("previewPeso").textContent = (file.size / 1024).toFixed(0) + " KB";
  });
  document.getElementById("quitarFoto").addEventListener("click", function(){
    inputFoto.value = ""; fotoCargada = null;
    preview.hidden = true; previewImg.removeAttribute("src");
  });

  /* ========= Validación y envío ========= */
  var form = document.getElementById("formInforme");
  var estadoForm = document.getElementById("estadoForm");

  function setError(campo, mensaje){
    var cont = document.getElementById("campo-" + campo);
    var msg = document.getElementById("err-" + campo);
    if (cont) cont.classList.toggle("error", Boolean(mensaje));
    if (msg) msg.textContent = mensaje || "";
  }

  form.addEventListener("submit", function(e){
    e.preventDefault();

    var direccion = document.getElementById("direccion").value.trim();
    var descripcion = document.getElementById("descripcion").value.trim();
    var otro = inputOtro.value.trim();
    var primerError = null;

    ["direccion","incidente","otro","descripcion"].forEach(function(c){ setError(c,""); });

    if (direccion.length < 5){
      setError("direccion","Indicá la calle y la altura donde sucedió.");
      primerError = primerError || "direccion";
    }
    if (!seleccion){
      setError("incidente","Elegí un incidente de la lista o seleccioná \u201cOtro\u201d.");
      primerError = primerError || "buscarIncidente";
    }
    if (seleccion && seleccion.id === "otro" && otro.length < 4){
      setError("otro","Escribí en pocas palabras qué incidente ocurrió.");
      primerError = primerError || "otroIncidente";
    }
    if (descripcion.length < 10){
      setError("descripcion","Contanos un poco más: al menos 10 caracteres.");
      primerError = primerError || "descripcion";
    }

    if (primerError){
      document.getElementById(primerError).focus();
      estadoForm.style.color = "var(--rojo)";
      estadoForm.textContent = "Revisá los campos marcados antes de enviar.";
      return;
    }

    var nro = "INF-0" + (292 + (datos.comunidad.length - 13));
    var nuevo = {
      nro: nro,
      fecha: new Date().toISOString(),
      incidente: seleccion.id === "otro" ? otro : seleccion.nombre,
      ic: seleccion.ic,
      direccion: direccion,
      barrio: selectBarrio.value,
      descripcion: descripcion,
      foto: fotoCargada,
      esPropia: true,
      estado: "pendiente",
      vecino: "Lucía Medina"
    };
    datos.misInformes.unshift(nuevo);
    datos.comunidad.unshift(nuevo);
    RU.guardarDatos(datos);

    form.reset();
    seleccion = null;
    fotoCargada = null;
    elegido.hidden = true;
    campoOtro.hidden = true;
    preview.hidden = true;

    estadoForm.style.color = "var(--verde)";
    estadoForm.innerHTML = "Informe " + nro + " enviado. Ya aparece en \u201c<a href='tus.html' style='color:inherit'>Tus informes</a>\u201d.";
    window.setTimeout(function(){ estadoForm.textContent = ""; }, 8000);
  });
})();
