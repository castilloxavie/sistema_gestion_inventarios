import api from "../api/axios";

export const getProviders = async (page = 1, limit = 20) => {
    const { data } = await api.get(`/providers?page=${page}&limit=${limit}`);
    return data;
};

export const getProviderById = async (id) => {
    const { data } = await api.get(`/providers/${id}`);
    return data;
};

export const createProvider = async (payload) => {
    const { data } = await api.post("/providers", payload);
    return data;
};

export const updateProvider = async (id, payload) => {
    const { data } = await api.put(`/providers/${id}`, payload);
    return data;
};

export const deleteProvider = async (id) => {
    const { data } = await api.delete(`/providers/${id}`);
    return data;
};
