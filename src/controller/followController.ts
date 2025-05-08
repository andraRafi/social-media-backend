import { NextFunction, Response } from "express";
import mongoose from "mongoose";
import { userRequest } from "../middleware/jwtHandler";
import { Follow } from "../models/followsModel";

export const followUser = async (
  req: userRequest<{ userId: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user?._id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400);
      throw new Error("Invalid user ID");
    }

    if (userId === currentUserId) {
      res.status(400);
      throw new Error("Cannot follow yourself");
    }

    const existingFollow = await Follow.findOne({
      followed_user_id: userId,
      following_user_id: currentUserId,
    });

    if (existingFollow) {
      res.status(409);
      throw new Error("Already following this user");
    }

    await Follow.create({
      followed_user_id: userId,
      following_user_id: currentUserId,
    });

    res.status(200).json({
      status: "success",
      message: "User followed successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const unfollowUser = async (
  req: userRequest<{ userId: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user?._id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400);
      throw new Error("Invalid user ID");
    }

    if (userId === currentUserId) {
      res.status(400);
      throw new Error("Cannot unfollow yourself");
    }

    const result = await Follow.deleteOne({
      followed_user_id: userId,
      following_user_id: currentUserId,
    });

    if (result.deletedCount === 0) {
      res.status(404);
      throw new Error("You are not following this user");
    }

    res.status(200).json({
      status: "success",
      message: "User unfollowed successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const showFollowers = async (
  req: userRequest<{ userId: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400);
      throw new Error("Invalid user ID");
    }

    const followers = await Follow.find({ followed_user_id: userId })
      .populate("following_user_id", "username")
      .select("following_user_id");

    if (!followers) {
      res.status(404);
      throw new Error("followers not found");
    }

    res.status(200).json({
      status: "success",
      message: "list followers",
      followers,
    });
  } catch (error) {
    next(error);
  }
};

export const showFollowing = async (
  req: userRequest<{ userId: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400);
      throw new Error("Invalid user ID");
    }

    const following = await Follow.find({ following_user_id: userId })
      .populate("followed_user_id", "username")
      .select("followed_user_id");

    if (!following) {
      res.status(404);
      throw new Error("following not found");
    }

    res.status(200).json({
      status: "success",
      message: "list following",
      following,
    });
  } catch (error) {
    next(error);
  }
};
