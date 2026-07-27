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

  // Regression test for the browser back/forward bug: when the page changes
  // defaultValue on an already-mounted SearchBar (the URL query changed), the
  // input must follow instead of keeping its stale text.
  it('updates the input when defaultValue changes on an open SearchBar', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<SearchBar defaultValue="dune" onSearch={vi.fn()} />);
    const input = screen.getByRole('textbox', { name: 'Search for a film' });

    // The user edits the box away from the initial URL value.
    await user.clear(input);
    await user.type(input, 'star wars');
    expect(input).toHaveValue('star wars');

    // The URL query changes (e.g. browser back) → the page re-renders us with
    // a new defaultValue. The input must snap to it.
    rerender(<SearchBar defaultValue="matrix" onSearch={vi.fn()} />);
    expect(input).toHaveValue('matrix');
  });

  // The other half of the pattern: re-rendering with the SAME defaultValue must
  // not clobber what the user has typed (the `if` guard protects this).
  it('keeps the typed text when defaultValue is unchanged across a re-render', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<SearchBar defaultValue="dune" onSearch={vi.fn()} />);
    const input = screen.getByRole('textbox', { name: 'Search for a film' });

    await user.clear(input);
    await user.type(input, 'star wars');

    rerender(<SearchBar defaultValue="dune" onSearch={vi.fn()} />);
    expect(input).toHaveValue('star wars');
  });
});
