import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, logoutUser } from '../api/authApi';
import { getProfile } from '../api/authApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Función para cargar los datos del usuario si hay un token válido
    const loadUser = async () => {
        const token = localStorage.getItem('access_token');
        if (token) {
            try {
                
                const role = localStorage.getItem('user_role');
                setUser({ role }); 
            } catch (error) {
                console.error("Error al cargar usuario:", error);
                logout();
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        loadUser();
    }, []);

    const login = async (credentials) => {
        try {
            const { data } = await loginUser(credentials);
            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);
            localStorage.setItem('user_role', data.user.role); 
            
            setUser(data.user);
            return { success: true };
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.detail || "Error en las credenciales" 
            };
        }
    };

    const logout = async () => {
        try {
            await logoutUser();
        } catch (error) {
            console.error("Logout fallido en servidor", error);
        } finally {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user_role');
            setUser(null);
            window.location.href = '/login';
        }
    };

    const value = {
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ADMIN'
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider');
    }
    return context;
};