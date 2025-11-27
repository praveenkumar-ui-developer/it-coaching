import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    // Redirect based on user role
    const roleRoutes = {
      admin: '/admin',
      instructor: '/instructor',
      student: '/dashboard'
    };
    return <Navigate to={roleRoutes[user?.role] || '/dashboard'} replace />;
  }

  return children;
};

export default ProtectedRoute;