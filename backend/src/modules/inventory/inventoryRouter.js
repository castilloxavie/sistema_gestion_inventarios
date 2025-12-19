import express from "express";
import { authMiddleware } from "../auth/authMiddleware.js";
import { roleMiddleware } from "../../middlewares/roleMiddlewares.js";
import { InventoryController } from "./inventoryController.js";

const router = express.Router()
const inventoryController = new InventoryController()

router.use(authMiddleware)

router.get("/", roleMiddleware(["admin", "vendedor"]), (req, res) => inventoryController.getAll(req, res))
router.get("/:id", roleMiddleware(["admin", "vendedor"]), (req, res) => inventoryController.getById(req, res))
router.post("/", roleMiddleware(["admin", "vendedor"]), (req, res) => inventoryController.create(req, res))


export default router