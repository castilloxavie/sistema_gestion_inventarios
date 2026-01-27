import express from "express"

import { roleMiddleware } from "../../middlewares/roleMiddlewares.js"
import { authMiddleware } from "../auth/authMiddleware.js"
import ProductControllers from "./productControllers.js"

const router = express.Router()
const proeducController = ProductControllers

router.use(authMiddleware)

//rutas
router.get("/", roleMiddleware(["admin", "vendedor"]), (req, res) => proeducController.getAllProduct(req, res))
router.get("/:id", roleMiddleware(["admin", "vendedor"]), (req, res) => proeducController.getByIdProduct(req, res))
router.post("/", roleMiddleware(["admin"]), (req, res) => proeducController.createProduct(req, res))
router.put("/:id", roleMiddleware(["admin"]), (req, res) => proeducController.updateProduct(req, res))
router.delete("/:id", roleMiddleware(["admin"]), (req, res) => proeducController.deleteProduct(req, res))

export default router