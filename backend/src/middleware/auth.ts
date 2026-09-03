import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma";
import { Role } from "@prisma/client";

declare global { namespace Express { interface Request { user?: any } } }

export async function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) return res.status(401).json({ success: false, message: "Authentication required" });
    const token = header.slice(7);
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (!user) return res.status(401).json({ success: false, message: "Invalid token" });
    req.user = user;
    next();
  } catch { return res.status(401).json({ success: false, message: "Invalid or expired token" }); }
}

export const authorizeRole = (...roles: Role[]) => (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || !roles.includes(req.user.role)) return res.status(403).json({ success: false, message: "Forbidden" });
  next();
};