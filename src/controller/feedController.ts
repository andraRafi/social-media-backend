import { NextFunction, Response } from "express";
import { userRequest } from "../middleware/jwtHandler";
import { Feed } from "../models/feedsModel";
import { User } from "../models/usersModel";
import { Types } from "mongoose";

type Feed = {
  caption: string;
};

export const createFeed = async (
  req: userRequest<{}, {}, Feed>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        status: "error",
        message: "No media file uploaded",
      });
      return;
    }
    const { caption } = req.body;

    const newFeeds = await Feed.create({
      user_id: req.user?._id,
      media: {
        mediaType: req.file.mimetype.startsWith("image") ? "image" : "video",
        url: `/uploads/${req.file.filename}`,
      },
      caption,
    });

    res.status(201).json({
      status: "success",
      message: "Feed uploaded",
      newFeeds,
    });
  } catch (error) {
    next(error);
  }
};

export const myfeeds = async (
  req: userRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const feeds = await Feed.find({ user_id: req.user?._id });

    if (feeds.length === 0) {
      res.status(200).json({
        status: "success",
        message: "no post yet",
        feeds,
      });
    }
    res.status(200).json({
      status: "succes",
      message: "list post",
      feeds,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteFeed = async (
  req: userRequest<{ feedId: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { feedId } = req.params;

    if (!Types.ObjectId.isValid(feedId)) {
      res.status(400);
      throw new Error("Invalid feed ID");
    }

    const findFeed = await Feed.findOneAndDelete({
      user_id: req.user?._id,
      _id: feedId,
    });

    if (!findFeed) {
      res.status(404);
      throw new Error("feed not found");
    }

    res.status(200).json({
      status: "success",
      message: "feed deleted successfuly",
      findFeed,
    });
  } catch (error) {
    next(error);
  }
};
