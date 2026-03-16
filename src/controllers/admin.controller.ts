import { Request, Response } from "express";
import User from "../models/user.model.js";
import Subscription from "../models/subscription.model.js";
import mongoose from "mongoose";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.aggregate([
      {
        $lookup: {
          from: "subscriptions",
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

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await Subscription.deleteMany({ 
      userId: new mongoose.Types.ObjectId(id as string) 
    });

    await User.findByIdAndDelete(id);

    res.json({ message: "User and subscriptions deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user" });
  }
};

export const getAllSubscriptions = async (req: Request, res: Response) => {
  try {

    const page = Number(req.query.page) || 1
    const limit = 10

    const subscriptions = await Subscription.find()
      .populate("userId","name email")
      .sort({createdAt: -1})
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Subscription.countDocuments()



    res.json({
      page,
      totalPages: Math.ceil(total / limit),
      totalSubscriptions: total,
      subscriptions,
    });
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
          total: { $sum: "$amount" },
        },
      },
    ]);

    const totalRevenue = revenue.length ? revenue[0].total : 0;

    return res.status(200).json({
      totalUsers,
      totalSubscriptions,
      totalRevenue,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch admin stats",
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
