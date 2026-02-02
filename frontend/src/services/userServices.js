import api from "../api/axios"

export const getUsers = () => {
    return api.get('/users');
};

export const getUserById = (id) => {
    return api.get(`/users/${id}`);
};

export const createUser = (userData) => {
    return api.post('/users', userData);
};

export const updateUser = (id, userData) => {
    return api.put(`/users/${id}`, userData);
};

export const deleteUser = (id) => {
    return api.delete(`/users/${id}`);
};
