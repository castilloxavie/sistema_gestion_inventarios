import ProviderServices from "./providersServices.js";

class ProviderController {

    // Obtiene todos los proveedores paginados.
    async getAllProvider(req, res){
        try {
            const { page = 1, limit = 20 } = req.query;
            const result = await ProviderServices.getAllProviders(parseInt(page), parseInt(limit))
            console.log("Se obtuvo todos los Provedores");
            res.json(result)

        } catch (error) {
            console.log("Error al mostrar todos los Provedores", error.message);
            res.status(500).json({error: error.message})
        }
    }

    // Obtiene proveedor por ID.
    async getByProvider(req, res){
        try {
            const providers = await ProviderServices.getIdProviders(req.params.id)
            console.log("Se obtuvo el Provedor solicitado por el ID: ", providers);
            res.json(providers)
        } catch (error) {
            console.log("Error al mostrar el Provedor por ID", error.message);
            res.status(500).json({error: error.message})
        }
    }

    // Crea un nuevo proveedor.
    async createProvider(req, res){
        try {
            const providers = await ProviderServices.createProviders(req.body)
            console.log("Se creo el Provedor correctamente: ", providers);
            res.json(providers)

        } catch (error) {
            console.log("Error al crear el Provedor", error.message);
            res.status(500).json({error: error.message})
        }
    }

    // Actualiza un proveedor.
    async updateProvider(req, res){
        try {
            const providers = await ProviderServices.updateProviders(req.params.id, req.body)
            console.log("Se actualizo el Provedor correctamente: ", providers);
            res.json(providers)

        } catch (error) {
            console.log("Error al actualizar el Provedor", error.message);
            res.status(500).json({error: error.message})
        }
        
    }

    // Elimina un proveedor.
    async deleteProvider(req, res) {
        try {
            const providers = await ProviderServices.deleteProviders(req.params.id)
            console.log("Se elimino el Provedor correctamente: ", providers);
            res.json(providers)
            
        } catch (error) {
            console.log("Error al eliminar el Provedor", error.message);
            res.status(500).json({error: error.message})
        }
    }

}

export default new ProviderController