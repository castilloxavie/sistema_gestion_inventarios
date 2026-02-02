import { Op } from "sequelize";
import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";

import { sequelize } from "../../config/databases.js";
import { Client } from "../../models/ClientModels.js";
import { InventoryMovement } from "../../models/InventoryMovementModels.js";
import  { Products }  from "../../models/ProductsModels.js";
import { Provider } from "../../models/ProviderModels.js";
import { SaleItem } from "../../models/SaleItemModels.js";
import { Sale } from "../../models/SaleModels.js";
import { User } from "../../models/UserModels.js";

class DashBoardServices {

    // Obtiene estadísticas iniciales.
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

    // Obtiene estadísticas del vendedor.
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

    // Obtiene datos de ventas para reportes por período
    async getSalesReportData(period) {
        let startDate, endDate;
        const now = new Date();

        switch (period) {
            case 'weekly-current':
                // Calcular el inicio de la semana actual (lunes a las 00:00:00)
                const dayOfWeek = now.getDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
                const startOfWeek = new Date(now);
                startOfWeek.setDate(now.getDate() - dayOfWeek + 1); // +1 para que lunes sea el inicio
                startOfWeek.setHours(0, 0, 0, 0);
                startDate = startOfWeek;
                endDate = new Date();
                break;
            case 'weekly-all':
                startDate = null; // Todas las semanas
                endDate = new Date();
                break;
            case 'monthly':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                endDate = new Date();
                break;
            case 'yearly':
                startDate = new Date(now.getFullYear(), 0, 1);
                endDate = new Date();
                break;
            default:
                throw new Error('Período no válido. Use: weekly-current, weekly-all, monthly, yearly');
        }

        const whereCondition = startDate
            ? { createdAt: { [Op.between]: [startDate, endDate] } }
            : { createdAt: { [Op.lte]: endDate } };

        const sales = await Sale.findAll({
            where: whereCondition,
            include: [
                { model: User, attributes: ['nombre', 'apellido', 'rol'] },
                { model: Client, attributes: ['nombre', 'apellido', 'documento'] }
            ],
            order: [['createdAt', 'ASC']]
        });

        return sales;
    }

    // Genera reporte PDF
    async generatePDFReport(sales, period) {
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument();
            const buffers = [];

            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                const pdfData = Buffer.concat(buffers);
                resolve(pdfData);
            });
            doc.on('error', reject);

            // Traducir período a español
            const periodTranslations = {
                'weekly-current': 'Semana Actual',
                'weekly-all': 'Todas las Semanas',
                'monthly': 'Mensual',
                'yearly': 'Anual'
            };
            const periodSpanish = periodTranslations[period] || period.charAt(0).toUpperCase() + period.slice(1);

            // Encabezado
            doc.fontSize(20).text(`Reporte de Ventas - ${periodSpanish}`, { align: 'center' });
            doc.moveDown();
            doc.fontSize(12).text(`Generado el: ${new Date().toLocaleDateString('es-ES')}`, { align: 'right' });
            doc.moveDown(2);

            // Tabla
            const tableTop = 150;
            const itemHeight = 20;
            let y = tableTop;

            // Encabezados
            doc.fontSize(10).text('Fecha', 50, y);
            doc.text('Usuario', 150, y);
            doc.text('Cliente', 250, y);
            doc.text('Método Pago', 350, y);
            doc.text('Total', 450, y);
            y += itemHeight;

            doc.moveTo(50, y).lineTo(550, y).stroke();
            y += 5;

            // Datos
            sales.forEach(sale => {
                if (y > 700) { // Nueva página si es necesario
                    doc.addPage();
                    y = 50;
                }

                const userName = sale.User ? `${sale.User.nombre} ${sale.User.apellido}` : 'N/A';
                const clientName = sale.Client ? `${sale.Client.nombre} ${sale.Client.apellido || ''}` : 'Anónimo';
                const date = new Date(sale.createdAt).toLocaleDateString('es-ES');

                doc.fontSize(8).text(date, 50, y);
                doc.text(userName, 150, y);
                doc.text(clientName, 250, y);
                doc.text(sale.metodo_pago, 350, y);
                doc.text(`$${parseFloat(sale.total).toLocaleString()}`, 450, y);
                y += itemHeight;
            });

            // Totales
            const totalAmount = sales.reduce((sum, sale) => sum + parseFloat(sale.total), 0);
            doc.moveDown(2);
            doc.fontSize(12).text(`Total de Ventas: ${sales.length}`, { align: 'left' });
            doc.text(`Monto Total: $${totalAmount.toLocaleString()}`, { align: 'left' });

            doc.end();
        });
    }

    // Genera reporte Excel
    async generateExcelReport(sales, period) {
        // Traducir período a español
        const periodTranslations = {
            'weekly-current': 'Semana Actual',
            'weekly-all': 'Todas las Semanas',
            'monthly': 'Mensual',
            'yearly': 'Anual'
        };
        const periodSpanish = periodTranslations[period] || period.charAt(0).toUpperCase() + period.slice(1);

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(`Reporte de Ventas - ${periodSpanish}`);

        // Encabezados
        worksheet.columns = [
            { header: 'Fecha', key: 'fecha', width: 15 },
            { header: 'Usuario', key: 'usuario', width: 25 },
            { header: 'Rol Usuario', key: 'rol', width: 15 },
            { header: 'Cliente', key: 'cliente', width: 25 },
            { header: 'Documento Cliente', key: 'documento', width: 20 },
            { header: 'Método Pago', key: 'metodo_pago', width: 15 },
            { header: 'Subtotal', key: 'subtotal', width: 15 },
            { header: 'IVA', key: 'iva', width: 10 },
            { header: 'Total', key: 'total', width: 15 }
        ];

        // Datos
        sales.forEach(sale => {
            const userName = sale.User ? `${sale.User.nombre} ${sale.User.apellido}` : 'N/A';
            const userRol = sale.User ? sale.User.rol : 'N/A';
            const clientName = sale.Client ? `${sale.Client.nombre} ${sale.Client.apellido || ''}` : 'Anónimo';
            const clientDoc = sale.Client ? sale.Client.documento : 'N/A';
            const date = new Date(sale.createdAt).toLocaleDateString('es-ES');

            worksheet.addRow({
                fecha: date,
                usuario: userName,
                rol: userRol,
                cliente: clientName,
                documento: clientDoc,
                metodo_pago: sale.metodo_pago,
                subtotal: parseFloat(sale.subtotal),
                iva: parseFloat(sale.iva),
                total: parseFloat(sale.total)
            });
        });

        // Totales al final
        const totalRow = worksheet.addRow({});
        totalRow.getCell(7).value = { formula: `SUM(G2:G${sales.length + 1})` };
        totalRow.getCell(8).value = { formula: `SUM(H2:H${sales.length + 1})` };
        totalRow.getCell(9).value = { formula: `SUM(I2:I${sales.length + 1})` };

        worksheet.getCell(`F${sales.length + 2}`).value = 'Totales';

        return await workbook.xlsx.writeBuffer();
    }
}

export default new DashBoardServices()
