import { Request, Response } from "express";
import Subscription from "../models/subscription.model.js";

export const createSubscription = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user._id;

    const {
      name,
      amount,
      currency,
      billingCycle,
      category,
      renewalDate,
      isShared,
    } = req.body;

    if (!name || !amount || !billingCycle || !category || !renewalDate) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided" });
    }

    const newSubscription = await Subscription.create({
      userId,
      name,
      amount,
      currency,
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

    const subscriptions = await Subscription.find(filter).sort({
      renewalDate: 1,
    });

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
