import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { prisma } from "../config/prisma";
import { authenticate, authorizeRole } from "../middleware/auth";
import { Role, VoucherStatus } from "@prisma/client";
import { voucherSchema, rejectSchema } from "../validators/voucher";
import { nextVoucherNumber } from "../utils/voucher";

const router = Router();
router.use(authenticate);

const uploadDir = path.resolve(process.env.UPLOAD_DIR || "uploads");
fs.mkdirSync(uploadDir, { recursive: true });
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${path.extname(file.originalname).toLowerCase()}`)
});
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => cb(null, ["image/jpeg", "image/png"].includes(file.mimetype))
});

router.get("/", async (req, res, next) => {
  try {
    const u = req.user;
    const where: any = u.role === Role.EMPLOYEE ? { employeeId: u.id } : {};
    const q = String(req.query.search || "");
    if (q) where.OR = [
      { voucherNumber: { contains: q, mode: "insensitive" } },
      { department: { contains: q, mode: "insensitive" } },
      { expenseTitle: { contains: q, mode: "insensitive" } },
      { employee: { name: { contains: q, mode: "insensitive" } } }
    ];
    if (req.query.status) where.status = req.query.status;
    if (req.query.department) where.department = req.query.department;
    if (req.query.category) where.expenseCategory = req.query.category;
    if (req.query.minAmount || req.query.maxAmount) where.amount = {
      ...(req.query.minAmount ? { gte: Number(req.query.minAmount) } : {}),
      ...(req.query.maxAmount ? { lte: Number(req.query.maxAmount) } : {})
    };
    const page = Math.max(Number(req.query.page || 1), 1), limit = Math.min(Number(req.query.limit || 20), 100);
    const allowedSort = ["voucherNumber","voucherDate","expenseDate","amount","createdAt","status"];
    const sortBy = allowedSort.includes(String(req.query.sortBy)) ? String(req.query.sortBy) : "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? "asc" : "desc";
    const [items, total] = await prisma.$transaction([
      prisma.voucher.findMany({ where, include: { employee: true, director: true }, orderBy: { [sortBy]: sortOrder }, skip: (page-1)*limit, take: limit }),
      prisma.voucher.count({ where })
    ]);
    res.json({ success: true, data: items, pagination: { page, limit, total, pages: Math.ceil(total/limit) } });
  } catch(e) { next(e); }
});

router.get("/pending", authorizeRole(Role.DIRECTOR), async (_req, res, next) => {
  try {
    const data = await prisma.voucher.findMany({ where: { status: VoucherStatus.PENDING_APPROVAL }, include: { employee: true }, orderBy: { submittedAt: "asc" } });
    res.json({ success: true, data });
  } catch(e) { next(e); }
});

router.get("/dashboard", async (req, res, next) => {
  try {
    const where: any = req.user.role === Role.EMPLOYEE ? { employeeId: req.user.id } : {};
    const [total, draft, pending, approved, rejected, amount] = await Promise.all([
      prisma.voucher.count({ where }), prisma.voucher.count({ where: {...where, status: "DRAFT"} }),
      prisma.voucher.count({ where: {...where, status: "PENDING_APPROVAL"} }),
      prisma.voucher.count({ where: {...where, status: "APPROVED"} }),
      prisma.voucher.count({ where: {...where, status: "REJECTED"} }),
      prisma.voucher.aggregate({ where, _sum: { amount: true } })
    ]);
    res.json({ success: true, data: { total, draft, pending, approved, rejected, amount: amount._sum.amount || 0 } });
  } catch(e) { next(e); }
});

router.get("/:id", async (req, res, next) => {
  try {
    const v = await prisma.voucher.findUnique({ where: { id: req.params.id }, include: { employee: true, director: true } });
    if (!v) return res.status(404).json({ success: false, message: "Voucher not found" });
    if (req.user.role === Role.EMPLOYEE && v.employeeId !== req.user.id) return res.status(403).json({ success: false, message: "Forbidden" });
    res.json({ success: true, data: v });
  } catch(e) { next(e); }
});

router.post("/", authorizeRole(Role.EMPLOYEE), async (req, res, next) => {
  try {
    const data = voucherSchema.partial().parse(req.body);
    const v = await prisma.voucher.create({
      data: { voucherNumber: await nextVoucherNumber(), voucherDate: data.voucherDate || new Date(), expenseDate: data.expenseDate || new Date(),
        department: data.department || "", expenseTitle: data.expenseTitle || "", expenseCategory: data.expenseCategory || "",
        expenseDescription: data.expenseDescription, amount: data.amount || 0, employeeId: req.user.id }
    });
    res.status(201).json({ success: true, data: v });
  } catch(e) { next(e); }
});

router.put("/:id", authorizeRole(Role.EMPLOYEE), async (req, res, next) => {
  try {
    const v = await prisma.voucher.findUnique({ where: { id: req.params.id } });
    if (!v) return res.status(404).json({ success: false, message: "Voucher not found" });
    if (v.employeeId !== req.user.id) return res.status(403).json({ success: false, message: "Forbidden" });
    if (v.status !== VoucherStatus.DRAFT) return res.status(409).json({ success: false, message: "Voucher cannot be modified after submission" });
    const data = voucherSchema.partial().parse(req.body);
    const updated = await prisma.voucher.update({ where: { id: v.id }, data: { ...data, amount: data.amount ?? undefined } });
    res.json({ success: true, data: updated });
  } catch(e) { next(e); }
});

router.delete("/:id", authorizeRole(Role.EMPLOYEE), async (req, res, next) => {
  try {
    const v = await prisma.voucher.findUnique({ where: { id: req.params.id } });
    if (!v) return res.status(404).json({ success: false, message: "Voucher not found" });
    if (v.employeeId !== req.user.id || v.status !== VoucherStatus.DRAFT) return res.status(409).json({ success: false, message: "Only your draft vouchers can be deleted" });
    await prisma.voucher.delete({ where: { id: v.id } });
    res.json({ success: true, message: "Voucher deleted" });
  } catch(e) { next(e); }
});

router.post("/:id/submit", authorizeRole(Role.EMPLOYEE), upload.single("signature"), async (req, res, next) => {
  try {
    const v = await prisma.voucher.findUnique({ where: { id: req.params.id } });
    if (!v) return res.status(404).json({ success: false, message: "Voucher not found" });
    if (v.employeeId !== req.user.id) return res.status(403).json({ success: false, message: "Forbidden" });
    if (v.status !== VoucherStatus.DRAFT) return res.status(409).json({ success: false, message: "Invalid voucher state" });
    voucherSchema.parse({ ...v, amount: Number(v.amount) });
    if (!req.file && !v.employeeSignaturePath) return res.status(422).json({ success: false, message: "Employee signature is required" });
    const updated = await prisma.voucher.update({ where: { id: v.id }, data: { status: VoucherStatus.PENDING_APPROVAL, submittedAt: new Date(), employeeSignaturePath: req.file?.filename || v.employeeSignaturePath } });
    res.json({ success: true, data: updated });
  } catch(e) { next(e); }
});

router.post("/:id/approve", authorizeRole(Role.DIRECTOR), upload.single("signature"), async (req, res, next) => {
  try {
    const v = await prisma.voucher.findUnique({ where: { id: req.params.id } });
    if (!v) return res.status(404).json({ success: false, message: "Voucher not found" });
    if (v.status !== VoucherStatus.PENDING_APPROVAL) return res.status(409).json({ success: false, message: "Voucher is not pending approval" });
    if (!req.file) return res.status(422).json({ success: false, message: "Director signature is required" });
    const updated = await prisma.voucher.update({ where: { id: v.id }, data: { status: VoucherStatus.APPROVED, directorId: req.user.id, directorSignaturePath: req.file.filename, approvalDate: new Date() } });
    res.json({ success: true, data: updated });
  } catch(e) { next(e); }
});

router.post("/:id/reject", authorizeRole(Role.DIRECTOR), async (req, res, next) => {
  try {
    const { reason } = rejectSchema.parse(req.body);
    const v = await prisma.voucher.findUnique({ where: { id: req.params.id } });
    if (!v) return res.status(404).json({ success: false, message: "Voucher not found" });
    if (v.status !== VoucherStatus.PENDING_APPROVAL) return res.status(409).json({ success: false, message: "Voucher is not pending approval" });
    const updated = await prisma.voucher.update({ where: { id: v.id }, data: { status: VoucherStatus.REJECTED, directorId: req.user.id, rejectionReason: reason } });
    res.json({ success: true, data: updated });
  } catch(e) { next(e); }
});

export default router;