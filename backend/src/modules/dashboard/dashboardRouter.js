import express from "express";

import { roleMiddleware } from "../../middlewares/roleMiddlewares.js";
import { authMiddleware } from "../auth/authMiddleware.js";
import dashboardController from "./dashboardController.js";

const router = express.Router();

router.use(authMiddleware);

// Solo el admin puede ver el dashboard
router.get("/", roleMiddleware(["admin"]), (req, res) => dashboardController.getStart(req, res));
router.get("/seller", roleMiddleware(["vendedor", "admin"]), (req, res) => dashboardController.getSellerDashboard(req, res));

// Exportar reportes de ventas (solo admin)
router.get("/export/:period/:format", roleMiddleware(["admin"]), (req, res) => dashboardController.exportSalesReport(req, res));

export default router;
