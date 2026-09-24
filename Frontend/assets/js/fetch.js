 export async function fetch_endpoints(formulario,path){
    
    const data = new FormData(formulario);

    const token = localStorage.getItem('token');
    const headers = token ? { 'Authorization': 'Bearer ' + token } : {};

    const respuesta = await fetch(path, {
        method: 'POST',
        headers: headers,
        body: data
    });

    var json = await respuesta.json();

    return json;
}

export async function fetch_autenticado(path, method = 'GET') {

    const token = localStorage.getItem('token');

    const respuesta = await fetch(path, {
        method: method,
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });

    var json = await respuesta.json();

    return json;
}
