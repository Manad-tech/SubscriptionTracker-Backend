import mongoose, { isValidObjectId } from "mongoose";
import { ref } from "process";

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
    billingCycle: {
      type: String,
      required: true,
      enum: ['Monthly' , 'Yearly'],
    },
    category: {
      type: String,
      required: true,
    },
    renewalDate: {
      type: Date,
      required: true
    },
    isShared: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
)

const Subscription = mongoose.model('Subscription' , subscriptionSchema) 

export default Subscription