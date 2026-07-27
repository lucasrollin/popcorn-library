import { describe, it, expect, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { useAuthStore } from '../../stores/authStore';

// A tiny throwaway router: /private is guarded by ProtectedRoute and renders a
// marker; /login renders its own marker. We start at /private and then check
// which marker showed up — that tells us whether we were let in or redirected.
const renderAtPrivate = () =>
  render(
    <MemoryRouter initialEntries={['/private']}>
      <Routes>
        <Route path="/login" element={<p>login page</p>} />
        <Route element={<ProtectedRoute />}>
          <Route path="/private" element={<p>secret content</p>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );

afterEach(() => {
  useAuthStore.setState({ user: null, isLoading: true });
});

describe('ProtectedRoute', () => {
  it('shows a loader while the session is still resolving', () => {
    useAuthStore.setState({ user: null, isLoading: true });
    renderAtPrivate();

    // Neither destination has rendered yet — we're still deciding.
    expect(screen.queryByText('secret content')).not.toBeInTheDocument();
    expect(screen.queryByText('login page')).not.toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('redirects to /login when no one is signed in', () => {
    useAuthStore.setState({ user: null, isLoading: false });
    renderAtPrivate();

    expect(screen.getByText('login page')).toBeInTheDocument();
    expect(screen.queryByText('secret content')).not.toBeInTheDocument();
  });

  it('renders the protected content when signed in', () => {
    useAuthStore.setState({
      user: { id: '1', email: 'alice@example.com', username: 'alice', avatar: null },
      isLoading: false,
    });
    renderAtPrivate();

    expect(screen.getByText('secret content')).toBeInTheDocument();
    expect(screen.queryByText('login page')).not.toBeInTheDocument();
  });
});
