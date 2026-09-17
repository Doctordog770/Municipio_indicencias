
const formulario = document.getElementById('form');

formulario.addEventListener('submit', async (e) => {
    
    e.preventDefault();

    const data = new FormData(formulario);


    const respuesta = await fetch('../../api/augh/Sing_Up_Code.php', {
        method: 'POST',
        body: data
    });

    var json = await respuesta.json();

    if(json.ok){
        document.getElementById('error').innerHTML = json.mensaje;
    } else {
        document.getElementById('error').innerHTML = json.mensaje;
    }

})

