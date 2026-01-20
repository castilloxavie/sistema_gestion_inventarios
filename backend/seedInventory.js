import { sequelize } from "./src/config/databases.js";
import { InventoryMovement } from "./src/models/InventoryMovementModels.js";
import { Products } from "./src/models/ProducsModels.js";
import { Provider } from "./src/models/ProviderModels.js";
import { User } from "./src/models/UserModels.js";

async function seedInventory() {
    try {
        // Crear proveedores de prueba
        const provider1 = await Provider.create({
            nombre: "Proveedor ABC",
            email: "contacto@proveedorabc.com",
            telefono: "123456789"
        });

        const provider2 = await Provider.create({
            nombre: "Distribuidora XYZ",
            email: "ventas@xyz.com",
            telefono: "987654321"
        });

        // Crear productos de prueba
        const product1 = await Products.create({
            nombre: "Producto A",
            descripcion: "Descripción del producto A",
            precio: 100.00,
            stock: 50,
            proveedor_id: provider1.id
        });

        const product2 = await Products.create({
            nombre: "Producto B",
            descripcion: "Descripción del producto B",
            precio: 200.00,
            stock: 30,
            proveedor_id: provider2.id
        });

        // Crear usuario de prueba (si no existe)
        let user = await User.findOne({ where: { email: "admin@test.com" } });
        if (!user) {
            user = await User.create({
                nombre: "Admin",
                email: "admin@test.com",
                password: "123456" // En producción usar hash
            });
        }

        // Crear movimientos de inventario de prueba
        await InventoryMovement.create({
            producto_id: product1.id,
            provider_id: provider1.id,
            tipo: "entrada",
            cantidad: 20,
            usuario_id: user.id
        });

        await InventoryMovement.create({
            producto_id: product2.id,
            provider_id: provider2.id,
            tipo: "salida",
            cantidad: 5,
            usuario_id: user.id
        });

        await InventoryMovement.create({
            producto_id: product1.id,
            tipo: "entrada",
            cantidad: 10,
            usuario_id: user.id
        });

        console.log("Datos de prueba insertados correctamente");
        process.exit(0);
    } catch (error) {
        console.error("Error al insertar datos de prueba:", error);
        process.exit(1);
    }
}

seedInventory();
