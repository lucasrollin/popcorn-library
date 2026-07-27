import { describe, it, expect, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Nav from './Nav';
import { useAuthStore } from '../../stores/authStore';

// Nav uses <Link>/<NavLink>, which need a Router ancestor to render.
const renderNav = () =>
  render(
    <MemoryRouter>
      <Nav />
    </MemoryRouter>,
  );

// The store is a singleton, so its state leaks between tests. Reset it to the
// same values create() starts with after each one.
afterEach(() => {
  useAuthStore.setState({ user: null, isLoading: true });
});

describe('Nav', () => {
  it('shows no auth links while the session is still loading', () => {
    useAuthStore.setState({ user: null, isLoading: true });
    renderNav();

    // The guest links only appear once loading resolves.
    expect(screen.queryByRole('link', { name: 'Login' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'My Lists' })).not.toBeInTheDocument();
  });

  it('shows Login and Register when no one is signed in', () => {
    useAuthStore.setState({ user: null, isLoading: false });
    renderNav();

    expect(screen.getByRole('link', { name: 'Login' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Register' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'My Lists' })).not.toBeInTheDocument();
  });

  it('shows the username and member links when signed in', () => {
    useAuthStore.setState({
      user: { id: '1', email: 'alice@example.com', username: 'alice', avatar: null },
      isLoading: false,
    });
    renderNav();

    expect(screen.getByText('alice')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'My Lists' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Settings' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Logout' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Login' })).not.toBeInTheDocument();
  });
});
