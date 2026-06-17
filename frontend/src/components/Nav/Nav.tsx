import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { logout } from '../../services/authService';
import Button from '../Button/Button';

export default function Nav() {
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);
  const clearUser = useAuthStore((s) => s.clearUser);

  const handleLogout = async () => {
    await logout();
    clearUser();
  };

  const authSection = isLoading ? null : user ? (
    <>
      <span>{user.username}</span>
      <Button onClick={handleLogout}>Logout</Button>
    </>
  ) : (
    <>
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
    </>
  );

  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/search">Search</Link>
      {authSection}
    </nav>
  );
}
