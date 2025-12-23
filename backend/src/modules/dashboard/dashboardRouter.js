import express from "express";
import dashboardController from "./dashboardController.js";
import { roleMiddleware } from "../../middlewares/roleMiddlewares.js";
import { authMiddleware } from "../auth/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

// Solo el admin puede ver el dashboard
router.get("/", roleMiddleware(["admin"]), (req, res) => dashboardController.getStart(req, res));

export default router;
