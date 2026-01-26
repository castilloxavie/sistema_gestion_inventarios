import api from "../api/axios";

export const getClients = async () => {
    const { data } = await api.get("/clients");
    return data;
};

export const getClientByDocument = async (documento) => {
    const { data } = await api.get(`/clients/documento/${documento}`);
    return data;
};

export const createClient = async (clientData) => {
    const { data } = await api.post("/clients", clientData);
    return data;
};
