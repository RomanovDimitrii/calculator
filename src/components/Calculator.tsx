import React, { useState, useEffect } from 'react';
import './Calculator.css';

const Calculator: React.FC = () => {
  const [input, setInput] = useState<string>(''); // отображаемое выражение
  const [result, setResult] = useState<string>('0'); // результат

  const handleButtonClick = (value: string) => {
    if (value === '=') {
      try {
        const evaluatedResult = calculateExpression(input);
        setResult(evaluatedResult.toString());
      } catch (e) {
        setResult('Error');
        console.log(e);
      }
    } else if (value === 'C') {
      setInput('');
      setResult('0');
    } else {
      // Проверка на начальный ввод
      if (input === '0' && value === '0') return;
      if (input === '' && value === '0') {
        setInput('0');
      } else {
        setInput(prev => (prev === '0' && value !== '00' ? value : prev + value));
      }
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    const validKeys = '0123456789+-*/%=().';
    if (event.key === 'Backspace') {
      setInput(prev => prev.slice(0, -1));
    } else if (validKeys.includes(event.key)) {
      handleButtonClick(event.key);
    } else if (event.key === 'Enter') {
      handleButtonClick('=');
    } else if (event.key === 'Escape') {
      handleButtonClick('C');
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [input]);

  const calculateExpression = (expression: string) => {
    try {
      const sanitizedExpression = expression.replace(/[^-()\d/*+.]/g, '');
      return Function(`'use strict'; return (${sanitizedExpression})`)();
    } catch (e) {
      console.log(e);
      return 'Error';
    }
  };

  const handleButtonFocus = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.currentTarget.blur();
  };

  return (
    <div className="calculator__wrap">
      <div className="calculator">
        {/* <div className="calculator__display">
          <div data-testid="input-display">{input || '0'}</div>
        </div> */}
        <div className="calculator__display" data-testid="input-display">
          {input || '0'}
        </div>
        <div className="calculator__result" data-testid="result-display">
          {result}
        </div>
        <div className="calculator__buttons">
          {[
            'C',
            '√',
            '%',
            '/',
            '7',
            '8',
            '9',
            '*',
            '4',
            '5',
            '6',
            '-',
            '1',
            '2',
            '3',
            '+',
            '00',
            '0',
            ',',
            '='
          ].map(btn => (
            <button
              key={btn}
              className={`button ${btn === '=' ? 'button_equally' : ''}`}
              onClick={event => {
                handleButtonClick(btn);
                handleButtonFocus(event);
              }}
              data-testid={`btn-${btn}`}
            >
              {btn}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calculator;
