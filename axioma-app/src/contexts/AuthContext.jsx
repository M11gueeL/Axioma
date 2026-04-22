import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, logoutUser, getProfile } from '../api/authApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const clearAuthStorage = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_role');
    };

    const syncStoredRole = (profile) => {
        if (profile?.role) {
            localStorage.setItem('user_role', profile.role);
            return;
        }

        localStorage.removeItem('user_role');
    };

    const fetchProfile = async () => {
        const { data } = await getProfile();
        syncStoredRole(data);
        setUser(data);
        return data;
    };

    const loadUser = async () => {
        const token = localStorage.getItem('access_token');
        if (token) {
            try {
                await fetchProfile();
            } catch (error) {
                console.error("Error al cargar usuario:", error);
                clearAuthStorage();
                setUser(null);
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

            if (!data?.access || !data?.refresh) {
                throw new Error('Respuesta de autenticacion incompleta');
            }

            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);
            await fetchProfile();

            return { success: true };
        } catch (error) {
            const apiMessage =
                error.response?.data?.detail ||
                error.response?.data?.non_field_errors?.[0];

            clearAuthStorage();
            setUser(null);

            return { 
                success: false, 
                message: apiMessage || "Error en las credenciales" 
            };
        }
    };

    const logout = async () => {
        try {
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
                await logoutUser(refreshToken);
            }
        } catch (error) {
            console.error("Logout fallido en servidor", error);
        } finally {
            clearAuthStorage();
            setUser(null);
            window.location.href = '/login';
        }
    };

    const value = {
        user,
        loading,
        login,
        logout,
        reloadProfile: fetchProfile,
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