import { Request, Response } from "express";
import Subscription from "../models/subscription.model.js";
import mongoose from "mongoose";

export const createSubscription = async (req: Request, res: Response) => {
  try {
    const {
      userId,
      name,
      amount,
      billingCycle,
      category,
      renewalDate,
      isShared,
    } = req.body;

    if (
      !userId ||
      !name ||
      !amount ||
      !billingCycle ||
      !category ||
      !renewalDate
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided" });
    }

    const newSubscription = new Subscription({
      userId,
      name,
      amount,
      billingCycle,
      category,
      renewalDate,
      isShared,
    });

    const savedSubscription = await newSubscription.save();

    return res.status(201).json(savedSubscription);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

export const readAllSubscriptions = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    
    const mockUser = {
      _id: new mongoose.Types.ObjectId("69a08960cd4c6103e1587d0b"),
      role: "User",
    };
    
    let filter = {};
    
    if (mockUser.role === "Admin") {
      filter = {};
    }
    else {
      filter = { userId: mockUser._id}
    }
    
    const subscriptions = await Subscription.find(filter);

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

    if (!id) {
      return res.status(400).json({ message: "UserId is required" });
    }

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

    return res.status(200).json(updatedSubscription);
  } catch (error: any) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
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

    if (!usersSubscription) {
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
