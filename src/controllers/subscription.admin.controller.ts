import { Request, Response } from "express";
import Subscription from "../models/subscription.model.js";
import mongoose from "mongoose";

export const readUsersSubscription = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
     if (!userId || !mongoose.Types.ObjectId.isValid(userId as string)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const usersSubscription = await Subscription.find({ userId });

    return res.status(200).json({
      usersSubscription,
    });
  } catch (error: any) {
    return res.status(500).json({ message: "Server Error" });
  }
};

export const getUpcomingRenewals = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const today = new Date();
    const next30Days = new Date();
    next30Days.setDate(today.getDate() + 30);

    const matchStage =
      req.user.role === "Admin"
        ? { renewalDate: { $gte: today, $lte: next30Days } }
        : {
            userId: req.user._id,
            renewalDate: { $gte: today, $lte: next30Days },
          };

    const renewals = await Subscription.find(matchStage).sort({
      renewalDate: 1,
    });

    return res.status(200).json(renewals);
  } catch (error: any) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};