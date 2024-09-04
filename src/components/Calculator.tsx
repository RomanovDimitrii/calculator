import React, { useState, useEffect } from 'react';
import './Calculator.css';

const Calculator: React.FC = () => {
  const [input, setInput] = useState<string>(''); // отображаемое выражение
  const [result, setResult] = useState<string>('0'); // результат

  const handleButtonClick = (value: string) => {
    switch (value) {
      case '=':
        calculateResult();
        break;
      case 'C':
        clearInput();
        break;
      case '√':
        handleSquareRoot();
        break;
      case '%':
        appendInput('%');
        break;
      default:
        appendInput(value);
        break;
    }
  };

  const calculateResult = () => {
    try {
      const evaluatedResult = calculateExpression(input);
      setResult(evaluatedResult.toString());
    } catch (e) {
      setResult('Error');
      console.log(e);
    }
  };

  const clearInput = () => {
    setInput('');
    setResult('0');
  };

  const handleSquareRoot = () => {
    setInput(prev => {
      const lastChar = prev.slice(-1);

      if (/\d/.test(lastChar)) {
        const lastNumberMatch = prev.match(/(\d+(\.\d+)?)$/);
        if (lastNumberMatch) {
          const number = lastNumberMatch[0];
          const beforeNumber = prev.slice(0, prev.length - number.length);
          return `${beforeNumber}√${number}`;
        }
      }
      return `${prev}√`;
    });
  };

  const appendInput = (value: string) => {
    if (value === '0' && input === '0') return;
    setInput(prev => (prev === '0' && value !== '00' ? value : prev + value));
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
      const transformedExpression = expression
        .replace(/(\d+(\.\d+)?)√/g, '√$1')
        .replace(/√(\d+(\.\d+)?)/g, 'Math.sqrt($1)')
        .replace(/(\d+(\.\d+)?)%/g, (match, p1) => {
          const previousExpression = expression.substring(0, expression.indexOf(match)).trim();
          const lastOperatorMatch = previousExpression.match(/[-+/*]/g);
          const lastOperator = lastOperatorMatch ? lastOperatorMatch.pop() : null;
          const lastNumberMatch = previousExpression.match(/(\d+(\.\d+)?)(?=[-+/*]?$)/);
          const lastNumber = lastNumberMatch ? parseFloat(lastNumberMatch[0]) : 1;

          if (lastOperator === '+' || lastOperator === '-') {
            return `(${lastNumber} * ${parseFloat(p1)} / 100)`;
          } else {
            return `(${p1} / 100)`;
          }
        })
        .replace(/√/g, 'Math.sqrt');

      return new Function(`'use strict'; return (${transformedExpression})`)();
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
