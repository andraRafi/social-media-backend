import { NextFunction, Response, Request } from "express";

import { User } from "../models/usersModel";

export const searchUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const q = req.query.q;
    const users = await User.find({
      $or: [{ username: { $regex: q, $options: "i" } }],
    }).select("username");

    res.status(200).json({
      status: "success",
      users,
    });
  } catch (error) {
    next(error);
  }
};
