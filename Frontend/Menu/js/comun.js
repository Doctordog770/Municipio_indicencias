/* Funciones y datos compartidos por las 4 páginas (menu, tus, ver, crear).
   Los informes se guardan en localStorage para que lo que cargás en
   "Crear un informe" aparezca en "Tus informes" y "Ver informes". */
var RU = (function(){
  /* Todas las páginas del menú requieren una sesión válida. */
  if (!localStorage.getItem("token")) {
    window.location.replace("SignInSignUp.html");
  }
  "use strict";

  var CLAVE = "ru_datos_v1";

  /* Imagen por defecto: se usa cuando un informe tiene foto pero todavía
     no está conectada la base de datos que guarda el archivo real. */
  var SVG_PERRO =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240">' +
      '<rect width="320" height="240" fill="#E9E2D3"/>' +
      '<circle cx="160" cy="205" r="86" fill="#DCD2BE"/>' +
      '<ellipse cx="92"  cy="126" rx="26" ry="52" fill="#8A5A38" transform="rotate(-14 92 126)"/>' +
      '<ellipse cx="228" cy="126" rx="26" ry="52" fill="#8A5A38" transform="rotate(14 228 126)"/>' +
      '<ellipse cx="160" cy="124" rx="74" ry="68" fill="#C98A50"/>' +
      '<ellipse cx="160" cy="168" rx="44" ry="34" fill="#F0DCC2"/>' +
      '<ellipse cx="133" cy="112" rx="11" ry="13" fill="#2C2118"/>' +
      '<ellipse cx="187" cy="112" rx="11" ry="13" fill="#2C2118"/>' +
      '<circle cx="136.5" cy="107.5" r="3.6" fill="#FFFFFF"/>' +
      '<circle cx="190.5" cy="107.5" r="3.6" fill="#FFFFFF"/>' +
      '<ellipse cx="160" cy="152" rx="15" ry="11" fill="#2C2118"/>' +
      '<path d="M160 163 v12" stroke="#2C2118" stroke-width="4" stroke-linecap="round"/>' +
      '<path d="M160 175 q-15 14 -27 0" stroke="#2C2118" stroke-width="4" fill="none" stroke-linecap="round"/>' +
      '<path d="M160 175 q15 14 27 0" stroke="#2C2118" stroke-width="4" fill="none" stroke-linecap="round"/>' +
      '<path d="M150 182 h20 v14 a10 10 0 0 1 -20 0 z" fill="#E07A8B"/>' +
    '</svg>';
  var FOTO_DEFECTO = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(SVG_PERRO);

  var ZONAS = ["Morón Centro","Castelar","Haedo","El Palomar","Villa Sarmiento"];

  var INCIDENTES = [
    { id:"pozo",       ic:"🕳️", nombre:"Pozo o bache en la calle",      cat:"Vía pública" },
    { id:"vereda",     ic:"🧱", nombre:"Vereda rota o levantada",       cat:"Vía pública" },
    { id:"luz",        ic:"💡", nombre:"Luminaria quemada",             cat:"Alumbrado" },
    { id:"cable",      ic:"🔌", nombre:"Cable suelto o colgando",       cat:"Alumbrado" },
    { id:"basura",     ic:"🗑️", nombre:"Basura acumulada",              cat:"Higiene" },
    { id:"contenedor", ic:"♻️", nombre:"Contenedor roto o desbordado",  cat:"Higiene" },
    { id:"agua",       ic:"💧", nombre:"Pérdida de agua o caño roto",   cat:"Servicios" },
    { id:"cloaca",     ic:"🚱", nombre:"Desborde cloacal",              cat:"Servicios" },
    { id:"semaforo",   ic:"🚦", nombre:"Semáforo fuera de servicio",    cat:"Tránsito" },
    { id:"señal",      ic:"🛑", nombre:"Cartel o señal dañada",         cat:"Tránsito" },
    { id:"arbol",      ic:"🌳", nombre:"Árbol caído o rama peligrosa",  cat:"Espacios verdes" },
    { id:"plaza",      ic:"🛝", nombre:"Juego de plaza roto",           cat:"Espacios verdes" },
    { id:"inundacion", ic:"🌊", nombre:"Anegamiento o sumidero tapado", cat:"Servicios" },
    { id:"animal",     ic:"🐕", nombre:"Animal suelto o herido",        cat:"Convivencia" },
    { id:"ruido",      ic:"🔊", nombre:"Ruidos molestos",               cat:"Convivencia" },
    { id:"otro",       ic:"✏️", nombre:"Otro — lo describo yo",         cat:"" }
  ];

  var ESTADOS = { pendiente:"Pendiente", proceso:"En proceso", resuelta:"Resuelta" };
  var ORDEN_ESTADO = { pendiente:0, proceso:1, resuelta:2 };
  var ETIQUETA_RIESGO = { alto:"Zona peligrosa", medio:"Zona con precaución", bajo:"Zona tranquila" };

  /* ========================================================================
     PLANTILLA DE INFORME — NO BORRAR.
     Esto NO es un dato de prueba: es la referencia de la forma (shape) que
     debe tener cada informe cuando se conecte la base de datos real.
     Cada objeto nuevo que llegue de la base de datos (o que se cree desde
     "Crear un informe") tiene que tener estos mismos campos para que el
     resto del código (tablas, riesgo por zona, visor de fotos, etc.) siga
     funcionando sin cambios.

     var PLANTILLA_INFORME = {
       nro:         "INF-0000",              // string, identificador único
       fecha:       "2026-01-01T00:00:00",   // string ISO 8601
       incidente:   "Nombre del incidente",  // string, ver RU.INCIDENTES
       ic:          "🕳️",                    // string, emoji/ícono del incidente
       direccion:   "Calle 123",             // string
       barrio:      "Morón Centro",          // string, ver RU.ZONAS
       vecino:      "Nombre Apellido",       // string, solo en informes de "comunidad"
       descripcion: "Detalle del reporte.",  // string
       foto:        null,                    // string (dataURL/URL) o null
       estado:      "pendiente"              // "pendiente" | "proceso" | "resuelta"
     };
     ======================================================================== */

  /* ========= Datos iniciales (vacíos hasta conectar la base de datos) ========= */
  function datosSemilla(){
    var misInformes = [];
    var comunidad = [];

    return { misInformes: misInformes, comunidad: comunidad };
  }

  /* ========= Almacenamiento (localStorage) ========= */
  function guardarDatos(datos){
    try { window.localStorage.setItem(CLAVE, JSON.stringify(datos)); } catch (e){ /* sigue en memoria */ }
  }

  function cargarDatos(){
    try {
      var raw = window.localStorage.getItem(CLAVE);
      if (raw) return JSON.parse(raw);
    } catch (e){ /* sin almacenamiento disponible: se usa la semilla */ }
    var semilla = datosSemilla();
    guardarDatos(semilla);
    return semilla;
  }

  /* ========= Riesgo por zona ========= */
  function riesgoZona(comunidad, zona){
    var delZona = comunidad.filter(function(i){ return i.barrio === zona; });
    var sinResolver = delZona.filter(function(i){ return i.estado !== "resuelta"; }).length;
    var nivel = sinResolver >= 4 ? "alto" : (sinResolver >= 2 ? "medio" : "bajo");
    return { nivel:nivel, total:delZona.length, sinResolver:sinResolver };
  }

  /* ========= Utilidades ========= */
  function normalizar(t){ return t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,""); }
  function formatFecha(iso){
    var d = new Date(iso);
    return d.toLocaleDateString("es-AR",{ day:"2-digit", month:"2-digit", year:"numeric" }) +
           " · " + d.toLocaleTimeString("es-AR",{ hour:"2-digit", minute:"2-digit" });
  }

  /* ========= Celdas de tabla reutilizables ========= */
  function td(texto, clase){
    var c = document.createElement("td");
    if (clase) c.className = clase;
    if (texto !== undefined) c.textContent = texto;
    return c;
  }
  function celdaIncidente(i){
    var c = document.createElement("td");
    var t = document.createElement("div");
    t.className = "td-titulo";
    t.textContent = i.ic + "  " + i.incidente;
    var d = document.createElement("div");
    d.className = "td-desc";
    d.textContent = i.descripcion;
    c.appendChild(t); c.appendChild(d);
    return c;
  }
  function celdaEstado(i){
    var c = document.createElement("td");
    var chip = document.createElement("span");
    chip.className = "chip " + i.estado;
    chip.textContent = ESTADOS[i.estado];
    c.appendChild(chip);
    return c;
  }
  function celdaFoto(i, alAbrir){
    var c = document.createElement("td");
    if (!i.foto){
      c.className = "foto-no";
      c.textContent = "Sin foto";
      return c;
    }
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "miniatura";
    btn.title = "Ver la foto del informe " + i.nro;
    var img = document.createElement("img");
    img.src = i.foto;
    img.alt = "Miniatura del informe " + i.nro;
    btn.appendChild(img);
    btn.addEventListener("click", function(){ if (alAbrir) alAbrir(i); });
    c.appendChild(btn);
    var pie = document.createElement("div");
    pie.className = "pie-mini";
    pie.textContent = "Ver foto";
    c.appendChild(pie);
    return c;
  }

  /* ========= Visor de fotos (solo en páginas que lo incluyen) ========= */
  function inicializarVisor(){
    var visor = document.getElementById("visor");
    if (!visor) return null;
    var visorImg = document.getElementById("visorImg");

    function abrir(informe){
      if (!informe.foto) return;
      visorImg.src = informe.foto;
      visorImg.alt = "Foto del informe " + informe.nro + ": " + informe.incidente;
      document.getElementById("visorTitulo").textContent = informe.ic + "  " + informe.incidente;
      document.getElementById("visorSub").textContent = informe.nro + " · " + informe.direccion + ", " + informe.barrio;
      document.getElementById("visorPie").textContent = informe.esPropia
        ? "Foto que adjuntaste en este informe."
        : "Imagen de muestra: se reemplaza por la foto real cuando se conecte la base de datos.";
      visor.hidden = false;
    }
    function cerrar(){
      visor.hidden = true;
      visorImg.removeAttribute("src");
    }
    document.getElementById("visorCerrar").addEventListener("click", cerrar);
    visor.addEventListener("click", function(e){ if (e.target === visor) cerrar(); });
    document.addEventListener("keydown", function(e){ if (e.key === "Escape") cerrar(); });

    return { abrir: abrir, cerrar: cerrar };
  }

  /* ========= Barra superior: menú de usuario ========= */
  function inicializarTopbar(){
    var btnUsuario = document.getElementById("btnUsuario");
    var menuUsuario = document.getElementById("menuUsuario");
    if (!btnUsuario || !menuUsuario) return;

    btnUsuario.addEventListener("click", function(e){
      e.stopPropagation();
      var abierto = !menuUsuario.hidden;
      menuUsuario.hidden = abierto;
      btnUsuario.setAttribute("aria-expanded", String(!abierto));
    });
    menuUsuario.addEventListener("click", function(e){ e.stopPropagation(); });
    document.addEventListener("click", function(){
      menuUsuario.hidden = true;
      btnUsuario.setAttribute("aria-expanded","false");
    });
    document.addEventListener("keydown", function(e){
      if (e.key === "Escape"){
        menuUsuario.hidden = true;
        btnUsuario.setAttribute("aria-expanded","false");
      }
    });

    var btnSoporte = document.getElementById("btnSoporte");
    if (btnSoporte){
      btnSoporte.addEventListener("click", function(){
        menuUsuario.hidden = true;
        window.alert("Soporte municipal\n\nTeléfono: 0800-666-4357\nCorreo: soporte@moron.gob.ar\nAtención de lunes a viernes, de 8 a 16 h.");
      });
    }

    var btnSalir = document.getElementById("btnSalir");
    if (btnSalir){
      btnSalir.addEventListener("click", function(){
        menuUsuario.hidden = true;
        if (window.confirm("¿Querés cerrar la sesión?")){
          localStorage.removeItem("token");
          localStorage.removeItem("rol");
          window.location.href = "SignInSignUp.html";
        }
      });
    }
  }

  return {
    FOTO_DEFECTO: FOTO_DEFECTO,
    ZONAS: ZONAS,
    INCIDENTES: INCIDENTES,
    ESTADOS: ESTADOS,
    ORDEN_ESTADO: ORDEN_ESTADO,
    ETIQUETA_RIESGO: ETIQUETA_RIESGO,
    cargarDatos: cargarDatos,
    guardarDatos: guardarDatos,
    riesgoZona: riesgoZona,
    normalizar: normalizar,
    formatFecha: formatFecha,
    td: td,
    celdaIncidente: celdaIncidente,
    celdaEstado: celdaEstado,
    celdaFoto: celdaFoto,
    inicializarVisor: inicializarVisor,
    inicializarTopbar: inicializarTopbar
  };
})();
