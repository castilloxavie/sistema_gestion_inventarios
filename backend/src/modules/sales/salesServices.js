import { sequelize } from "../../config/databases.js";
import { Client } from "../../models/ClientModels.js";
import { InventoryMovement } from "../../models/InventoryMovementModels.js";
import { Products } from "../../models/ProducsModels.js";
import { SaleItem } from "../../models/SaleItemModels.js";
import { Sale } from "../../models/SaleModels.js";
import { User } from "../../models/UserModels.js";

class SaleServices{
    async createSale(data) {
        const {usuario_id, items, metodo_pago, cliente_id} = data

        if(!items || items.length === 0) throw new Error("La venta debe tener al menos un item (producto)")
        
        const secureTransaction = await sequelize.transaction()

        try {
            let total = 0

            // Validar stock y calcular total
            for(const item of items){
                const product = await Products.findByPk(item.producto_id)

                if(!product) throw new Error(`El producto con ID ${item.producto_id} no existe`)
                if(product.stock < item.cantidad) throw new Error(`Stock insuficiente para el producto ${product.nombre}`)
                
                total += parseFloat(product.precio) * parseInt(item.cantidad)
            }

            // Calcular subtotal e iva (Asumiendo IVA 19% incluido en el precio)
            const subtotal = total / 1.19;
            const iva = total - subtotal;

            // Crear la venta
            const sale = await Sale.create({
                usuario_id,
                cliente_id: cliente_id || null,
                metodo_pago: metodo_pago || "efectivo",
                subtotal: subtotal.toFixed(2),
                iva: iva.toFixed(2),
                total: total.toFixed(2)
            },
            {
                transaction: secureTransaction
            })

            // Crear items de venta y actualizar inventario
            for(const item of items){
                const product = await Products.findByPk(item.producto_id)

                await SaleItem.create({
                    venta_id: sale.id,
                    producto_id: item.producto_id,
                    cantidad: item.cantidad,
                    precio_unitario: product.precio
                },
                {
                    transaction: secureTransaction
                })

                // Actualizar stock del producto
                product.stock -= item.cantidad
                await product.save({transaction: secureTransaction})

                // Registrar movimiento de inventario
                await InventoryMovement.create({
                    producto_id: item.producto_id,
                    tipo: "salida",
                    cantidad: item.cantidad,
                    descripcion: `Venta #${sale.id}`
                },
                {
                    transaction: secureTransaction
                })
            
            }

            await secureTransaction.commit()
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
                },
                {
                    model: User,
                    attributes: ["nombre", "apellido", "email"]
                },
                {
                    model: Client,
                    attributes: ["nombre", "apellido", "documento"]
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
                },
                {
                    model: User,
                    attributes: ["nombre", "apellido", "email"]
                },
                {
                    model: Client,
                    attributes: ["nombre", "apellido", "documento"]
                }
            ]
        })
        
        return sale
    }
}

export default new SaleServices()