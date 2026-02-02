import DashBoardServices from "./dashboardServices.js"

class DashboardController {

    // Obtiene estadísticas iniciales del dashboard.
    async getStart(req, res) {
        try {
            const data = await DashBoardServices.getStarts()
            console.log("data: ", data);
            return res.json(data)

        } catch (error) {
            console.log("error: ", error);
            return res.status(500).json({
                error: "error al obtener la estadistica",
                detalle: error.message
            })
        }
    }

    async getSellerDashboard(req, res) {
        try {
            const userId = req.user.id;
            const data = await DashBoardServices.getSellerStats(userId);
            return res.json(data);
        } catch (error) {
            console.log("error: ", error);
            return res.status(500).json({
                error: "Error al obtener estadísticas de vendedor",
                detalle: error.message
            });
        }
    }

    async exportSalesReport(req, res) {
        try {
            const { period, format } = req.params;

            // Validar parámetros
            const validPeriods = ['weekly-current', 'weekly-all', 'monthly', 'yearly'];
            const validFormats = ['pdf', 'excel'];

            if (!validPeriods.includes(period)) {
                return res.status(400).json({ error: 'Período no válido. Use: weekly-current, weekly-all, monthly, yearly' });
            }

            if (!validFormats.includes(format)) {
                return res.status(400).json({ error: 'Formato no válido. Use: pdf, excel' });
            }

            // Obtener datos de ventas
            const sales = await DashBoardServices.getSalesReportData(period);

            if (sales.length === 0) {
                return res.status(404).json({ error: 'No hay ventas en el período seleccionado' });
            }

            let fileBuffer;
            let fileName;
            let mimeType;

            if (format === 'pdf') {
                fileBuffer = await DashBoardServices.generatePDFReport(sales, period);
                fileName = `reporte-ventas-${period}-${new Date().toISOString().split('T')[0]}.pdf`;
                mimeType = 'application/pdf';
            } else if (format === 'excel') {
                fileBuffer = await DashBoardServices.generateExcelReport(sales, period);
                fileName = `reporte-ventas-${period}-${new Date().toISOString().split('T')[0]}.xlsx`;
                mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            }

            // Enviar archivo
            res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
            res.setHeader('Content-Type', mimeType);
            res.send(fileBuffer);

        } catch (error) {
            console.log("error: ", error);
            return res.status(500).json({
                error: "Error al generar el reporte de ventas",
                detalle: error.message
            });
        }
    }
}

export default new DashboardController()
