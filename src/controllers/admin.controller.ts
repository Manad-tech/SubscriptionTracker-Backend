import { Request, Response } from "express";
import User from "../models/user.model.js";
import Subscription from "../models/subscription.model.js";
import mongoose from "mongoose";

export const getUsers = async (req: Request, res: Response) => {
  console.log("GET USERS CONTROLLER HIT");

  try {
    const users = await User.aggregate([
      {
        $lookup: {
          from: "subscriptions", // must match collection name
          localField: "_id",
          foreignField: "userId",
          as: "subscriptions",
        },
      },
      {
        $addFields: {
          subscriptionCount: { $size: "$subscriptions" },
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          createdAt: 1,
          subscriptionCount: 1,
        },
      },
    ]);

    console.log(users);

    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user" });
  }
};

export const getAllSubscriptions = async (req: Request, res: Response) => {
  try {
    const subscriptions = await Subscription.find().populate(
      "userId",
      "name email",
    );

    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch subscriptions" });
  }
};

export const getAdminStats = async (req: Request, res: Response) => {
  try {

    const totalUsers = await User.countDocuments();

    const totalSubscriptions = await Subscription.countDocuments();

    const revenue = await Subscription.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" }
        }
      }
    ]);

    const totalRevenue = revenue[0]?.total || 0;

    return res.status(200).json({
      totalUsers,
      totalSubscriptions,
      totalRevenue
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch admin stats"
    });

  }
};

export const deleteSubscription = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid subscription id" });
    }

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const subscription = await Subscription.findById(id);

    if (!subscription) {
      return res.status(404).json({
        message: "Subscription not found",
      });
    }

    // Only admin OR owner can delete
    if (
      req.user.role !== "Admin" &&
      subscription.userId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    await subscription.deleteOne();

    return res.status(200).json({
      message: "Subscription deleted successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

export const getMonthlyRevenue = async (req: Request, res: Response) => {
  try {
    const revenue = await Subscription.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          revenue: { $sum: "$amount" },
        },
      },
      {
        $project: {
          month: "$_id",
          revenue: 1,
          _id: 0,
        },
      },
      { $sort: { month: 1 } },
    ]);

    res.json(revenue);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
