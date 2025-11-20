import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

export function authMiddleware(req, res, next){
    const token = req.headers.authorization?.split(" ")[1]

    if(!token){
        console.error("Acceso denegado, se requiere un token")
        return res.status(401).json({
            error: "Acceso Denegado, se requiere un token"
        })
    }

    try {
        const decode = jwt.verify(token, process.env.SECURITY_TOKEN_JWT)
        req.user = decode
        next()
    } catch (error) {
        console.error("Token no válido")
        return res.status(401).json({
            error: "Token no válido"
        })
    }
}