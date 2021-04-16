import React from 'react';
import { render, screen } from '@testing-library/react';
import Overview from '../../pages/overview';

describe('overview component', () => {
  test('renders properly', () => {
    render(<Overview />);
    expect(1).toBe(1);
  });
});