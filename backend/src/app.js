import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import router from "./routes.js"

export const app = express()

app.use(helmet()) // Seguridad HTTP Headers
app.use(morgan("dev")) // Logging de peticiones
app.use(cors())
app.use(express.json())
app.use("/api", router)

// Manejador global de errores
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({
        status: "error",
        message: err.message || "Error interno del servidor"
    })
})

export default app