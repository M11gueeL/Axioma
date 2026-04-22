import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RoleProtectedRoute = ({ allowedRoles }) => {
    const { user, isAuthenticated, loading } = useAuth();

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-stone-50">Cargando...</div>;

    if (!isAuthenticated) return <Navigate to="/login" replace />;

    // Si el rol del usuario no está en el array de roles permitidos, lo devolvemos al dashboard
    if (!allowedRoles.includes(user?.role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

export default RoleProtectedRoute;