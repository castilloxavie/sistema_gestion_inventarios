import { sequelize } from "../../config/databases.js"
import { InventoryMovement } from "../../models/InventoryMovementModels.js"
import { Products } from "../../models/ProductsModels.js"
import { Provider } from "../../models/ProviderModels.js"

class InventoryServices {
    // Crea un movimiento de inventario.
    async createInventory(data){
        const {product_id, provider_id, type, quantity } = data

        const secureTransaction = await sequelize.transaction()

        try {
            const product = await Products.findByPk(product_id, { transaction: secureTransaction })
            if(!product) throw new Error("El producto no existe")

            const numericQuantity = parseInt(quantity, 10);
            if (isNaN(numericQuantity) || numericQuantity <= 0) {
                throw new Error("La cantidad debe ser un número válido mayor a cero");
            }

            if(type === "IN") {
                await Products.increment('stock', { by: numericQuantity, where: { id: product_id }, transaction: secureTransaction })
            }
            else if (type === "OUT") {
                const currentStock = product.stock
                if(currentStock < numericQuantity){
                    throw new Error("Stock insuficiente para realizar la salida")
                }
                await Products.decrement('stock', { by: numericQuantity, where: { id: product_id }, transaction: secureTransaction })
            }
            else {
                throw new Error("El movimiento solicitado no es valido:(IN o OUT)")
            }

            const movement = await InventoryMovement.create({
                producto_id: product_id,
                provider_id: provider_id || null,
                tipo: type === "IN" ? "entrada" : "salida",
                cantidad: numericQuantity
            }, { transaction: secureTransaction })

            await secureTransaction.commit()
            return movement

        } catch (error) {
            await secureTransaction.rollback()
            throw error
        }
    }

    // Obtiene movimientos de inventario paginados.
    async getMovement(page = 1, limit = 20) {
        const parsedPage = parseInt(page, 10) || 1;
        const parsedLimit = parseInt(limit, 10) || 20;
        const offset = (parsedPage - 1) * parsedLimit;

        const { count, rows } = await InventoryMovement.findAndCountAll({
            include: [
                {model: Products, attributes: ["nombre", "precio", "stock"], include: [{model: Provider, attributes: ["nombre"]}]},
                {model: Provider, attributes: ["nombre"]}
            ],
            limit: parsedLimit,
            offset,
            order: [['createdAt', 'DESC']]
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

    // Obtiene movimiento de inventario por ID.
    async getMovementById(id){
        return await InventoryMovement.findByPk(id, {
            include: [
                {model: Products, attributes: ["nombre", "precio", "stock"], include: [{model: Provider, attributes: ["nombre"]}]},
                {model: Provider, attributes: ["nombre"]}
            ]
        })
    }
}

export default new InventoryServices()
