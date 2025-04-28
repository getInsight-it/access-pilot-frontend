import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { AUTH_ROUTES } from '../common/constants/routes';

const PrivateRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to={AUTH_ROUTES.LOGIN} replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
