import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { User } from "../models/usersModel";

export const refreshAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      res.status(401);
      throw new Error("Refresh token not found");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      _id: string;
    };
    const user = await User.findById(decoded._id);
    if (!user) {
      res.status(401);
      throw new Error("User not found");
    }

    const newAccessToken = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      status: "success",
      message: "Access token refreshed",
      data: { accessToken: newAccessToken },
    });
  } catch (error) {
    res.status(403).json({
      status: "fail",
      message: "Invalid or expired refresh token",
    });
  }
};
