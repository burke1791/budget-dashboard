import '../../__mocks__/matchMedia.mock';
import React from 'react';
import { render, screen } from '@testing-library/react';
import Budget from '../../pages/budget';


describe('budget page', () => {
  test('renders properly', () => {
    render(<Budget />);
    expect(1).toBe(1);
  });
});