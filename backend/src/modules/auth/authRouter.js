import express from "express"
import authControllers from "./authControllers.js"


const router = express.Router()

//rutas de registro y de login
router.post("/register", (req, res) => authControllers.register(req, res))
router.post("/login", (req, res) => authControllers.login(req, res))

export default router