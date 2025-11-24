import express from "express";
import ProvidersControllers from "./providersControllers.js";
import {roleMiddleware} from "../../middlewares/roleMiddlewares.js"
import {authMiddleware} from "../../modules/auth/authMiddleware.js"

const router = express.Router()
const providersController = ProvidersControllers

router.use(authMiddleware)

//rutas
router.get("/", roleMiddleware(["admin"]), (req, res) => providersController.getAllProvider(req, res))
router.get("/:id", roleMiddleware(["admin", "vendedor"]), (req, res) => providersController.getByProvider(req, res))
router.post("/", roleMiddleware(["admin"]), (req, res) => providersController.createProvider(req, res))
router.put("/:id", roleMiddleware(["admin", "vendedor"]), (req, res) => providersController.updateProvider(req, res))
router.delete("/:id", roleMiddleware(["admin"]), (req, res) => providersController.deleteProvider(req, res))

export default router
