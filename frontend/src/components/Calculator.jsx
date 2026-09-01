import React, { useState, useEffect } from 'react';

const Calculator = ({ onCalculate }) => {
  const [currentOperand, setCurrentOperand] = useState('0');
  const [previousOperand, setPreviousOperand] = useState('');
  const [operation, setOperation] = useState(undefined);

  const clear = () => {
    setCurrentOperand('0');
    setPreviousOperand('');
    setOperation(undefined);
  };

  const deleteNumber = () => {
    if (currentOperand === '0') return;
    if (currentOperand.length === 1) {
      setCurrentOperand('0');
      return;
    }
    setCurrentOperand(currentOperand.slice(0, -1));
  };

  const appendNumber = (number) => {
    if (number === '.' && currentOperand.includes('.')) return;
    if (currentOperand === '0' && number !== '.') {
      setCurrentOperand(number.toString());
      return;
    }
    setCurrentOperand(currentOperand + number.toString());
  };

  const chooseOperation = (op) => {
    if (currentOperand === '0' && previousOperand === '') return;
    
    if (op === '%') {
      const current = parseFloat(currentOperand);
      if (isNaN(current)) return;
      setCurrentOperand((current / 100).toString());
      return;
    }

    if (previousOperand !== '') {
      compute(op);
      return;
    }
    setOperation(op);
    setPreviousOperand(currentOperand);
    setCurrentOperand('0');
  };

  const compute = (nextOp = undefined) => {
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);
    if (isNaN(prev) || isNaN(current)) return;
    
    let computation;
    switch (operation) {
      case '+':
        computation = prev + current;
        break;
      case '-':
        computation = prev - current;
        break;
      case '×':
        computation = prev * current;
        break;
      case '÷':
        if (current === 0) {
          alert("Cannot divide by zero!");
          clear();
          return;
        }
        computation = prev / current;
        break;
      default:
        return;
    }
    
    // Fix float precision
    computation = parseFloat(computation.toFixed(10));
    
    // Save history
    const expression = `${prev} ${operation} ${current}`;
    onCalculate({ expression, result: computation.toString() });

    setCurrentOperand(computation.toString());
    setOperation(nextOp);
    setPreviousOperand(nextOp ? computation.toString() : '');
    if (!nextOp) {
       // if compute was called by equals, reset previous
       setPreviousOperand('');
    } else {
       // if compute was called by another operator, we prepare for next
       setCurrentOperand('0');
    }
  };

  const getDisplayNumber = (number) => {
    if (number === '') return '';
    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split('.')[0]);
    const decimalDigits = stringNumber.split('.')[1];
    let integerDisplay;
    
    if (isNaN(integerDigits)) {
      integerDisplay = '0';
    } else {
      integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
    }
    
    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`;
    } else {
      return integerDisplay;
    }
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key >= '0' && e.key <= '9') appendNumber(e.key);
      if (e.key === '.') appendNumber('.');
      if (e.key === '=' || e.key === 'Enter') {
        e.preventDefault();
        compute();
      }
      if (e.key === 'Backspace') deleteNumber();
      if (e.key === 'Escape') clear();
      if (e.key === '+' || e.key === '-') chooseOperation(e.key);
      if (e.key === '*') chooseOperation('×');
      if (e.key === '/') chooseOperation('÷');
      if (e.key === '%') chooseOperation('%');
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentOperand, previousOperand, operation]);

  const addAnimation = (e) => {
    const btn = e.target;
    btn.classList.add('press-anim');
    setTimeout(() => {
      btn.classList.remove('press-anim');
    }, 200);
  };

  return (
    <div className="calculator-container">
      <div className="calculator">
        <div className="display">
          <div className="previous-operand">
            {previousOperand && operation ? `${getDisplayNumber(previousOperand)} ${operation}` : ''}
          </div>
          <div className="current-operand">
            {getDisplayNumber(currentOperand)}
          </div>
        </div>
        <div className="keypad">
          <button className="btn btn-action" onClick={(e) => { addAnimation(e); clear(); }}>AC</button>
          <button className="btn btn-action" onClick={(e) => { addAnimation(e); deleteNumber(); }}>DEL</button>
          <button className="btn btn-operator" onClick={(e) => { addAnimation(e); chooseOperation('%'); }}>%</button>
          <button className="btn btn-operator" onClick={(e) => { addAnimation(e); chooseOperation('÷'); }}>÷</button>
          
          <button className="btn" onClick={(e) => { addAnimation(e); appendNumber('7'); }}>7</button>
          <button className="btn" onClick={(e) => { addAnimation(e); appendNumber('8'); }}>8</button>
          <button className="btn" onClick={(e) => { addAnimation(e); appendNumber('9'); }}>9</button>
          <button className="btn btn-operator" onClick={(e) => { addAnimation(e); chooseOperation('×'); }}>×</button>
          
          <button className="btn" onClick={(e) => { addAnimation(e); appendNumber('4'); }}>4</button>
          <button className="btn" onClick={(e) => { addAnimation(e); appendNumber('5'); }}>5</button>
          <button className="btn" onClick={(e) => { addAnimation(e); appendNumber('6'); }}>6</button>
          <button className="btn btn-operator" onClick={(e) => { addAnimation(e); chooseOperation('-'); }}>-</button>
          
          <button className="btn" onClick={(e) => { addAnimation(e); appendNumber('1'); }}>1</button>
          <button className="btn" onClick={(e) => { addAnimation(e); appendNumber('2'); }}>2</button>
          <button className="btn" onClick={(e) => { addAnimation(e); appendNumber('3'); }}>3</button>
          <button className="btn btn-operator" onClick={(e) => { addAnimation(e); chooseOperation('+'); }}>+</button>
          
          <button className="btn btn-zero" onClick={(e) => { addAnimation(e); appendNumber('0'); }}>0</button>
          <button className="btn" onClick={(e) => { addAnimation(e); appendNumber('.'); }}>.</button>
          <button className="btn btn-equals" onClick={(e) => { addAnimation(e); compute(); }}>=</button>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
