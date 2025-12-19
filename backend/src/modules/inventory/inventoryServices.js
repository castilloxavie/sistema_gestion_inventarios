import {InventoryMovement} from "../../models/InventoryMovementModels.js"
import {Products} from "../../models/ProducsModels.js"
import {Op} from "sequelize"

class InventoryServices {
    async createInventory(data){
        const {producto_id, tipo, cantidad } = data

        const product = await Products.findByPk(producto_id)
        if(!product) throw new Error("El producto no existe")
        if(cantidad <= 0) throw new Error("La cantidad debe ser mayor a cero")
        
        if(tipo === "entrada") {
            product.stock += cantidad
        }
        else if (tipo === "salida") {
            if(product.stock < cantidad){
                throw new Error("Stock insuficiente para realizar la salida")
            }

            product.stock -= cantidad
        }
        else {
            throw new Error("El movimiento solicitado no es valido:(entrada o salida)")
        }

        await product.save()

        return await InventoryMovement.create({
            producto_id,
            tipo,
            cantidad
        })
    }

    async getMovement(){
        return await InventoryMovement.findAll({
            include: [
                {model: Products, attributes: ["nombre", "precio", "stock"]}
            ]
        })
    }

    async getMovementById(id){
        return await InventoryMovement.findByPk(id, {
            include: [
                {model: Products, attributes: ["nombre", "precio", "stock"]}
            ]
        })
    }
}

export default new InventoryServices()
