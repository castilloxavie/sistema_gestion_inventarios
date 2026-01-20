import { InventoryMovement } from "../../models/InventoryMovementModels.js"
import { Products } from "../../models/ProducsModels.js"
import { Provider } from "../../models/ProviderModels.js"

class InventoryServices {
    async createInventory(data){
        const {product_id, provider_id, type, quantity } = data

        const product = await Products.findByPk(product_id)
        if(!product) throw new Error("El producto no existe")
        if(quantity <= 0) throw new Error("La cantidad debe ser mayor a cero")

        if(type === "IN") {
            product.stock += quantity
        }
        else if (type === "OUT") {
            if(product.stock < quantity){
                throw new Error("Stock insuficiente para realizar la salida")
            }

            product.stock -= quantity
        }
        else {
            throw new Error("El movimiento solicitado no es valido:(IN o OUT)")
        }

        await product.save()

        return await InventoryMovement.create({
            producto_id: product_id,
            provider_id: provider_id || null,
            tipo: type === "IN" ? "entrada" : "salida",
            cantidad: quantity
        })
    }

    async getMovement(){
        return await InventoryMovement.findAll({
            include: [
                {model: Products, attributes: ["nombre", "precio", "stock"]},
                {model: Provider, attributes: ["nombre"]}
            ]
        })
    }

    async getMovementById(id){
        return await InventoryMovement.findByPk(id, {
            include: [
                {model: Products, attributes: ["nombre", "precio", "stock"]},
                {model: Provider, attributes: ["nombre"]}
            ]
        })
    }
}

export default new InventoryServices()
