import { InventoryMovement } from "../../models/InventoryMovementModels.js"
import { Products } from "../../models/ProductsModels.js"
import { Provider } from "../../models/ProviderModels.js"

class InventoryServices {
    // Crea un movimiento de inventario.
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
