import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { logout } from '../../services/authService';
import Button from '../Button/Button';
import styles from './Nav.module.scss';

const navLinkClass = ({ isActive }: { isActive: boolean }) => (isActive ? styles.active : '');

const Nav = () => {
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);
  const clearUser = useAuthStore((s) => s.clearUser);
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // network failure: the server session will expire on its own
    } finally {
      clearUser();
      closeMenu();
    }
  };

  const authSection = isLoading ? null : user ? (
    <div className={styles.auth}>
      <span className={styles.username}>{user.username}</span>
      <NavLink to="/lists" className={navLinkClass} onClick={closeMenu}>
        My Lists
      </NavLink>
      <NavLink to="/settings" className={navLinkClass} onClick={closeMenu}>
        Settings
      </NavLink>
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  ) : (
    <div className={styles.auth}>
      <NavLink to="/login" className={navLinkClass} onClick={closeMenu}>
        Login
      </NavLink>
      <NavLink to="/register" className={navLinkClass} onClick={closeMenu}>
        Register
      </NavLink>
    </div>
  );

  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.brand} onClick={closeMenu}>
        🍿 Popcorn Library
      </Link>
      <button
        type="button"
        className={styles.burger}
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? '✕' : '☰'}
      </button>
      <div className={isOpen ? `${styles.links} ${styles.open}` : styles.links}>
        <NavLink to="/search" className={navLinkClass} onClick={closeMenu}>
          Search
        </NavLink>
        <NavLink to="/public-lists" className={navLinkClass} onClick={closeMenu}>
          Public Lists
        </NavLink>
        {authSection}
      </div>
    </nav>
  );
};

export default Nav;
