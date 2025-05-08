import { NextFunction, Response } from "express";
import { userRequest } from "../middleware/jwtHandler";
import { Comment } from "../models/commentModel";
import { Feed } from "../models/feedsModel";
import { Types } from "mongoose";

type CommentRequestBody = {
  comment: string;
  parent_id?: string;
};

type ParamsWithFeedId = {
  feedId: string;
};

type ParamsWithCommentId = {
  commentId: string;
};
export const addComment = async (
  req: userRequest<ParamsWithFeedId, {}, CommentRequestBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { feedId } = req.params;
    const { comment, parent_id } = req.body;

    if (!Types.ObjectId.isValid(feedId)) {
      res.status(400);
      throw new Error("Invalid feed ID");
    }

    const findFeed = await Feed.findById(feedId);

    if (!findFeed) {
      res.status(404);
      throw new Error("feed not found");
    }

    if (parent_id && !Types.ObjectId.isValid(parent_id)) {
      res.status(400);
      throw new Error("Invalid parent ID");
    }

    if (parent_id) {
      const parentComment = await Comment.findById(parent_id);

      if (!parentComment) {
        res.status(404);
        throw new Error("Parent comment not found");
      }
      if (parentComment.parent_id) {
        res.status(400);
        throw new Error("Replies cannot have replies");
      }
    }

    const newComment = await Comment.create({
      feed_id: feedId,
      user_id: req.user?._id,
      comment,
      parent_id: parent_id || null,
    });

    res.status(201).json({
      status: "success",
      message: "Comment added successfully",
      comment: newComment,
    });
  } catch (error) {
    next(error);
  }
};

export const showComment = async (
  req: userRequest<ParamsWithFeedId, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { feedId } = req.params;
    if (!Types.ObjectId.isValid(feedId)) {
      res.status(400);
      throw new Error("Invalid feed ID");
    }
    const findFeed = await Feed.findById(feedId);

    if (!findFeed) {
      res.status(404);
      throw new Error("feed not found");
    }
    const comments = await Comment.find({ feed_id: feedId, parent_id: null }) // Hanya komentar utama
      .populate("replies")
      .exec();

    if (!comments) {
      res.status(404);
      throw new Error("no comment yet");
    }

    res.status(200).json({
      status: "success",
      message: "list comment",
      comments,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (
  req: userRequest<ParamsWithCommentId, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { commentId } = req.params;
    if (!Types.ObjectId.isValid(commentId)) {
      res.status(400);
      throw new Error("Invalid feed ID");
    }
    const findComment = await Comment.findOneAndDelete({
      _id: commentId,
      user_id: req.user?._id,
    });

    if (!findComment) {
      res.status(404);
      throw new Error("comment not found");
    }

    res.status(200).json({
      status: "success",
      message: "comment deleted",
      findComment,
    });
  } catch (error) {
    next(error);
  }
};

export const editComment = async (
  req: userRequest<ParamsWithCommentId, {}, CommentRequestBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { commentId } = req.params;
    const { comment } = req.body;

    if (!Types.ObjectId.isValid(commentId)) {
      res.status(400);
      throw new Error("Invalid feed ID");
    }
    const updatedComment = await Comment.findOneAndUpdate(
      { _id: commentId, user_id: req.user?._id },
      { comment: comment.trim() },
      { new: true }
    );

    if (!updatedComment) {
      res.status(404);
      throw new Error("comment not found");
    }

    res.status(200).json({
      status: "success",
      message: "comment updated",
      newComment: comment,
    });
  } catch (error) {
    next(error);
  }
};
