import express from "express";
import {
  getNotifications,
  markNotificationRead,
} from "../controllers/notification.controller.js";

import {authenticate} from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/notifications", authenticate, getNotifications);

router.patch("/notifications/:id/read", authenticate, markNotificationRead);

export default router;
