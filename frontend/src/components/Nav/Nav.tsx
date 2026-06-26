import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { logout } from '../../services/authService';
import Button from '../Button/Button';
import styles from './Nav.module.scss';

const Nav = () => {
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);
  const clearUser = useAuthStore((s) => s.clearUser);

  const handleLogout = async () => {
    await logout();
    clearUser();
  };

  const authSection = isLoading ? null : user ? (
    <div className={styles.auth}>
      <span className={styles.username}>{user.username}</span>
      <Link to={'/lists'}>My Lists</Link>
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  ) : (
    <div className={styles.auth}>
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
    </div>
  );

  return (
    <nav className={styles.nav}>
      <Link to="/">Home</Link>
      <Link to="/search">Search</Link>
      {authSection}
    </nav>
  );
};

export default Nav;
