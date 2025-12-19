import {Sale} from "../../models/SaleModels.js"
import {SaleItem} from "../../models/SaleItemModels.js"
import { Products } from "../../models/ProducsModels.js"
import {InventoryMovement} from "../../models/InventoryMovementModels.js"
import { sequelize } from "../../config/databases.js"


class SaleServices{
    async createSale(data) {
        const {userId, items} = data

        if(!items || items.lenght === 0) throw new Error("La venta debe tener al menos un item (producto)")
        
        const secureTransaction = await sequelize.transaction()

        try {
            let total = 0

            for(const item in items){
                const product = await Products.findByPk(item.productId)

                if(!product) throw new Error(`El producto con ID ${item.productId} no existe`)
                if(product.stock < item.cantidad) throw new Error(`Stock insuficiente para el producto ${product.nombre}`)
                
                total += product.precio * item.cantidad
            }

            const sale = await Sale.create({
                userId,
                total
            },
            {
                transaction: secureTransaction
            })

            for(const item in items){
                const product = await Products.findByPk(item.productId)

                await SaleItem.create({
                    saleId: sale.saleId,
                    produtId: item.productId,
                    quantity: item.cantidad,
                    uniPrice: product.precio
                },
                {
                    transaction: secureTransaction
                })

                product.stock -= item.cantidad
                await product.save(secureTransaction)

                await InventoryMovement.create({
                    productId: item.productId,
                    type: "salida",
                    quantity: item.cantidad
                    
                },
                {
                    transaction: secureTransaction
                })
            
            }

            await  secureTransaction.commit()
            console.log("Se creo la venta correctamente: ", sale);
            return sale

        } catch (error) {
            await secureTransaction.rollback()
            throw error
        }
    }

    async getAllSales () {
        return await Sale.findAll({
            include: [
                {
                    model: SaleItem,
                    include: [{model: Products}]
                }
                
            ]
        })
    }

    async getSaleById (id) {
        const sale = await Sale.findByPk(id, {
            include: [
                {
                    model: SaleItem,
                    include: [{model: Products}]
                }
            ]
        })

        if(!sale) throw new Error(`La venta con ID ${id} no existe`)
        console.log("Venta encontrada: ", sale);
        return sale
    }

}

export default new SaleServices()