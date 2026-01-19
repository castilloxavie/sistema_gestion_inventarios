import api from "../api/axios";

export const getProviders = async () => {
    const { data } = await api.get("/providers");
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