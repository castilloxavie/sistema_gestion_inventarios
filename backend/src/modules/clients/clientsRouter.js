import { Router } from "express";

import { authMiddleware } from "../auth/authMiddleware.js";
import clientController from "./clientsControllers.js";

const router = Router();

router.use(authMiddleware);

router.post("/", clientController.create);
router.get("/", clientController.getAll);
router.get("/documento/:documento", clientController.getByDocument);

export default router;
