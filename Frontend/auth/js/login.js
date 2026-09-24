import { fetch_endpoints } from "../../assets/js/fetch.js";

const formulario = document.getElementById("formLogin");

formulario.addEventListener('submit', async (e) => {

    e.preventDefault();

    var json = await fetch_endpoints(formulario, "../../api/augh/Sing_in_Code.php");

    if(json.ok){
        localStorage.setItem('token', json.TOKEN);
        localStorage.setItem('rol', json.ROL);
        localStorage.setItem('id_usuario', json.ID_USUARIO);
        document.getElementById("errorLogin").innerHTML = json.mensaje;
        window.location.href = "../Menu/menu_opciones.html";
    } else {
        document.getElementById("errorLogin").innerHTML = json.mensaje;
    }
})
