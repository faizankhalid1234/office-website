import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { verifyToken, type AuthPayload } from "../lib/jwt.js";
import { User } from "../models/User.js";
import type { IUser } from "../models/User.js";
import type { Role } from "../lib/types.js";

export type AuthRequest = Request & { user?: AuthPayload };

function isValidObjectId(id: string): boolean {
  return mongoose.Types.ObjectId.isValid(id) && String(new mongoose.Types.ObjectId(id)) === id;
}

async function findActiveUser(payload: AuthPayload): Promise<IUser | null> {
  let user: IUser | null = null;

  if (isValidObjectId(payload.id)) {
    user = await User.findById(payload.id).select("email role isActive").lean<IUser | null>();
  }

  if (!user && payload.email) {
    user = await User.findOne({ email: payload.email.trim().toLowerCase() })
      .select("email role isActive")
      .lean<IUser | null>();
  }

  if (!user || !user.isActive) return null;
  return user;
}

export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const payload = verifyToken(token);
    const user = await findActiveUser(payload);

    if (!user) {
      res.status(401).json({ error: "Session expired. Please sign in again." });
      return;
    }

    req.user = {
      id: String(user._id),
      email: user.email,
      role: user.role as Role,
    };
    next();
  } catch {
    res.status(401).json({ error: "Invalid token. Please sign in again." });
  }
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== "ADMIN") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  next();
}
