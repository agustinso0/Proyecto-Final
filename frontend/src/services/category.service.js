//encapsulamiento de la logica para consumir la api del back

const API_URL = "http://localhost:3001/api/categories";

async function obtenerCategorias(){
    const response = await fetch(API_URL);
    const data = await response.json();
    return data;
}


async function crearCategoria(nombre){
    const token = localStorage.getItem("token")
    const response = await fetch(API_URL, {
        method: 'POST',
        headers:{
            "Content-Type": "application/json",
            "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NTZkMTEwZTYxNzk2ZDk3ODY2OTVhZSIsImlhdCI6MTc1MTI5MDk0NCwiZXhwIjoxNzUxODk1NzQ0fQ.yuPg3ytARx2szVHwp57yXXWs6-d28QdiOMlOhcSyQGw`
        },
        body: JSON.stringify({name: nombre})
    });
    const data = await response.json();
    return data;
}



export {obtenerCategorias, crearCategoria};