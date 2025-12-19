import SalesServices from "./salesServices.js";

class SaleController {

    async create(req, res){
        try {
             const sale = await SalesServices.createSale(req.body)
             console.log("Venta creada: ", sale);
             return res.json(sale)

        } catch (error) {
            console.log("Error al crear la Venta", error.message);
            res.status(500).json({error: error.message})
        }
       
    }

    async getSale(req, res) {
        try {
            const sale = await SalesServices.getAllSales()
            console.log("Se obtuvieron todas las Ventas");
            res.json(sale)

        } catch (error) {
            console.log("Error no se pudieron obtener las ventas", error.message);
            res.status(500).json({error: error.message})
        }
    }

    async getSaleById (req, res) {
        try {
            const sale = await SalesServices.getSaleById(req.params.id)
            console.log("Venta encontrada: ", sale);
            res.json(sale)

        } catch (error) {
            console.log("Error no se pudo obtener la venta", error.message);
            res.status(500).json({error: error.message})
        }
    }
}

export default new SaleController()