import express from "express";
import authRouter from "./modules/auth/authRouter.js"
import userRouter from "./modules/users/userRouter.js"
const router = express.Router();

//!registrar rutas 
router.use("/auth", authRouter)
router.use("/users",userRouter)

export default router;
