import React from 'react';
import ReactDOM from 'react-dom';
import { percent } from './logic';
import App from './index.js';

test('converts 0.05 to 5', () => {
   expect(percent(0.05)).toBe('5');
})

test('converts 1 to 100', () => {
   expect(percent(1)).toBe('100');
})

test('converts 0.5 to 50', () => {
   expect(percent(0.5)).toBe('50');
})

test('converts 0.33 to 33', () => {
   expect(percent(0.33)).toBe('33');
})

test('converts .99 to 99', () => {
   expect(percent(.99)).toBe('99');
})

it('renders without crashing', () => {
   const div = document.createElement('root');
   ReactDOM.render(<App />, div);
});