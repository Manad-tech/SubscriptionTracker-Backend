import cron from "node-cron";
import Subscription from "../models/subscription.model.js";
import User from "../models/user.model.js";
import { sendRenewalEmail } from "../services/email.service.js";

cron.schedule("0 9 * * *", async () => {
  try {
    console.log("Running subscription reminder job...");

    const today = new Date();
    const subscriptions = await Subscription.find({
      status: "Active",
      reminderSent: false,
      renewalDate: { $gte: today },
    }).populate("userId");

    for (const sub of subscriptions) {
      const reminderDate = new Date(sub.renewalDate);
      reminderDate.setDate(reminderDate.getDate() - sub.reminderDays);

      if (today >= reminderDate) {
        const user = sub.userId as any;

        if (!user) continue;

        await sendRenewalEmail(
          user.email,
          sub.name,
          sub.amount,
          sub.renewalDate,
        );

        sub.reminderSent = true;
        await sub.save();
      }
    }
  } catch (error) {
    console.error("Reminder cron job failed:", error);
  }
});
