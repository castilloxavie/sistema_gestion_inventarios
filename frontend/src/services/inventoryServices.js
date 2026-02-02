import api from "../api/axios";

export const getInventoryMovements = async (page = 1, limit = 20) => {
    const { data } = await api.get(`/inventory?page=${page}&limit=${limit}`);
    return data;
};

export const createInventoryMovement = async (payload) => {
    const { data } = await api.post("/inventory", payload);
    return data;
};