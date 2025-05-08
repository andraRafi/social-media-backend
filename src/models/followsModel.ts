import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFollow extends Document {
  following_user_id: mongoose.Schema.Types.ObjectId;
  followed_user_id: mongoose.Schema.Types.ObjectId;
}

const followSchema: Schema = new mongoose.Schema(
  {
    following_user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true],
    },

    followed_user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true],
    },
  },
  {
    timestamps: true,
  }
);
export const Follow: Model<IFollow> = mongoose.model<IFollow>(
  "Follow",
  followSchema
);
