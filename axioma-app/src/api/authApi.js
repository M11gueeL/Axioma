import api from './axiosConfig';

export const registerUser = (userData) => 
    api.post('/register/', userData);

export const loginUser = (credentials) => 
    api.post('/login/', credentials);

export const logoutUser = () => 
    api.post('/logout/', {});

export const getProfile = () => 
    api.get('/profile/');