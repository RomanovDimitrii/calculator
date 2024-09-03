import { render, fireEvent, screen, cleanup } from '@testing-library/react';
// @ts-expect-error: React import is required for JSX usage in this file
import React from 'react';
import Calculator from './Calculator';
import { describe, it, expect, afterEach } from 'vitest';

afterEach(cleanup);

describe('Calculator', () => {
  it('should render calculator with default values', () => {
    render(<Calculator />);
    const inputDisplay = screen.getByTestId('input-display');
    const resultDisplay = screen.getByTestId('result-display');

    expect(inputDisplay.textContent).toBe('0'); // Проверка начального значения inputDisplay
    expect(resultDisplay.textContent).toBe('0'); // Проверка начального значения resultDisplay
  });

  it('should update input when buttons are clicked', () => {
    render(<Calculator />);
    const button1 = screen.getByTestId('btn-1');
    const button2 = screen.getByTestId('btn-2');
    const plusButton = screen.getByTestId('btn-+');
    const equalsButton = screen.getByTestId('btn-=');

    fireEvent.click(button1); // Клики по кнопкам
    fireEvent.click(plusButton);
    fireEvent.click(button2);
    fireEvent.click(equalsButton);

    const inputDisplay = screen.getByTestId('input-display');
    const resultDisplay = screen.getByTestId('result-display');

    expect(inputDisplay.textContent).toBe('1+2');
    expect(resultDisplay.textContent).toBe('3');
  });

  it('should reset input and result when "C" is clicked', () => {
    render(<Calculator />);
    const button1 = screen.getByTestId('btn-1');
    const buttonC = screen.getByTestId('btn-C');

    fireEvent.click(button1);
    fireEvent.click(buttonC);

    const inputDisplay = screen.getByTestId('input-display');
    const resultDisplay = screen.getByTestId('result-display');

    expect(inputDisplay.textContent).toBe('0'); // Проверка сброса значения inputDisplay
    expect(resultDisplay.textContent).toBe('0'); // Проверка сброса значения resultDisplay
  });

  it('should handle division by zero', () => {
    render(<Calculator />);
    const button1 = screen.getByTestId('btn-1');
    const button0 = screen.getByTestId('btn-0');
    const divideButton = screen.getByTestId('btn-/');
    const equalsButton = screen.getByTestId('btn-=');

    fireEvent.click(button1);
    fireEvent.click(divideButton);
    fireEvent.click(button0);
    fireEvent.click(equalsButton);

    const inputDisplay = screen.getByTestId('input-display');
    const resultDisplay = screen.getByTestId('result-display');

    expect(inputDisplay.textContent).toBe('1/0'); // Проверка введенного выражения
    expect(resultDisplay.textContent).toBe('Infinity'); // Проверка результата деления на 0
  });

  it('should display "Error" for invalid expressions', () => {
    render(<Calculator />);
    const button1 = screen.getByTestId('btn-1');
    const buttonPlus = screen.getByTestId('btn-+');
    const equalsButton = screen.getByTestId('btn-=');

    fireEvent.click(button1);
    fireEvent.click(buttonPlus);
    fireEvent.click(equalsButton);

    const resultDisplay = screen.getByTestId('result-display');

    expect(resultDisplay.textContent).toBe('Error'); // Проверка отображения ошибки при вводе "1+"
  });

  it('should handle keyboard input', () => {
    render(<Calculator />);
    fireEvent.keyDown(window, { key: '1' });
    fireEvent.keyDown(window, { key: '+' });
    fireEvent.keyDown(window, { key: '2' });
    fireEvent.keyDown(window, { key: 'Enter' });

    const inputDisplay = screen.getByTestId('input-display');
    const resultDisplay = screen.getByTestId('result-display');

    expect(inputDisplay.textContent).toBe('1+2'); // Проверка введенного выражения
    expect(resultDisplay.textContent).toBe('3'); // Проверка результата
  });

  it('should clear input when Escape is pressed', () => {
    render(<Calculator />);
    fireEvent.keyDown(window, { key: '1' });
    fireEvent.keyDown(window, { key: 'Escape' });

    const inputDisplay = screen.getByTestId('input-display');
    const resultDisplay = screen.getByTestId('result-display');

    expect(inputDisplay.textContent).toBe('0'); // Проверка сброса значения inputDisplay
    expect(resultDisplay.textContent).toBe('0'); // Проверка сброса значения resultDisplay
  });

  it('should handle backspace key correctly', () => {
    render(<Calculator />);
    const button1 = screen.getByTestId('btn-1');
    const button2 = screen.getByTestId('btn-2');
    const plusButton = screen.getByTestId('btn-+');

    fireEvent.click(button1);
    fireEvent.click(plusButton);
    fireEvent.click(button2);

    let inputDisplay = screen.getByTestId('input-display');
    expect(inputDisplay.textContent).toBe('1+2'); // Проверка введенного выражения

    // Нажатие клавиши Backspace для удаления последнего символа
    fireEvent.keyDown(window, { key: 'Backspace' });

    inputDisplay = screen.getByTestId('input-display');
    expect(inputDisplay.textContent).toBe('1+');

    // второе нажатие Backspace
    fireEvent.keyDown(window, { key: 'Backspace' });

    inputDisplay = screen.getByTestId('input-display');
    expect(inputDisplay.textContent).toBe('1');

    // третье Backspace
    fireEvent.keyDown(window, { key: 'Backspace' });

    inputDisplay = screen.getByTestId('input-display');
    expect(inputDisplay.textContent).toBe('0');
  });

  it('should correctly calculate square root followed by addition', () => {
    render(<Calculator />);
    const sqrtButton = screen.getByTestId('btn-√');
    const button9 = screen.getByTestId('btn-9');
    const plusButton = screen.getByTestId('btn-+');
    const button3 = screen.getByTestId('btn-3');
    const equalsButton = screen.getByTestId('btn-=');

    fireEvent.click(sqrtButton);
    fireEvent.click(button9);
    fireEvent.click(plusButton);
    fireEvent.click(button3);
    fireEvent.click(equalsButton);

    const resultDisplay = screen.getByTestId('result-display');

    expect(resultDisplay.textContent).toBe('6'); // Проверка корректного вычисления √9 + 3
  });

  it('should correctly calculate complex percentage expression', () => {
    render(<Calculator />);

    const button1 = screen.getByTestId('btn-1');
    const button0 = screen.getByTestId('btn-0');
    const button5 = screen.getByTestId('btn-5');
    const plusButton = screen.getByTestId('btn-+');
    const percentButton = screen.getByTestId('btn-%');
    const multiplyButton = screen.getByTestId('btn-*');
    const equalsButton = screen.getByTestId('btn-=');

    fireEvent.keyDown(window, { key: '(' });
    fireEvent.click(button1);
    fireEvent.click(button0);
    fireEvent.click(plusButton);
    fireEvent.click(button5);
    fireEvent.click(button0);
    fireEvent.click(percentButton);
    fireEvent.keyDown(window, { key: ')' });
    fireEvent.click(multiplyButton);
    fireEvent.click(button1);
    fireEvent.click(button0);
    fireEvent.click(percentButton);
    fireEvent.click(equalsButton);

    const resultDisplay = screen.getByTestId('result-display');

    expect(resultDisplay.textContent).toBe('1.5'); // Проверка корректного вычисления (10 + 50%) * 10%
  });
});
