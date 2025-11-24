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
            await sequelize.sync({alter: true})
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
