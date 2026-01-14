import type { Position } from "@prisma/client";
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction) => {
  //const token = req.cookies.access_token;
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; email?: string; role?: string; position?: Position };
    req.user.id = decoded.id;
    req.user.position = decoded.position;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}

export const authorizePositions = (...positions: Position[]) => (
  req: Request,
  res: Response,
  next: NextFunction) => {
  if (!req.user?.position || !positions.includes(req.user.position)) {
    return res.status(403).json({ message: "Forbidden/Unauthorized" });
  }
  next();
};
