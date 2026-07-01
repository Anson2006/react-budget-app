import { useState, useEffect } from 'react';

function App() {
  // --- 1. STATE MANAGEMENT & STORAGE ---
  const [transactions, setTransactions] = useState(() => {
    return JSON.parse(localStorage.getItem('budgetTransactions')) || [];
  });
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');

  // Sync entries to localstorage whenever state changes
  useEffect(() => {
    localStorage.setItem('budgetTransactions', JSON.stringify(transactions));
  }, [transactions]);

  // --- 2. CALCULATIONS ---
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const netBalance = totalIncome - totalExpenses;

  // --- 3. EVENT HANDLERS ---
  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (!description.trim() || !amount || parseFloat(amount) <= 0) {
      return alert('Please enter a valid description and an amount greater than 0.');
    }

    const newTransaction = {
      id: Date.now(),
      description: description.trim(),
      amount: parseFloat(amount),
      type: type
    };

    setTransactions([newTransaction, ...transactions]);
    setDescription('');
    setAmount('');
  };

  const handleDelete = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  return (
    <div className="app-wrapper">
      <h1>💰 Simple Budget Tracker</h1>

      {/* Dashboard Metrics overview */}
      <div className="dashboard-grid">
        <div className="card">
          <h3>Total Balance</h3>
          <p style={{ fontWeight: 'bold', fontSize: '20px', color: netBalance >= 0 ? '#2e7d32' : '#c62828' }}>
            ${netBalance.toFixed(2)}
          </p>
        </div>
        <div className="card income">
          <h3>Total Income</h3>
          <p>${totalIncome.toFixed(2)}</p>
        </div>
        <div className="card expense">
          <h3>Total Expenses</h3>
          <p>${totalExpenses.toFixed(2)}</p>
        </div>
      </div>

      {/* Forms & History split layout */}
      <div className="main-layout">
        <section className="form-section">
          <h2>Add New Transaction</h2>
          <form onSubmit={handleAddTransaction}>
            <input 
              type="text" 
              placeholder="Description (e.g., Grocery, Salary)" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <input 
              type="number" 
              step="0.01"
              placeholder="Amount ($)" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="expense">Expense 🔴</option>
              <option value="income">Income 🟢</option>
            </select>
            <button type="submit">Add Entry</button>
          </form>
        </section>

        <section className="list-section">
          <h2>Transaction History</h2>
          {transactions.length === 0 ? <p>No entries tracked yet.</p> : (
            <ul>
              {transactions.map(t => (
                <li 
                  key={t.id} 
                  className={`transaction-item ${t.type === 'income' ? 'income-item' : 'expense-item'}`}
                >
                  <span>{t.description}</span>
                  <span>
                    {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                    <button className="delete-btn" onClick={() => handleDelete(t.id)}>❌</button>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

export default App;