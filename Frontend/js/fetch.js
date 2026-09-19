 export async function fetch_endpoints(formulario,path){
    
    const data = new FormData(formulario);

    const respuesta = await fetch(path, {
        method: 'POST',
        body: data
    });

    var json = await respuesta.json();

    return json;
}