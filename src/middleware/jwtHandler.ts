import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface userRequest<P = {}, ResBody = {}, ReqBody = {}>
  extends Request<P, ResBody, ReqBody> {
  user?: { _id: string };
}

export const validateToken = async (
  req: userRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401);
      throw new Error("Token not provided or invalid");
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      _id: string;
    };

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      status: "error",
      message: "Unauthorized",
    });
  }
};
