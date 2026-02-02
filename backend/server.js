import { app } from "./src/app.js";
import { sequelize } from "./src/config/databases.js"
import "./src/models/index.js"
import dotenv from "dotenv"
dotenv.config()


async function star() {
    try {
        await sequelize.authenticate()
        console.log("Conexion a la base de datos exitosa")

        if(process.env.NODE_ENV === 'development'){
            // alter: true intenta actualizar la estructura de la tabla, pero puede causar duplicidad de índices
            // Se cambia a false para evitar el error "Too many keys"
            // Si necesitas recrear las tablas por completo, usa { force: true } (¡CUIDADO: BORRA DATOS!)
            await sequelize.sync({alter: false})
            console.log("Tablas sincronizadas correctamente");
        } else {
            console.log("Modo producción - sincronización de tablas desactivada");
        }

        const PORT = process.env.PORT || 3000

        app.listen(PORT, () => {
            console.log(`App escuchando peticiones en el puerto http://localhost:${PORT}!`);
        });
        
    } catch (error) {
            console.error("Error al inicioa le servidor:", error);
            
    }
}
star()
