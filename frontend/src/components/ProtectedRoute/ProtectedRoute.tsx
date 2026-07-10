import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import Loader from '../Loader/Loader';

const ProtectedRoute = () => {
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);

  if (isLoading) return <Loader />;

  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
