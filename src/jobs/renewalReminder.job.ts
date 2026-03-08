import cron from "node-cron";
import Subscription from "../models/subscription.model.js";
import Notification from "../models/notification.model.js";
import { sendEmail } from "../services/email.service.js";

console.log("Renewal job file loaded");

cron.schedule("0 9 * * *", async () => {
  console.log("Running renewal reminder job...");

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const start = new Date(tomorrow.setHours(0, 0, 0, 0));
  const end = new Date(tomorrow.setHours(23, 59, 59, 999));

  const subscriptions = await Subscription.find().populate("userId");

  console.log("Subscriptions found:", subscriptions.length);

  for (const sub of subscriptions) {
    const user = sub.userId;

    const message = `Your subscription for ${sub.name} is renewing tomorrow.`;

    await sendEmail(user.email, "Subscription renewal reminder", message);

    await Notification.create({
      user: user._id,
      message,
    });

    console.log(`Reminder sent for ${sub.name}`);
  }
});
