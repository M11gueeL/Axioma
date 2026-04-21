import api from './axiosConfig';

export const getSessions = () => 
    api.get('/sessions/');