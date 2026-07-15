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

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // network failure: the server session will expire on its own
    } finally {
      clearUser();
    }
  };

  const authSection = isLoading ? null : user ? (
    <div className={styles.auth}>
      <span className={styles.username}>{user.username}</span>
      <NavLink to="/lists" className={navLinkClass}>
        My Lists
      </NavLink>
      <NavLink to="/settings" className={navLinkClass}>
        Settings
      </NavLink>
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  ) : (
    <div className={styles.auth}>
      <NavLink to="/login" className={navLinkClass}>
        Login
      </NavLink>
      <NavLink to="/register" className={navLinkClass}>
        Register
      </NavLink>
    </div>
  );

  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.brand}>
        🍿 Popcorn Library
      </Link>
      <NavLink to="/search" className={navLinkClass}>
        Search
      </NavLink>
      <NavLink to="/public-lists" className={navLinkClass}>
        Public Lists
      </NavLink>
      {authSection}
    </nav>
  );
};

export default Nav;
