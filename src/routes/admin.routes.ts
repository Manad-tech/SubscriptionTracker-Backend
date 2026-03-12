import express from "express";
import {
  getUsers,
  deleteUser,
  getAllSubscriptions,
  getAdminStats,
  getMonthlyRevenue,
} from "../controllers/admin.controller.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { deleteSubscription } from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/users", authenticate, adminMiddleware, getUsers);
router.delete("/users/:id", authenticate, adminMiddleware, deleteUser);
router.get(
  "/subscriptions",
  authenticate,
  adminMiddleware,
  getAllSubscriptions,
);
router.get("/stats", authenticate, adminMiddleware, getAdminStats);

router.delete(
  "/subscriptions/:id",
  authenticate,
  adminMiddleware,
  deleteSubscription,
);

router.get(
  "/revenue/monthly",
  authenticate,
  adminMiddleware,
  getMonthlyRevenue
);

export default router;
