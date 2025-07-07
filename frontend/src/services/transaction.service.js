
const API_URL = 'http://localhost:3001/api/transactions';

const getAllTransactions = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('API Response:', data); // Para debug
    return data.data ? data : { data: [] };
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return { data: [] };
  }
};

const getSummary = async () => {
  try {
    const response = await fetch(`${API_URL}/summary`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.data ? data : { data: {} };
  } catch (error) {
    console.error('Error fetching summary:', error);
    return { data: {} };
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
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
};

export {
  getAllTransactions,
  getSummary,
  createTransaction,
}; 