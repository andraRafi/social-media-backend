import mongoose, { Schema, Document, Model } from "mongoose";

const storySchema: Schema = new mongoose.Schema(
  {
    feed_id: {
      type: String,
      ref: "Feed",
      required: [true],
    },

    user_id: {
      type: String,
      ref: "User",
      required: [true],
    },

    media: {
      type: {
        type: String,
        enum: ["image", "video"],
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);
export const Story = mongoose.model("Story", storySchema);
