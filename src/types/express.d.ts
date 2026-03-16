import { Types } from "mongoose";
import { ObjectId } from "mongodb";

declare global {
  namespace Express {
    interface UserPayload {
      _id: ObjectId;
      role: "Admin" | "User";
      email: string;
      name: string;
    }
    interface Request {
      user?: UserPayload
    }
  }
}