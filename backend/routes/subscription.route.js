import express from "express";
import { upgradeSubscription } from "../controllers/subscription.controller.js";
import { authMiddleware, requireRole } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/:tenantName/upgrade", authMiddleware, requireRole("Admin"), upgradeSubscription);

export default router;
