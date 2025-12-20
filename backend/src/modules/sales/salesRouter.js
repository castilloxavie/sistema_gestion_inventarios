import express from "express";
import salesControllers from "./salesControllers.js";
import { roleMiddleware } from "../../middlewares/roleMiddlewares.js";
import { authMiddleware } from "../auth/authMiddleware.js";

const router = express.Router()

router.use(authMiddleware)

router.post("/", roleMiddleware(["admin", "vendedor"]), (req, res) => salesControllers.create(req, res))
router.get("/", roleMiddleware(["admin", "vendedor"]), (req, res) => salesControllers.getSale(req, res))
router.get("/:id", roleMiddleware(["admin"]), (req, res) => salesControllers.getSaleById(req, res))

export default router