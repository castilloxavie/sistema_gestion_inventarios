import  api from "../api/axios.js"

export const getProducts = async (params = {}) => {
    const { data } = await api.get("/products", { params })
    return data
};

export const getProductById = async (id) => {
    const { data } = await api.get(`/products/${id}`);
    return data;
};

export const createProduct = async (payload) => {
    const { data } = await api.post("/products", payload);
    return data;
};

export const updateProduct = async (id, payload) => {
    const { data } = await api.put(`/products/${id}`, payload);
    return data;
};

export const deleteProduct = async (id) => {
    const { data } = await api.delete(`/products/${id}`);
    return data;
};