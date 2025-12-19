import express from "express";
import authRouter from "./modules/auth/authRouter.js"
import userRouter from "./modules/users/userRouter.js"
import productRouter from "./modules/product/productRouter.js"
import providersRouter from "./modules/providers/providersRouter.js"
import inventoryRouter from "./modules/inventory/inventoryRouter.js"
const router = express.Router();

//!registrar rutas 
router.use("/auth", authRouter)
router.use("/users", userRouter)
router.use("/products", productRouter)
router.use("/providers", providersRouter)
router.use("/inventory", inventoryRouter)

export default router;
