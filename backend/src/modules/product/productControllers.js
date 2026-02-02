import ProductServices from "./productServices.js";

class ProductControllers {
    async getAllProduct(req, res) {
        try {
            const { search, page = 1, limit = 20 } = req.query;
            const result = await ProductServices.getAllProduct(search, parseInt(page), parseInt(limit))
            console.log("Se obtuvo todos los Productos");
            res.json(result)

        } catch (error) {
            console.log("Error al mostrar todos los producto", error.message);
            res.status(500).json({error: error.message})
        }
    }

    async getByIdProduct(req, res) {
        try {
            const product = await ProductServices.getByIdProduct(req.params.id)
            console.log("Se obtuvo el Producto solicitado por el ID: ", product);
            res.json(product)

        } catch (error) {
            console.log("Error al mostrar el producto por ID", error.message);
            res.status(500).json({error: error.message})
        }
    }

    async createProduct(req, res){
        try {
            console.log("Request body:", req.body);
            const product = await ProductServices.createProducto(req.body)
            console.log("Se creo el Producto correctamente: ", product);
            res.status(201).json(product)

        } catch (error) {
            console.log("Error al crear el producto", error.message);
            if (error.message.includes("ya existe")) {
                return res.status(409).json({error: error.message});
            }
            res.status(500).json({error: error.message})
        }
    }

    async updateProduct(req, res) {
        try {
            const product = await ProductServices.updateProduct(req.params.id, req.body)
            console.log("Se actualizo el Producto correctamente: ", product);
            res.json(product)

        } catch (error) {
            console.log("Error al actualizar el producto", error.message);
            res.status(500).json({error: error.message})
        }
    }

    async deleteProduct(req, res) {
        try {
            const product = await ProductServices.deleteProduct(req.params.id)
            console.log("Se elimino el Producto correctamente: ", product);
            res.json(product)

        } catch (error) {
            console.log("Error al eliminar el producto", error.message);
            res.status(500).json({error: error.message})
        }
    }
}
export default new ProductControllers