import { fetch_endpoints } from "./fetch.js";

const formulario = document.getElementById('formRegister');

formulario.addEventListener('submit', async (e) => {

    e.preventDefault();

    var json = await fetch_endpoints(formulario, "../../api/augh/Sing_Up_Code.php");

    if(json.ok){
        document.getElementById("errorRegister").innerHTML = json.mensaje;
    } else {
        document.getElementById("errorRegister").innerHTML = json.mensaje;
    }
})
