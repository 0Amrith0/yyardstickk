import express from "express";
import { getTenantMembers, inviteMember } from "../controllers/tenant.controller.js";
import { authMiddleware, requireRole } from "../middlewares/auth.middleware.js";

const router = express.Router();


router.get("/:tenantId/members", authMiddleware, getTenantMembers);
router.post("/:tenantId/invite", authMiddleware, requireRole("Admin"), inviteMember);

export default router;
