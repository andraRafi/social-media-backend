import { Request, Response, NextFunction } from "express";
import { Otp } from "../models/otpModel";
import { User } from "../models/usersModel";
import { DateTime } from "luxon";
import { sendOtp } from "../middleware/nodeMailer";

export const requestOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
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

    await Otp.create({ email, otp, expiresAt: otpExpired });

    await sendOtp(email, otp);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    next(error);
  }
};
