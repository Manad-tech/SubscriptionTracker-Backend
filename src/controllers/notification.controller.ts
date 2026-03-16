import { Request, Response } from "express";
import Notification from "../models/notification.model.js";

export const getNotifications = async (req: Request, res: Response) => {
  try {

    const userId = req.user!._id;

    const notifications = await Notification.find({
      user: userId
    }).sort({ createdAt: -1 });

    res.json(notifications);

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};


export const markNotificationRead = async (req: Request, res: Response) => {
  try {

    const notification = await Notification.findByIdAndUpdate(
      {_id: req.params.id, user: req.user?._id},
      { read: true },
      { new: true }
    );

    res.json(notification);

  } catch (error) {
    res.status(500).json({ message: "Failed to update notification" });
  }
};

export const getUnreadCount = async (req: Request, res: Response) => {
  try {

    const userId = req.user!._id;

    const count = await Notification.countDocuments({
      user: userId,
      read: false
    });

    res.json({ unreadCount: count });

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch unread count" });
  }
};