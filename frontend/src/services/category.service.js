//encapsulamiento de la logica para consumir la api del back

const API_URL = 'http://localhost:3001/api/categories';

const getAllCategories = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(response.status);
    }
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error llamando las categorias:', error);
    return [];
  }
};

const createCategory = async (name) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });
    if (!response.ok) {
      throw new Error(response.status);
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error creando la categoria:', error);
    throw error;
  }
};

export {
  getAllCategories,
  createCategory,
};