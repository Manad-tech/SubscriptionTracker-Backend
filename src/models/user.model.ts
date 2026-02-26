import { Hash } from "crypto";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ['Admin' , 'User'],
      required: true,
      default: 'User',
    }
  },
  {
    timestamps: true
  }
)

const User: any = mongoose.model('User', userSchema)
export default User