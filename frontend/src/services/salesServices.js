import api from "../api/axios"

export const getSale = async (page = 1, limit = 20) => {
    const { data } = await api.get(`/sales?page=${page}&limit=${limit}`)
    return data
}

export const createSales = async (payload) => {
    const { data } = await api.post("/sales", payload)
    return data
}

export const getSaleById = async (id) => {
    const { data } = await api.get(`/sales/${id}`)
    return data
}
