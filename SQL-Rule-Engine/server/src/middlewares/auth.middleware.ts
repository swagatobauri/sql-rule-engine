import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/app-error.utils.ts";

export const authMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError("Unauthorized", 401);
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    throw new AppError("Unauthorized", 401);
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as unknown;
    (req as any).user = payload;
    next();
  } catch {
    throw new AppError("Unauthorized", 401);
  }
};
