import { Router } from "express";
import {
  createHousehold,
  joinHousehold,
  getMyHousehold,
  getMembers,
  leaveHousehold,
} from "../controllers/householdController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

router.post("/", authMiddleware, createHousehold);
router.post("/join", authMiddleware, joinHousehold);
router.get("/me", authMiddleware, getMyHousehold);
router.post("/leave", authMiddleware, leaveHousehold);
router.get("/:id/members", authMiddleware, getMembers);

export default router;
