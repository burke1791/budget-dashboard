import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders overview menu item', () => {
  render(<App />);
  const linkElement = screen.getByText(/Overview/i);
  expect(linkElement).toBeInTheDocument();
});
