import { Client } from "../../models/ClientModels.js";

class ClientServices {
    // Crea un nuevo cliente.
    async createClient(data) {
        const { nombre, apellido, documento, email, telefono, direccion } = data;
        
        // Validar si ya existe
        if (documento) {
            const existingClient = await Client.findOne({ where: { documento } });
            if (existingClient) {
                throw new Error(`El cliente con documento ${documento} ya existe`);
            }
        }

        const client = await Client.create({
            nombre,
            apellido,
            documento,
            email,
            telefono,
            direccion
        });

        return client;
    }

    // Obtiene todos los clientes.
    async getAllClients() {
        return await Client.findAll();
    }

    // Obtiene cliente por documento.
    async getClientByDocument(documento) {
        return await Client.findOne({ where: { documento } });
    }
    
    // Obtiene cliente por ID.
    async getClientById(id) {
        return await Client.findByPk(id);
    }
}

export default new ClientServices();
