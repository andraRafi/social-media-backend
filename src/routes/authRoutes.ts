import express from "express";
import {
  login,
  register,
  resetPassword,
  requestOtp,
  logout,
} from "../controller/authController";
import { validate } from "../validation/validation";
import {
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  sendOtpSchema,
} from "../validation/authValidation";
import { refreshAccessToken } from "../middleware/refreshToken";

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);
router.get("/refresh-token", refreshAccessToken);
router.post("/request-otp", validate(sendOtpSchema), requestOtp);
router.delete("/logout", logout);
export default router;
