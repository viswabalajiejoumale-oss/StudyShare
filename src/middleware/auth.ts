import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../config";

export interface AuthRequest extends Request {
  userId?: string;
}

export const requireAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({ error: "Missing Authorization header" });
      return;
    }

    if (!authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "Invalid Authorization format" });
      return;
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    if (!decoded || typeof decoded.sub !== "string") {
      res.status(401).json({ error: "Invalid token payload" });
      return;
    }

    req.userId = decoded.sub;
    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized" });
  }
};
