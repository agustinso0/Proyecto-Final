import { useState } from "react"


const Items = ({nombre, visto}) => {
    return(
        <li>{nombre}
            {visto ? '✅' : '⛔'}
        </li>
    )
}


export const ListadoApp = () => {
    const addTask = () => {
        setArreglo([...arreglo, {nombre:'nuevo', visto: false}])
        console.log(arreglo)
    }
    
    let listadoSecciones=[
        {nombre:'Instalaciones necesarios', visto: true},
        {nombre:'Uso de Vite', visto: true},
        {nombre:'Componentes', visto: true},
        {nombre:'Variables en JSX', visto: true},
        {nombre:'Props', visto: true},
        {nombre:'Eventos', visto: true},
        {nombre:'UseState', visto: true},
        {nombre:'Redux', visto: false},
        {nombre:'customHooks', visto: false},
        {nombre:'useCounter', visto: false}
    ]
    const [arreglo, setArreglo] = useState(listadoSecciones)
    return(
        <>
        <h1>Si lees esto tranqui que ando cocinando</h1>
        <h1>Listado de temas del curso</h1>
        <ol>
            {arreglo.map(item => <Items key={item.nombre} nombre={item.nombre} visto={item.visto}></Items>)}
        </ol>
        <button onClick={() => addTask()}>Añadir tarea</button>
        </>
    )
}
