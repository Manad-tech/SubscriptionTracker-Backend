import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { Router } from "express";
import {
  createSubscription,
  readSubscription,
  readAllSubscriptions,
  updateSubscription,
  deleteSubscription,
  readUsersSubscription,
  getCategoryStats,
  getTotalSpending,
  getUpcomingRenewals,
} from "../controllers/subscription.controller.js";

const router = Router();

router.get('/subscriptions/stats/category', authenticate , getCategoryStats)
router.get("/subscriptions/stats/total", authenticate, getTotalSpending);
router.get("/subscriptions/upcoming", authenticate, getUpcomingRenewals);
router.post("/subscriptions", authenticate, createSubscription);
router.get("/subscriptions/:id", authenticate, readSubscription);
router.get("/subscriptions", authenticate, readAllSubscriptions);
router.patch("/subscriptions/:id", authenticate, updateSubscription);
router.delete("/subscriptions/:id", authenticate, deleteSubscription);

export default router;
