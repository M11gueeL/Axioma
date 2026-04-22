import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-stone-50">Cargando...</div>;

    // Si no está logueado, lo mandamos a iniciar sesión
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;