import { Request, Response, NextFunction } from "express";

export const adminMiddleware = (req: any, res: Response, next: NextFunction) => {

  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  if (req.user.role !== "Admin") {
    return res.status(403).json({ message: "Admin only access" });
  }

  next();
};