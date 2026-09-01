import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Calculator from './components/Calculator';
import History from './components/History';

const API_URL = 'http://localhost:5005/api/calculations';

function App() {
  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    try {
      const response = await axios.get(API_URL);
      setHistory(response.data);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleCalculate = async (calcData) => {
    try {
      const response = await axios.post(API_URL, calcData);
      setHistory([response.data, ...history]);
    } catch (error) {
      console.error('Error saving calculation:', error);
    }
  };

  return (
    <>
      <div className="background-elements">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
      </div>
      <div className="app-container">
        <Calculator onCalculate={handleCalculate} />
        <History history={history} />
      </div>
    </>
  );
}

export default App;
