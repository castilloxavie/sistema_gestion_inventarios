import { Provider } from "../../models/ProviderModels.js";


class ProviderServices {
    async getAllProviders() {
        return await Provider.findAll({
            where: {
                estado: 1
            }
        })
    }

    async getIdProviders(id) {
        return await Provider.findOne({
            where: {
                id: id,
                estado: 1
            }
        })
    }

    async createProviders(data) {
        const{nombre, telefono, email, direccion} = data

        const isExists = await Provider.findOne({where: {email}})
        if(isExists) throw new Error("Provedor ya existe")
        
        const providers = await Provider.create({
            nombre,
            telefono, 
            email, 
            direccion,
            estado: 1
        })
        console.log("Se creo el Provedor correctamente: ", providers);
        return providers
    }

    async updateProviders(id, data) {
        const providers = await Provider.findOne(id)
        if(!providers) throw new Error("El proveedor no existe")
        
        await Provider.update(data, {where: {id:id}})
        const updateProviders = await Provider.findByPk(id)
        console.log("Se actualizo el Provedor correctamente: ", updateProviders);
        return updateProviders
    }

    async deleteProviders(id) {
        const providers = await Provider.findByPk(id)
        if(!providers) throw new Error("El proveedor no existe")

        providers.estado = 0
        await providers.save()
        console.log("Se elimino el Provedor correctamente: ", providers);
        return providers
    }
}

export default new ProviderServices()