import axios from 'axios';

// Instancia principal
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Interceptor de Solicitudes (Request)
// Inyecta el Access Token en cada petición si existe en localStorage
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        const requestUrl = config.url || '';
        const authExcludedPaths = ['/login/', '/register/', '/refresh/'];
        const shouldSkipAuthHeader = authExcludedPaths.some((path) => requestUrl.endsWith(path));

        if (token && !shouldSkipAuthHeader) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor de Respuestas (Response)
// Captura errores 401 para intentar renovar el token
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (!originalRequest) return Promise.reject(error);

        const requestUrl = originalRequest.url || '';
        const authRetryExcludedPaths = ['/login/', '/register/', '/refresh/', '/logout/'];
        const shouldSkipRefresh = authRetryExcludedPaths.some((path) => requestUrl.endsWith(path));

        // Si el error es 401 (Unauthorized) y no hemos intentado renovar aún
        if (error.response?.status === 401 && !originalRequest._retry && !shouldSkipRefresh) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refresh_token');
                if (!refreshToken) throw new Error('No hay refresh token disponible');

                // Usamos una instancia limpia de axios para evitar loops infinitos
                const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/refresh/`, {
                    refresh: refreshToken
                });

                // Guardamos el nuevo access token
                localStorage.setItem('access_token', data.access);
                
                // Actualizamos el header de la petición original y reintentamos
                originalRequest.headers = originalRequest.headers || {};
                originalRequest.headers.Authorization = `Bearer ${data.access}`;
                return api(originalRequest);

            } catch (refreshError) {
                // Si el refresh falla (expiró o es inválido), limpiamos datos y al login
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('user_role'); // Si guardaste el rol
                window.location.href = '/login'; 
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;