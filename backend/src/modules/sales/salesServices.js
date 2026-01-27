import { sequelize } from "../../config/databases.js";
import { Client } from "../../models/ClientModels.js";
import { InventoryMovement } from "../../models/InventoryMovementModels.js";
import { Products } from "../../models/ProducsModels.js";
import { SaleItem } from "../../models/SaleItemModels.js";
import { Sale } from "../../models/SaleModels.js";
import { User } from "../../models/UserModels.js";
import PDFDocument from 'pdfkit';

class SaleServices{
    async createSale(data) {
        const {usuario_id, items, metodo_pago, cliente_id} = data

        if(!items || items.length === 0) throw new Error("La venta debe tener al menos un item (producto)")
        
        const secureTransaction = await sequelize.transaction()

        try {
            let total = 0

            // Validar stock y calcular total
            for(const item of items){
                const product = await Products.findByPk(item.producto_id)

                if(!product) throw new Error(`El producto con ID ${item.producto_id} no existe`)
                if(product.stock < item.cantidad) throw new Error(`Stock insuficiente para el producto ${product.nombre}`)
                
                total += parseFloat(product.precio) * parseInt(item.cantidad)
            }

            // Calcular subtotal e iva (Asumiendo IVA 19% incluido en el precio)
            const subtotal = total / 1.19;
            const iva = total - subtotal;

            // Crear la venta
            const sale = await Sale.create({
                usuario_id,
                cliente_id: cliente_id || null,
                metodo_pago: metodo_pago || "efectivo",
                subtotal: subtotal.toFixed(2),
                iva: iva.toFixed(2),
                total: total.toFixed(2)
            },
            {
                transaction: secureTransaction
            })

            // Crear items de venta y actualizar inventario
            for(const item of items){
                const product = await Products.findByPk(item.producto_id)

                await SaleItem.create({
                    venta_id: sale.id,
                    producto_id: item.producto_id,
                    cantidad: item.cantidad,
                    precio_unitario: product.precio
                },
                {
                    transaction: secureTransaction
                })

                // Actualizar stock del producto
                product.stock -= item.cantidad
                await product.save({transaction: secureTransaction})

                // Registrar movimiento de inventario
                await InventoryMovement.create({
                    producto_id: item.producto_id,
                    tipo: "salida",
                    cantidad: item.cantidad,
                    descripcion: `Venta #${sale.id}`
                },
                {
                    transaction: secureTransaction
                })
            
            }

            await secureTransaction.commit()
            console.log("Se creo la venta correctamente: ", sale);
            return sale

        } catch (error) {
            await secureTransaction.rollback()
            throw error
        }
    }

    async getAllSales () {
        return await Sale.findAll({
            include: [
                {
                    model: SaleItem,
                    include: [{model: Products}]
                },
                {
                    model: User,
                    attributes: ["nombre", "apellido", "email"]
                },
                {
                    model: Client,
                    attributes: ["nombre", "apellido", "documento"]
                }
                
            ]
        })
    }

    async getSaleById (id) {
        const sale = await Sale.findByPk(id, {
            include: [
                {
                    model: SaleItem,
                    include: [{model: Products}]
                },
                {
                    model: User,
                    attributes: ["nombre", "apellido", "email"]
                },
                {
                    model: Client,
                    attributes: ["nombre", "apellido", "documento"]
                }
            ]
        })

        return sale
    }

    async generateSalePDF(saleId) {
        const sale = await this.getSaleById(saleId);
        if (!sale) throw new Error('Venta no encontrada');

        const doc = new PDFDocument({ margin: 50 });
        const buffers = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {});

        // Header
        doc.fontSize(20).text('Factura de Venta', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Factura #${sale.id}`, { align: 'center' });
        doc.text(`Fecha: ${new Date(sale.createdAt).toLocaleDateString('es-ES')}`, { align: 'center' });
        doc.moveDown();

        // Vendedor
        doc.fontSize(14).text('Vendedor:', { underline: true });
        doc.fontSize(12).text(`${sale.User.nombre} ${sale.User.apellido}`);
        doc.text(`Email: ${sale.User.email}`);
        doc.moveDown();

        // Cliente
        doc.fontSize(14).text('Cliente:', { underline: true });
        if (sale.Client) {
            doc.fontSize(12).text(`${sale.Client.nombre} ${sale.Client.apellido}`);
            doc.text(`Documento: ${sale.Client.documento}`);
        } else {
            doc.fontSize(12).text('Venta Anónima');
        }
        doc.moveDown();

        // Productos
        doc.fontSize(14).text('Productos:', { underline: true });
        doc.moveDown(0.5);

        const tableTop = doc.y;
        const itemX = 50;
        const qtyX = 300;
        const priceX = 400;
        const totalX = 500;

        // Table headers
        doc.fontSize(10).text('Producto', itemX, tableTop);
        doc.text('Cant.', qtyX, tableTop);
        doc.text('Precio', priceX, tableTop);
        doc.text('Total', totalX, tableTop);

        doc.moveTo(50, doc.y + 5).lineTo(550, doc.y + 5).stroke();

        let y = doc.y + 15;
        sale.SaleItems.forEach(item => {
            doc.fontSize(10).text(item.Product.nombre, itemX, y);
            doc.text(item.cantidad.toString(), qtyX, y);
            doc.text(`$${parseFloat(item.precio_unitario).toLocaleString()}`, priceX, y);
            doc.text(`$${(item.cantidad * parseFloat(item.precio_unitario)).toLocaleString()}`, totalX, y);
            y += 20;
        });

        doc.moveTo(50, y).lineTo(550, y).stroke();
        y += 10;

        // Totales
        doc.fontSize(12).text(`Subtotal: $${parseFloat(sale.subtotal).toLocaleString()}`, 400, y);
        y += 15;
        doc.text(`IVA (19%): $${parseFloat(sale.iva).toLocaleString()}`, 400, y);
        y += 15;
        doc.font('Helvetica-Bold').text(`Total: $${parseFloat(sale.total).toLocaleString()}`, 400, y);
        y += 20;

        // Método de pago
        doc.font('Helvetica').fontSize(12).text(`Método de Pago: ${sale.metodo_pago}`, 50, y);

        doc.end();

        return new Promise((resolve, reject) => {
            doc.on('end', () => {
                const pdfBuffer = Buffer.concat(buffers);
                resolve(pdfBuffer);
            });
            doc.on('error', reject);
        });
    }
}

export default new SaleServices()
