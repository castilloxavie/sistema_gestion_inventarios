import express from "express"
import UserController from "./userControllers.js"
import { authMiddleware } from "../auth/authMiddleware.js"
import { roleMiddleware } from "../../middlewares/roleMiddlewares.js"

const router = express.Router()
const controller = UserController

//todas las rutas requieren le login
router.use(authMiddleware)

router.get("/", roleMiddleware(["admin"]), (req, res) => controller.getAll(req, res))
router.get("/:id", roleMiddleware(["admin", "vendedor"]), (req, res) => controller.getById(req, res))
router.post("/", roleMiddleware(["admin"]), (req, res) => controller.create(req, res))
router.put("/:id", roleMiddleware(["admin"]), (req, res) => controller.update(req, res))
router.delete("/:id", roleMiddleware(["admin"]), (req, res) => controller.delete(req, res))

export default router
