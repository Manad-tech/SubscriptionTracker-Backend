import { authenticate } from "../middleware/auth.middleware.js";
import { Router } from "express";
import {createSubscription,readSubscription,readAllSubscriptions,
  updateSubscription,deleteSubscription,} from "../controllers/subscription.controller.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";
import { getCategorySpending, getCategoryStats, getMonthlyCategoryTrend, getTotalSpending } from "../controllers/subscription.analytics.controller.js";
import { getUpcomingRenewals, readUsersSubscription } from "../controllers/subscription.admin.controller.js";

const router = Router();

router.get("/subscriptions/stats/category", authenticate, getCategoryStats);
router.get("/subscriptions/stats/total", authenticate, getTotalSpending);
router.get("/subscriptions/upcoming", authenticate, getUpcomingRenewals);
router.post("/subscriptions", authenticate, createSubscription);
router.get("/subscriptions/:id", authenticate, readSubscription);
router.get("/subscriptions", authenticate, readAllSubscriptions);
router.patch("/subscriptions/:id", authenticate, updateSubscription);
router.delete("/subscriptions/:id", authenticate, deleteSubscription);
router.get("/subscriptions/user/:userId",authenticate,adminMiddleware,readUsersSubscription);
router.get("/subscriptions/stats/category-trend",authenticate, getMonthlyCategoryTrend);
router.get("/subscriptions/stats/category-spending",authenticate,getCategorySpending,);

export default router;
