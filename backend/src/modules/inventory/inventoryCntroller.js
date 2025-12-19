import InventoryServices from "./inventoryServices.js"

class InventoryController {

    async creta(req, res) {
        try {
            const inventry = await InventoryServices.createInventory(req.body)
            console.log("SE creo correctamente el inventario");
            return res.json(inventry)
            
        } catch (error) {
            console.log("Error: no se puedo crear el inventario", error.message);
            res.status(500).json({error: error.message})
            
        }
    }

    async getAll(req, res) {
        try {
            const inventory = await InventoryServices.getMovement()
            console.log("SE obtuvieron correctamente los movimientos de inventario");
            return res.json(inventory)

        } catch (error) {
            console.log("Error: no se puedo obtener los movimientos de inventario", error.message);
            res.status(500).json({error: error.message})
            
        }
    }
    async getBiId(req, res) {
        try {
            const inventry = await InventoryServices.getMovement(req.params.id)
            if(!inventry) return res.status(404).json( {error: "Movimiento no encontrado"})
                console.log("SE encontro el movimiento de inventario");
            return res.json(inventry)

        } catch (error) {
            console.log("Error: no se puedo obtener el movimiento de inventario", error.message);
            res.status(500).json({error: error.message})
            
        }
    }
}
