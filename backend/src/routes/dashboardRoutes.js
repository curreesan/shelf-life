import { Router } from "express";
import { getStats, getExpiring } from "../controllers/dashboardController.js";
import { authMiddleware } from "../middleware/auth.js";
import { attachHouseholdToReqObj } from "../middleware/household.js";

const router = Router();

router.use(authMiddleware, attachHouseholdToReqObj);

router.get("/stats", getStats);
router.get("/expiring", getExpiring);

export default router;
