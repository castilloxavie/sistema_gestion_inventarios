import express from "express";
import salesControllers from "./salesControllers.js";
import { roleMiddleware } from "../../middlewares/roleMiddlewares.js";
import { authMiddleware } from "../auth/authMiddleware.js";
import { validateSaleCreate } from "./salesValidators.js";

const router = express.Router()

router.use(authMiddleware)

router.post("/", roleMiddleware(["admin", "vendedor"]), validateSaleCreate, (req, res) => salesControllers.create(req, res))
router.get("/", roleMiddleware(["admin", "vendedor"]), (req, res) => salesControllers.getSale(req, res))
router.get("/:id", roleMiddleware(["admin", "vendedor"]), (req, res) => salesControllers.getSaleById(req, res))
router.get("/:id/pdf", authMiddleware, (req, res) => salesControllers.generatePDF(req, res))

export default router