import InventoryServices from "./inventoryServices.js"

class InventoryController {

    async create(req, res) {
        try {
            const inventory = await InventoryServices.createInventory(req.body)
            console.log("Se creó correctamente el inventario");
            return res.json(inventory)

        } catch (error) {
            console.log("Error: no se pudo crear el inventario", error.message);
            res.status(500).json({error: error.message})

        }
    }

    async getAll(req, res) {
        try {
            const { page = 1, limit = 20 } = req.query;
            const result = await InventoryServices.getMovement(page, limit)
            console.log("Se obtuvieron correctamente los movimientos de inventario");
            return res.json(result)

        } catch (error) {
            console.log("Error: no se pudieron obtener los movimientos de inventario", error.message);
            res.status(500).json({error: error.message})

        }
    }

    async getById(req, res) {
        try {
            const inventory = await InventoryServices.getMovementById(req.params.id)
            if(!inventory) return res.status(404).json( {error: "Movimiento no encontrado"})
                console.log("Se encontró el movimiento de inventario");
            return res.json(inventory)

        } catch (error) {
            console.log("Error: no se pudo obtener el movimiento de inventario", error.message);
            res.status(500).json({error: error.message})

        }
    }
}

export { InventoryController }
