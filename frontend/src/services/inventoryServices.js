import api from "../api/axios";

export const getInventoryMovements = async () => {
    const { data } = await api.get("/inventory");
    return data;
};

export const createInventoryMovement = async (payload) => {
    const { data } = await api.post("/inventory", payload);
    return data;
};