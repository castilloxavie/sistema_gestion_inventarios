import clientsServices from "./clientsServices.js";

class ClientController {

    // Crea un nuevo cliente.
    async create(req, res) {
        try {
            const client = await clientsServices.createClient(req.body);
            res.status(201).json(client);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    // Obtiene todos los clientes.
    async getAll(req, res) {
        try {
            const clients = await clientsServices.getAllClients();
            res.json(clients);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getByDocument(req, res) {
        try {
            const { documento } = req.params;
            const client = await clientsServices.getClientByDocument(documento);
            if (!client) return res.status(404).json({ message: "Cliente no encontrado" });
            res.json(client);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default new ClientController();
