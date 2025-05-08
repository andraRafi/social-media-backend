import mongoose, { Schema, Document, Model } from "mongoose";

const commentSchema: Schema = new mongoose.Schema(
  {
    feed_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Feed",
      required: [true],
    },

    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true],
    },

    parent_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },

    comment: {
      type: String,
      required: [true],
    },
  },
  {
    timestamps: true,
  }
);

commentSchema.virtual("replies", {
  ref: "Comment",
  localField: "_id",
  foreignField: "parent_id",
});

commentSchema.set("toJSON", { virtuals: true });
commentSchema.set("toObject", { virtuals: true });
export const Comment = mongoose.model("Comment", commentSchema);
