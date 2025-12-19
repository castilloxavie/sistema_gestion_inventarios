import express from "express";
import salesControllers from "./salesControllers";
import { roleMiddleware } from "../../middlewares/roleMiddlewares";
import { authMiddleware } from "../auth/authMiddleware";
import salesControllers from "./salesControllers";

const router = express.Router()
const salesControllers = salesControllers()

router.use(authMiddleware)

router.post("/", roleMiddleware(["admin"]), (req, res) => salesControllers.create(req, res))
router.get("/", roleMiddleware(["admin", "vendedor"]), (req, res) => salesControllers.getSale(req, res))
router.get("/:id", roleMiddleware(["admin"]), (req, res) => salesControllers.getSaleById(req, res))

export default router