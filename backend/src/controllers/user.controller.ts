import { Request, Response, NextFunction } from "express";
import User from "../lib/models/user.models";

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find();

    // to fix this cos it doesnt exist for me
    // const currentUserId = req.auth.userId;

    if (!users || users.length === 0) {
      return res.status(200).json({ message: "No users yet!" });
    }

    res.status(200).json(users);
  } catch (error) {
    console.log("Error in getAllUsers route", error);
    next(error);
  }
};
