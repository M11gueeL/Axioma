import api from './axiosConfig';

export const registerUser = (userData) => 
    api.post('/register/', userData);

export const loginUser = (credentials) => 
    api.post('/login/', credentials);

export const logoutUser = (refreshToken) => 
    api.post('/logout/', { refresh: refreshToken });

export const getProfile = () => 
    api.get('/profile/');

export const verifyEmail = (uid, token) =>
    api.post('/verify-email/', { uid, token });

export const requestPasswordReset = (email) =>
    api.post('/password-reset/', { email });

export const confirmPasswordReset = (uid, token, new_password) =>
    api.post('/password-reset/confirm/', { uid, token, new_password });

export const changePassword = (old_password, new_password) =>
    api.put('/change-password/', { old_password, new_password });