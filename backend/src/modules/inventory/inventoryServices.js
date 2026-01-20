import { InventoryMovement } from "../../models/InventoryMovementModels.js"
import { Products } from "../../models/ProducsModels.js"
import { Provider } from "../../models/ProviderModels.js"

class InventoryServices {
    async createInventory(data){
        const {product_id, provider_id, type, quantity } = data

        const product = await Products.findByPk(product_id)
        if(!product) throw new Error("El producto no existe")
        
        const numericQuantity = parseInt(quantity, 10);
        if (isNaN(numericQuantity) || numericQuantity <= 0) {
            throw new Error("La cantidad debe ser un número válido mayor a cero");
        }

        if(type === "IN") {
            product.stock += numericQuantity
        }
        else if (type === "OUT") {
            if(product.stock < numericQuantity){
                throw new Error("Stock insuficiente para realizar la salida")
            }

            product.stock -= numericQuantity
        }
        else {
            throw new Error("El movimiento solicitado no es valido:(IN o OUT)")
        }

        await product.save()

        return await InventoryMovement.create({
            producto_id: product_id,
            provider_id: provider_id || null,
            tipo: type === "IN" ? "entrada" : "salida",
            cantidad: numericQuantity
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
