import ProductServices from "./productServices.js";

class ProductControllers {
    async getAllProduct(req, res) {
        try {
            const product = await ProductServices.getAllProduct()
            console.log("Se obtuvo todos los Productos");
            res.json(product)

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
            const product = await ProductServices.createProducto(req.body)
            console.log("Se creo el Producto correctamente: ", product);
            res.json(product)

        } catch (error) {
            console.log("Error al crear el producto", error.message);
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