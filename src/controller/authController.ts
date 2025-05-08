import bcrypt from "bcryptjs";
import { User } from "../models/usersModel";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { Otp } from "../models/otpModel";
import { DateTime } from "luxon";
import { sendOtp } from "../middleware/nodeMailer";
import { userRequest } from "../middleware/jwtHandler";

type Register = {
  username: string;
  email: string;
  password: string;
};

type Login = {
  email: string;
  password: string;
};

type ResetPassword = {
  otp: string;
  newPassword: string;
  email: string;
};

type RequestOtp = {
  email: string;
};

export const register = async (
  req: Request<{}, {}, Register>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, email, password } = req.body;

    const findEmail = await User.findOne({ email });
    if (findEmail) {
      res.status(400);
      throw new Error("email already registered");
    }

    const hashPassword: string = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashPassword,
    });

    res.status(201).json({
      status: "success",
      message: "registered successfuly",
      user: {
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request<{}, {}, Login>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const findUser = await User.findOne({ email });
    if (!findUser) {
      res.status(401);
      throw new Error("username or password invalid");
    }
    const matchPassword: boolean = await bcrypt.compare(
      password,
      findUser.password
    );
    if (!matchPassword) {
      res.status(401);
      throw new Error("username or password invalid");
    }

    const accessToken = jwt.sign(
      {
        _id: findUser._id,
      },
      process.env.JWT_SECRET!,

      { expiresIn: "1d" }
    );

    const refreshToken = jwt.sign(
      {
        _id: findUser._id,
      },
      process.env.JWT_SECRET!,

      { expiresIn: "7d" }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET environment variable is required");
    }

    res.status(200).json({
      status: "success",
      message: "Login successful",
      data: {
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = (req: userRequest, res: Response, next: NextFunction) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "strict",
  });

  res.status(200).json({ message: "Logged out successfully" });
};

export const requestOtp = async (
  req: Request<{}, {}, RequestOtp>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;

    const findEmail = await User.findOne({ email: email });

    if (!findEmail) {
      res.status(404);
      throw new Error("email not found");
    }

    await Otp.deleteMany({ email });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpired = DateTime.utc().plus({ minutes: 5 }).toJSDate();

    const otpHash = await bcrypt.hash(otp, 10);
    await Otp.create({ email, otp: otpHash, expiresAt: otpExpired });

    await sendOtp(email, otp);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (
  req: Request<{}, {}, ResetPassword>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { otp, newPassword, email } = req.body;

    const otpRecord = await Otp.findOne({ email });

    if (!otpRecord) {
      res.status(400);
      throw new Error("Invalid or expired OTP");
    }

    const isValidOtp = await bcrypt.compare(otp, otpRecord.otp);
    if (!isValidOtp) {
      res.status(400);
      throw new Error("Invalid or expired OTP");
    }

    if (otpRecord.expiresAt < new Date()) {
      res.status(400);
      throw new Error("OTP expired");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findOneAndUpdate({ email }, { password: hashedPassword });
    await Otp.deleteMany({ email });

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    next(error);
  }
};
