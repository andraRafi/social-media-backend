import { User } from "../models/usersModel";
import { NextFunction, Response } from "express";
import { userRequest } from "../middleware/jwtHandler";

export const curentAccount = async (
  req: userRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.user?._id).select("-password");

    if (!user) {
      res.status(404);
      throw new Error("user not found");
    }

    res.status(200).json({
      status: "success",
      message: "Current account details",
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const setBio = async (
  req: userRequest<{}, {}, { bio: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bio } = req.body;

    const updateBio = await User.findOneAndUpdate(
      { _id: req.user?._id },
      { bio: bio },
      { new: true }
    );

    if (!updateBio) {
      res.status(404);
      throw new Error("user not found");
    }

    res.status(200).json({
      status: "success",
      message: "bio changged",
      bio: updateBio.bio,
    });
  } catch (error) {
    next(error);
  }
};

export const changeUsername = async (
  req: userRequest<{}, {}, { username: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username } = req.body;

    const updateUSername = await User.findOneAndUpdate(
      { _id: req.user?._id },
      { username },
      { new: true }
    );

    if (!updateUSername) {
      res.status(404);
      throw new Error("user not found");
    }

    res.status(200).json({
      status: "success",
      message: "username changged",
      username,
    });
  } catch (error) {
    next(error);
  }
};
