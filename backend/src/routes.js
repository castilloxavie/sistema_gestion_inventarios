import express from "express";
import authRouter from "./modules/auth/authRouter.js"
import userRouter from "./modules/users/userRouter.js"
import productRouter from "./modules/product/productRouter.js"
import providersRouter from "./modules/providers/providersRouter.js"
import inventoryRouter from "./modules/inventory/inventoryRouter.js"
import saleRouter from "./modules/sales/salesRouter.js"
import dashboardRouter from "./modules/dashboard/dashboardRouter.js"
const router = express.Router();

//!registrar rutas 
router.use("/auth", authRouter)
router.use("/users", userRouter)
router.use("/products", productRouter)
router.use("/providers", providersRouter)
router.use("/inventory", inventoryRouter)
router.use("/sales", saleRouter)
router.use("/dashboard", dashboardRouter)

export default router;
