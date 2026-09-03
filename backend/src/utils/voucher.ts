import { prisma } from "../config/prisma";

export async function nextVoucherNumber() {
  const year = new Date().getFullYear();
  const latest = await prisma.voucher.findFirst({ where: { voucherNumber: { startsWith: `EXP-${year}-` } }, orderBy: { voucherNumber: "desc" } });
  const next = latest ? Number(latest.voucherNumber.slice(-6)) + 1 : 1;
  return `EXP-${year}-${String(next).padStart(6, "0")}`;
}