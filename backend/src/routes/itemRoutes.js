import { Router } from "express";
import {
  createItem,
  getItems,
  updateItem,
  updateStatus,
  deleteItem,
} from "../controllers/itemController.js";
import { authMiddleware } from "../middleware/auth.js";
import { attachHouseholdToReqObj } from "../middleware/household.js";
import { checkItemExists, checkOwnership } from "../middleware/item.js";

const router = Router();

router.use(authMiddleware, attachHouseholdToReqObj);

router.post("/", createItem);
router.get("/", getItems);
router.put("/:id", checkItemExists, checkOwnership, updateItem);
router.patch("/:id/status", checkItemExists, checkOwnership, updateStatus);
router.delete("/:id", checkItemExists, checkOwnership, deleteItem);

export default router;
