//encapsulamiento de la logica para consumir la api del back

const API_URL = 'http://localhost:3001/api/categories';

const getAllCategories = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

export {
  getAllCategories,
};