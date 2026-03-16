import express from "express";
import {getNotifications,getUnreadCount,markNotificationRead,} from "../controllers/notification.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/notifications", authenticate, getNotifications);
router.patch("/notifications/:id/read", authenticate, markNotificationRead);
router.get("/notifications/unread-count", authenticate, getUnreadCount);

export default router;
