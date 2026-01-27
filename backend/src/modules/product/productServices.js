import { Op } from "sequelize";

import { InventoryMovement } from "../../models/InventoryMovementModels.js"
import { Products } from "../../models/ProducsModels.js"

class ProductServices {
    async getAllProduct(search = null) {
        let whereCondition = { estado: 1 };

        if (search) {
            whereCondition = {
                ...whereCondition,
                [Op.or]: [
                    { nombre: { [Op.like]: `%${search}%` } },
                    { codigo: { [Op.like]: `%${search}%` } }
                ]
            };
        }

        return await Products.findAll({
            where: whereCondition
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

        const {nombre, codigo, categoria, precio, stock, proveedor_id} = data

        //validar si el producto ya existe mediante código
        const isExists = await Products.findOne({where: {codigo: codigo}})
        if(isExists) throw new Error("El producto ya existe creado")
        
        const product = await Products.create({
            nombre,
            codigo,
            categoria,
            precio,
            stock,
            proveedor_id,
            estado: 1
        })

        // Crear movimiento de inventario si hay stock inicial
        if (stock > 0) {
            await InventoryMovement.create({
                producto_id: product.id,
                provider_id: proveedor_id || null,
                tipo: "entrada",
                cantidad: stock,
                descripcion: "Stock inicial al crear producto"
            })
        }

        console.log("Producto creado correctamente:", product);
        return product
    }

    async updateProduct(id, data){
        const product = await Products.findByPk(id)
        if(!product) throw new Error("El producto no existe")

        const oldStock = product.stock
        const newStock = data.stock

        await Products.update(data, {where: {id: id}})
        const updatedProduct = await Products.findByPk(id)

        // Crear movimiento de inventario si el stock cambió
        if (newStock !== oldStock) {
            const difference = newStock - oldStock
            if (difference > 0) {
                await InventoryMovement.create({
                    producto_id: id,
                    provider_id: updatedProduct.proveedor_id || null,
                    tipo: "entrada",
                    cantidad: difference,
                    descripcion: "Aumento de stock al actualizar producto"
                })
            } else if (difference < 0) {
                await InventoryMovement.create({
                    producto_id: id,
                    provider_id: updatedProduct.proveedor_id || null,
                    tipo: "salida",
                    cantidad: Math.abs(difference),
                    descripcion: "Disminución de stock al actualizar producto"
                })
            }
        }

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
