import api from './axiosConfig';

export const getUsers = () => 
    api.get('/manage/');

export const createUser = (userData) => 
    api.post('/manage/', userData);

export const getUserById = (id) => 
    api.get(`/manage/${id}/`);

// PUT requiere todos los campos, PATCH permite actualizaciones parciales
export const updateUser = (id, userData) => 
    api.put(`/manage/${id}/`, userData);

export const patchUser = (id, userData) => 
    api.patch(`/manage/${id}/`, userData);

export const deleteUser = (id) => 
    api.delete(`/manage/${id}/`);