import React from 'react';
import ReactDOM from 'react-dom';
import { percent } from './logic';

test('converts 0.01 to 0', () => {
   expect(percent(0.01)).toBe(0);
})

test('converts 0.1 to 10', () => {
   expect(percent(0.1)).toBe(10);
})

test('converts 0.15 to 20', () => {
   expect(percent(0.15)).toBe(20);
})

test('converts 0.11 to 10', () => {
   expect(percent(0.11)).toBe(10);
})

test('converts 0.99 to 100', () => {
   expect(percent(0.99)).toBe(100);
})

test('converts 0.56 to 60', () => {
   expect(percent(0.56)).toBe(60);
})

// it('renders without crashing', () => {
//    const div = document.createElement('root');
//    ReactDOM.render(<App />, div);
// });