import { Op } from "sequelize";

import { sequelize } from "../../config/databases.js";
import { Client } from "../../models/ClientModels.js";
import { InventoryMovement } from "../../models/InventoryMovementModels.js";
import  { Products }  from "../../models/ProducsModels.js";
import { Provider } from "../../models/ProviderModels.js";
import { SaleItem } from "../../models/SaleItemModels.js";
import { Sale } from "../../models/SaleModels.js";
import { User } from "../../models/UserModels.js";

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

        // Productos con stock bajo (crítico < 10)
        const lowStockProducts = await Products.findAll({
            where: {
                stock: { [Op.lt]: 10 },
                estado: 1
            },
            attributes: ['id', 'nombre', 'codigo', 'stock']
        });

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
            },
            lowStockProducts
        }
    }

    async getSellerStats(userId) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
    
        const totalSalesToday = await Sale.count({
            where: {
                usuario_id: userId,
                createdAt: { [Op.gte]: today }
            }
        });
    
        const totalAmountToday = await Sale.sum('total', {
            where: {
                usuario_id: userId,
                createdAt: { [Op.gte]: today }
            }
        }) || 0;
    
        // Últimas 5 ventas del usuario
        const recentSales = await Sale.findAll({
            where: { usuario_id: userId },
            limit: 5,
            order: [['createdAt', 'DESC']],
            include: [{ model: Client, attributes: ['nombre', 'apellido'] }]
        });
    
        // Productos con stock bajo (crítico < 10)
        const lowStockProducts = await Products.findAll({
            where: {
                stock: { [Op.lt]: 10 },
                estado: 1
            },
            limit: 5
        });
    
        return {
            today: {
                count: totalSalesToday,
                amount: totalAmountToday
            },
            recentSales,
            lowStockProducts
        };
    }
}

export default new DashBoardServices()