import { useEffect, useState } from 'react'
import {obtenerCategorias, crearCategoria} from '../services/category.service'

export function CategoryList(){
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    

    useEffect(()=> {
        async function fetchCategorias() {
            try {
                const data = await obtenerCategorias();
                setCategories(data.data)
            } catch (error) {
                console.error("Error al obtener las categorias:", error)
            }
        }
        fetchCategorias();
    },[])


    const handleSubmit = async (e) => {
        e.preventDefault(); // evita el refresh
        if(!newCategory.trim()) return;
        try {
            await crearCategoria(newCategory);
            const data = await obtenerCategorias();
            setCategories(data.data);
            setNewCategory('')
        } catch (error) {
            console.error("Error al crear la categoria:", error);
        }
    }

    return(
        <div>
            
            <form onSubmit={handleSubmit}>
                <input 
                type="text" 
                value={newCategory} 
                onChange={e => setNewCategory(e.target.value)}
                placeholder='Nueva Categoria' 
                />
                <button type='submit'>Crear</button>
            </form>



            <ul>
                {categories && categories.map(cat =>(
                    <li key={cat._id}>{cat.name}</li>
                ))}
            </ul>
        </div>
    );
    
}

