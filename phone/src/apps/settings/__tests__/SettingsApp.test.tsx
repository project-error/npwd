import React from 'react';
import { render, screen } from '@testing-library/react';
import Phone from '../../../Phone';

describe('settings app', () => {
  beforeEach(() => {
    render(<Phone />);
  });

  test('default settings are correct', () => {});
});
