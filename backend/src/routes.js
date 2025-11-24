import express from "express";
import authRouter from "./modules/auth/authRouter.js"
import userRouter from "./modules/users/userRouter.js"
import productRouter from "./modules/product/productRouter.js"
const router = express.Router();

//!registrar rutas 
router.use("/auth", authRouter)
router.use("/users", userRouter)
router.use("/products", productRouter)

export default router;
