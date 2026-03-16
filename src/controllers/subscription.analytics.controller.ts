import { Request, Response } from "express";
import Subscription from "../models/subscription.model.js";

export const getCategoryStats = async (req: Request, res: Response) => {
  try {

    const matchStage = req.user.role === "Admin" ? {} : { userId: req.user._id };

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

    const user = req.user!;

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

    const total = result.length ? result[0].total : 0;

    return res.status(200).json({ total });
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

    const filter = req.user.role === "Admin" ? {} : { userId: req.user._id };

    const result = await Subscription.aggregate([
      { $match: filter },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
    ]);

    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};
