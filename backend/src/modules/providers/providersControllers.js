import ProviderServices from "./providersServices.js";

class ProviderController {
    async getAllProvider(req, res){
        try {
            const providers = await ProviderServices.getAllProviders()
            console.log("Se obtuvo todos los Provedores");
            res.json(providers)

        } catch (error) {
            console.log("Error al mostrar todos los Provedores", error.message);
            res.status(500).json({error: error.message})
        }
    }

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