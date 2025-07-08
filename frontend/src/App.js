import React, { useState } from 'react';
import './App.css';
import './styles/transactions.css';
import TransactionList from './components/TransactionList';
import TransactionForm from './components/TransactionForm';

function App() {
  const [shouldRefresh, setShouldRefresh] = useState(0);

  const handleTransactionCreated = () => {
    // incremento el contador para que se actualize la lista de transacciones
    setShouldRefresh(prev => prev + 1);
  };

  return (
    <div className="App">
        <h1>Control de gastos Personales</h1>
      <main>
        <TransactionForm onTransactionCreated={handleTransactionCreated} />
        <TransactionList key={shouldRefresh} />
      </main>
    </div>
  );
}

export default App;
