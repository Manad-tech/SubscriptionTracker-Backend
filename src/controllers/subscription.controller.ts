import { Request, Response } from "express";
import Subscription from "../models/subscription.model.js";

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
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

export const readSubscription = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "UserId is required" });
    }

    const subscriptions = await Subscription.find({ userId });

    let monthlyTotal = 0;
    let yearlyTotal = 0;

    for (let i = 0; i < subscriptions.length; i++) {
      const sub: any = subscriptions[i];

      if (sub.billingCycle === "Monthly") {
        monthlyTotal = monthlyTotal + sub.amount;
      } else if (sub.billingCycle === "Yearly") {
        yearlyTotal = yearlyTotal + sub.amount;
      }
    }

    return res.status(200).json({
      subscriptions,
      monthlyTotal,
      yearlyTotal,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

export const updateSubscription = async (req: Request , res:Response) => {
  try {
    const {userId} = req.params

    if(!userId) {
      return res.status(400).json({ message: 'UserId is required'})
    }

    const subscriptions = await Subscription.updateOne({userId:{} } , )
  } catch (error) {
    
  }
}
