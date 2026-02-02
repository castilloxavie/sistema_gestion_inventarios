import { where } from "sequelize";

import { Provider } from "../../models/ProviderModels.js";

class ProviderServices {
    async getAllProviders(page = 1, limit = 20) {
        const parsedPage = parseInt(page);
        const parsedLimit = parseInt(limit);
        const offset = (parsedPage - 1) * parsedLimit;

        const { count, rows } = await Provider.findAndCountAll({
            where: {
                estado: 1
            },
            limit: parsedLimit,
            offset
        });

        const totalPages = Math.ceil(count / parsedLimit);

        return {
            data: rows,
            pagination: {
                total: count,
                page: parsedPage,
                limit: parsedLimit,
                totalPages
            }
        };
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

        const trimmedEmail = email.trim()

        const isExists = await Provider.findOne({where: {email: trimmedEmail}})
        if(isExists) throw new Error("Provedor ya existe")

        const providers = await Provider.create({
            nombre,
            telefono,
            email: trimmedEmail,
            direccion,
            estado: 1
        })
        console.log("Se creo el Provedor correctamente: ", providers);
        return providers
    }

    async updateProviders(id, data) {
        const providers = await Provider.findOne({ where: { id: id, estado: 1 } })
        if(!providers) throw new Error("El proveedor no existe o está inactivo")

        // Filtrar solo campos permitidos para actualización parcial
        const allowedFields = ['nombre', 'telefono', 'email', 'direccion']
        const updateData = {}
        for (const field of allowedFields) {
            if (data[field] !== undefined) {
                updateData[field] = data[field]
            }
        }

        // Verificar que al menos un campo se va a actualizar
        if (Object.keys(updateData).length === 0) {
            throw new Error("No se proporcionaron campos válidos para actualizar")
        }

        await Provider.update(updateData, { where: { id: id } })
        const providerUpdate = await Provider.findByPk(id)
        console.log(`Proveedor actualizado correctamente: ${providerUpdate}`);
        return providerUpdate
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