import SalesServices from "./salesServices.js";

class SaleController {

    // Crea una nueva venta.
    async create(req, res){
        try {
             const sale = await SalesServices.createSale(req.body)
             console.log("Venta creada: ", sale);
             return res.status(201).json(sale)

        } catch (error) {
            console.log("Error al crear la Venta", error.message);
            res.status(500).json({error: error.message})
        }

    }

    // Obtiene ventas paginadas.
    async getSale(req, res) {
        try {
            const userId = req.user?.id;
            const userRole = req.user?.rol;
            const { page = 1, limit = 20 } = req.query;
            const result = await SalesServices.getAllSales(page, limit, userId, userRole)
            console.log("Se obtuvieron las Ventas");
            res.json(result)

        } catch (error) {
            console.log("Error no se pudieron obtener las ventas", error.message);
            res.status(500).json({error: error.message})
        }
    }

    // Obtiene venta por ID.
    async getSaleById (req, res) {
        try {
            const userId = req.user?.id;
            const userRole = req.user?.rol;
            const sale = await SalesServices.getSaleById(req.params.id, userId, userRole)
            console.log("Venta encontrada: ", sale);
            res.json(sale)

        } catch (error) {
            console.log("Error no se pudo obtener la venta", error.message);
            res.status(500).json({error: error.message})
        }
    }

    // Genera PDF de venta.
    async generatePDF(req, res) {
        try {
            const userId = req.user?.id;
            const userRole = req.user?.rol;
            const pdfBuffer = await SalesServices.generateSalePDF(req.params.id, userId, userRole);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=factura-${req.params.id}.pdf`);
            res.send(pdfBuffer);
        } catch (error) {
            console.log("Error al generar PDF", error.message);
            res.status(500).json({error: error.message});
        }
    }
}

export default new SaleController()
