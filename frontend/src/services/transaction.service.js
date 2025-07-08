
const API_URL = 'http://localhost:3001/api/transactions';

const getAllTransactions = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(response.status);
    }
    const data = await response.json();
    return data.data ? data : { data: [] };
  } catch (error) {
    console.error(error);
    return { data: [] };
  }
};


const createTransaction = async (transactionData) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transactionData),
    });
    if (!response.ok) {
      throw new Error(response.status);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creando la transaccion:', error);
    throw error;
  }
};

const deleteTransaction = async (transactionId) => {
  try {
    const response = await fetch(`${API_URL}/${transactionId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(response.status);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error borrando la transaccion:', error);
    throw error;
  }
};

export {
  getAllTransactions,
  createTransaction,
  deleteTransaction,
}; 