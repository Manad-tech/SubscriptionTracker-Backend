import { Request, Response } from "express";
import Subscription from "../models/subscription.model.js";

export const createSubscription = async (req: Request, res: Response) => {
  try {
    console.log("BODY:", req.body);

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user._id;

    const { name, amount, billingCycle, category, renewalDate, isShared } =
      req.body;

    if (!name || !amount || !billingCycle || !category || !renewalDate) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided" });
    }

    const newSubscription = await Subscription.create({
      userId,
      name,
      amount,
      billingCycle,
      category,
      renewalDate,
      isShared,
      reminderSent: false,
    });

    return res.status(201).json(newSubscription);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

export const readAllSubscriptions = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const filter: any =
      req.user.role === "Admin" ? {} : { userId: req.user?._id };

    const subscriptions = await Subscription.find(filter);

    console.log("Role:", req.user?.role);
    console.log("Filter:", filter);

    return res.status(200).json({
      subscriptions,
    });
  } catch (error: any) {
    return res.status(500).json({ message: "Server Error" });
  }
};

export const readSubscription = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "id is required" });
    }

    const subscription = await Subscription.findById(id);

    if (!subscription) {
      return res.status(404).json({
        message: "Subscription not Found",
      });
    }

    return res.status(200).json({
      subscription,
    });
  } catch (error: any) {
    return res.status(500).json({ message: "Server Error" });
  }
};

export const updateSubscription = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const updatedSubscription = await Subscription.findByIdAndUpdate(
      id,
      req.body,
      { new: true },
    );

    if (!updatedSubscription) {
      return res.status(404).json({
        message: "Subscription not found",
      });
    }

    // Reset reminder when subscription changes
    updatedSubscription.reminderSent = false;

    await updatedSubscription.save();

    return res.status(200).json(updatedSubscription);
  } catch (error: any) {
    return res.status(500).json({
      message: "Server Error",
    });
  }
};

export const deleteSubscription = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedSubscription = await Subscription.findByIdAndDelete(id);

    if (!deletedSubscription) {
      return res.status(404).json({
        message: "Subscription not found",
      });
    }

    return res.status(200).json({
      message: "Subscription deleted Successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

export const readUsersSubscription = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const usersSubscription = await Subscription.find({ userId });

    if (usersSubscription.length === 0) {
      return res.status(404).json({
        message: "UsersSubscription not Found",
      });
    }

    return res.status(200).json({
      usersSubscription,
    });
  } catch (error: any) {
    return res.status(500).json({ message: "Server Error" });
  }
};

export const getCategoryStats = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const matchStage =
      req.user.role === "Admin" ? {} : { userId: req.user._id };

    const stats = await Subscription.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          total: 1,
        },
      },
    ]);

    return res.status(200).json(stats);
  } catch (error: any) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

export const getTotalSpending = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const matchStage =
      req.user.role === "Admin" ? {} : { userId: req.user._id };

    const result = await Subscription.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    const total = result[0]?.total || 0;

    return res.status(200).json({ total });
  } catch (error: any) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

export const getUpcomingRenewals = async (req: Request, res: Response) => {

  console.log("Category trend route hit");
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

export const getMonthlyCategoryTrend = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const matchStage =
      req.user.role === "Admin" ? {} : { userId: req.user._id };

    const stats = await Subscription.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            month: { $month: "$renewalDate" },
            category: "$category",
          },
          total: { $sum: "$amount" },
        },
      },
      {
        $project: {
          month: "$_id.month",
          category: "$_id.category",
          total: 1,
          _id: 0,
        },
      },
      { $sort: { month: 1 } },
    ]);

    res.status(200).json(stats);
  } catch (error: any) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

export const getCategorySpending = async (req: Request, res: Response) => {
  try {

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const filter =
      req.user.role === "Admin" ? {} : { userId: req.user._id };

    const result = await Subscription.aggregate([
      { $match: filter },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" }
        }
      }
    ]);

    res.status(200).json(result);

  } catch (error: any) {

    res.status(500).json({
      message: "Server Error",
      error: error.message
    });

  }
};

export const getMonthlyCategoryTrends = async (req: Request, res: Response) => {
  try {

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const filter =
      req.user.role === "Admin" ? {} : { userId: req.user._id };

    const result = await Subscription.aggregate([
      { $match: filter },
      {
        $group: {
          _id: {
            month: { $month: "$renewalDate" },
            category: "$category"
          },
          total: { $sum: "$amount" }
        }
      },
      { $sort: { "_id.month": 1 } }
    ]);

    res.status(200).json(result);

  } catch (error: any) {

    res.status(500).json({
      message: "Server Error",
      error: error.message
    });

  }
};