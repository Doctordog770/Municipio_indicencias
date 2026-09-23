import { fetch_endpoints } from "./fetch.js";

const formulario = document.getElementById("formLogin");

formulario.addEventListener('submit', async (e) => {

    e.preventDefault();

    var json = await fetch_endpoints(formulario, "../api/augh/Sing_in_Code.php");

    if(json.ok){
        localStorage.setItem('token', json.TOKEN);
        localStorage.setItem('rol', json.ROL);
        document.getElementById("errorLogin").innerHTML = json.mensaje;
    } else {
        document.getElementById("errorLogin").innerHTML = json.mensaje;
    }
})
