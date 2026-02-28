import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/user.model.js";
import { Request, Response, NextFunction } from "express";

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const parts = header.split(" ");

    if (parts.length !== 2) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    const token = parts[1];

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET not defined");
    }

    const decoded = jwt.verify(token, secret as string);
    console.log("Decoded:", decoded);

    if (!decoded.userId || typeof decoded.userId !== "string") {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
