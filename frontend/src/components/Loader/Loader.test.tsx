import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Loader from './Loader';

describe('Loader', () => {
  it('renders a spinner with the status role', () => {
    render(<Loader />);

    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
