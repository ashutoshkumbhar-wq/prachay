import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma";
import { authenticate } from "../middleware/auth";

const router = Router();

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email: String(email || "").toLowerCase() } });
    if (!user || !(await bcrypt.compare(password || "", user.passwordHash)))
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: process.env.JWT_EXPIRES_IN || "1d" });
    res.json({ success: true, token, user: { id: user.id, name: user.name, email: user.email, role: user.role, employeeId: user.employeeId } });
  } catch (e) { next(e); }
});

router.get("/me", authenticate, async (req, res) => {
  const u = req.user;
  res.json({ success: true, user: { id: u.id, name: u.name, email: u.email, role: u.role, employeeId: u.employeeId } });
});

router.post("/logout", authenticate, (_req, res) => res.json({ success: true, message: "Logged out" }));
export default router;