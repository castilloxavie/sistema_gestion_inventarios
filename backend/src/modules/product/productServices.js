import { Products } from "../../models/ProducsModels.js"

class ProductServices {
    async getAllProduct() {
        return await Products.findAll({
            where: {
                estado: 1
            }
        })
    }

    async getByIdProduct(id) {
        return await Products.findOne({
            where: {
                id: id,
                estado: 1
            }
        })

    }

    async createProducto(data) {

        const {nombre, codigo, categoria, precio, stock} = data

        //validar si el producto ya existe mediante código
        const isExists = await Products.findOne({where: {codigo: codigo}})
        if(isExists) throw new Error("El producto ya existe creado")
        
        const product = await Products.create({
            nombre,
            codigo,
            categoria, 
            precio,
            stock,
            estado: 1
        })
        console.log("Producto creado correctamente:", product);
        return product
    }

    async updateProduct(id, data){
        const product = await Products.findByPk(id)
        if(!product) throw new Error("El producto no existe")
        
        await Products.update(data, {where: {id: id}})
        const updatedProduct = await Products.findByPk(id)
        console.log("Producto actualizado correctamente", updatedProduct);
        return updatedProduct
        

    }

    async deleteProduct(id) {
        const product = await Products.findByPk(id)
        if(!product) throw new Error("El producto no existe")
        
        product.estado = 0
        await product.save()
        console.log("Producto marcado como inactivo (no eliminado) correctamente", product);
        return product
    }


}

export default new ProductServices()
