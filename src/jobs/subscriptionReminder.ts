import cron from "node-cron";
import Subscription from "../models/subscription.model.js";
import User from "../models/user.model.js";
import { sendRenewalEmail } from "../services/email.service.js";

cron.schedule("0 9 * * *", async () => {
  try {

    console.log("Running subscription reminder job...");

    const subscriptions = await Subscription.find({
      status: "Active",
      reminderSent: false,
    });

    const today = new Date();

    for (const sub of subscriptions) {

      const reminderDate = new Date(sub.renewalDate);

      // subtract reminderDays from renewalDate
      reminderDate.setDate(reminderDate.getDate() - sub.reminderDays);

      if (today >= reminderDate) {

        const user = await User.findById(sub.userId);

        if (!user) continue;

        await sendRenewalEmail(
          user.email,
          sub.name,
          sub.amount,
          sub.renewalDate
        );

        // mark reminder as sent
        sub.reminderSent = true;

        await sub.save();

        console.log(`Reminder sent for ${sub.name}`);

      }
    }

  } catch (error) {

    console.error("Reminder cron job failed:", error);

  }
});