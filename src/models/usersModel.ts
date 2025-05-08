import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  bio: string;
}

const userSchema: Schema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "please add username"],
    },

    email: {
      type: String,
      required: [true, "please add email"],
      unique: [true, "email already taken"],
    },

    password: {
      type: String,
      required: [true, "please add password"],
    },

    bio: {
      type: String,
      default: "not bio yet",
    },
  },
  {
    timestamps: true,
  }
);
export const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
