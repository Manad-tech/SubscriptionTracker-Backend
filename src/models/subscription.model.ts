import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    amount: {
      type: Number,
      required: true,
      min: 0
    },

    currency: {
      type: String,
      default: "INR"
    },

    billingCycle: {
      type: String,
      required: true,
      enum: ["Monthly", "Yearly"]
    },

    category: {
      type: String,
      required: true
    },

    renewalDate: {
      type: Date,
      required: true
    },

    reminderDays: {
      type: Number,
      default: 1
    },

    status: {
      type: String,
      enum: ["Active", "Cancelled"],
      default: "Active"
    },

    isShared: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;