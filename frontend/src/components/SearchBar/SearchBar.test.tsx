import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from './SearchBar';

describe('SearchBar', () => {
  it('calls onSearch with the trimmed query on submit', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);

    await user.type(screen.getByRole('textbox', { name: 'Search for a film' }), '  dune  ');
    await user.click(screen.getByRole('button', { name: 'Search' }));

    expect(onSearch).toHaveBeenCalledExactlyOnceWith('dune');
  });

  it('does not call onSearch when the query is only whitespace', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);

    await user.type(screen.getByRole('textbox', { name: 'Search for a film' }), '   ');
    await user.click(screen.getByRole('button', { name: 'Search' }));

    expect(onSearch).not.toHaveBeenCalled();
  });

  it('disables the button and shows a waiting label while loading', () => {
    render(<SearchBar onSearch={vi.fn()} loading />);

    expect(screen.getByRole('button', { name: 'Searching…' })).toBeDisabled();
  });
});
