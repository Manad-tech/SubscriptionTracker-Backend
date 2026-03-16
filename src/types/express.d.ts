import { Types } from "mongoose";

declare global {
  namespace Express {
    interface Request {
      user: {
        _id: Types.ObjectId;
        role: "User" | "Admin";
        email: string;
        name: string;
      };
    }
  }
}