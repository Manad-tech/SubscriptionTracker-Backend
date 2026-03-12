import nodemailer from "nodemailer";

export const sendRenewalEmail = async (email, name, amount, renewalDate) => {

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Subscription Renewal Reminder",
    text: `Your ${name} subscription of ₹${amount} renews on ${renewalDate}`
  });

};