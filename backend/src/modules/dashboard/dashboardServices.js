import  { Products }  from "../../models/ProducsModels.js";
import { Provider } from "../../models/ProviderModels.js";
import { User } from "../../models/UserModels.js";
import { Sale } from "../../models/SaleModels.js";
import { SaleItem } from "../../models/SaleItemModels.js";
import { InventoryMovement } from "../../models/InventoryMovementModels.js";
import { sequelize } from "../../config/databases.js";
import { Op } from "sequelize";

class DashBoardServices {
    async getStarts () {
        const totalProducts = await Products.count()
        const totalProviders = await Provider.count()
        const totalUsers = await User.count()

        // Calcular valor del inventario (precio * stock)
        // Usamos una query raw simple para asegurar compatibilidad
        const [result] = await sequelize.query(
            'SELECT SUM(precio * stock) as total FROM Products'
        );
        const inventoryValue = result[0].total || 0;

        const totalSaleAmount = await Sale.sum("total")
        const totalSaleCount = await Sale.count()

        const topProducts = await SaleItem.findAll({
            attributes: [
                "producto_id",
                [sequelize.fn("SUM", sequelize.col("cantidad")), "total_vendido"]
            ],
            include:[{model: Products, attributes: ["nombre", "precio"]}],
            group: ["producto_id"],
            order: [[sequelize.literal("total_vendido"), "DESC"]],
            limit: 5
        })

        const lastMovements = await InventoryMovement.findAll({
            limit: 10,
            order: [["createdAt", "DESC"]],
            include: [{model: Products, attributes: ["nombre"]}]
        })

        const last7Days = await Sale.findAll({
            attributes: ["id", "createdAt", "total"],
            where: {
                createdAt: {
                    [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                }
            },
            order: [["createdAt", "ASC"]]
        })

        return {
            totals: {
                totalProducts,
                totalProviders,
                totalUsers,
                inventoryValue,
                totalSaleAmount,
                totalSaleCount
            },
            charts: {
                topProducts,
                lastMovements,
                last7Days
            }
        }
    }
}

export default new DashBoardServices()