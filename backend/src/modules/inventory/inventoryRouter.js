import express from "express";
import { authMiddleware } from "../auth/authMiddleware.js";
import { roleMiddleware } from "../../middlewares/roleMiddlewares.js";
import { InventoryController } from "./inventoryCntroller.js";

const router = express.Router()
const inventaryController = InventoryController()

router.use(authMiddleware)

router.get("/", roleMiddleware(["admin", "vendedor"]), (req, res) => inventaryController.getAll(req, res))
router.get("/:id", roleMiddleware(["admin", "vendedor"]), (req, res) => inventaryController.getBiId(req, res))
router.post("/", roleMiddleware(["admin", "vendedor"]), (req, res) => inventaryController.createMovement(req, res))


export default router