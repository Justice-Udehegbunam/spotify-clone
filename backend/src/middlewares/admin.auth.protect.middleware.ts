import { requireAuth } from "./auth.protect.middleware";
import { Request, Response, NextFunction } from "express";

export const requireAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await requireAuth(req, res, async () => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized - User not found" });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden - Admins only" });
    }
    next();
  });
};
