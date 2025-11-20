import express from "express";
import authRouter from "./modules/auth/authRouter.js"
const router = express.Router();

//registrar rutas 
router.use("/auth", authRouter)

export default router;
