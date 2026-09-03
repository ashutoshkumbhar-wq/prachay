import { PrismaClient, Role, VoucherStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Password123!", 12);

  const employeeA = await prisma.user.upsert({
    where: { email: "employee1@abc.com" },
    update: { passwordHash },
    create: { name: "Aarav Employee", email: "employee1@abc.com", passwordHash, role: Role.EMPLOYEE, employeeId: "EMP001" }
  });
  const employeeB = await prisma.user.upsert({
    where: { email: "employee2@abc.com" },
    update: { passwordHash },
    create: { name: "Diya Employee", email: "employee2@abc.com", passwordHash, role: Role.EMPLOYEE, employeeId: "EMP002" }
  });
  const director = await prisma.user.upsert({
    where: { email: "director@abc.com" },
    update: { passwordHash },
    create: { name: "Raj Director", email: "director@abc.com", passwordHash, role: Role.DIRECTOR }
  });
  await prisma.user.upsert({
    where: { email: "accounts@abc.com" },
    update: { passwordHash },
    create: { name: "ABC Accounts", email: "accounts@abc.com", passwordHash, role: Role.ACCOUNTS }
  });

  const count = await prisma.voucher.count();
  if (count === 0) {
    await prisma.voucher.createMany({
      data: [
        {
          voucherNumber: "EXP-2026-000001", voucherDate: new Date("2026-09-01"),
          expenseDate: new Date("2026-08-29"), department: "IT", expenseTitle: "Office supplies",
          expenseCategory: "Office", expenseDescription: "Printer paper and stationery", amount: 1250,
          employeeId: employeeA.id, status: VoucherStatus.DRAFT
        },
        {
          voucherNumber: "EXP-2026-000002", voucherDate: new Date("2026-09-01"),
          expenseDate: new Date("2026-08-30"), department: "Sales", expenseTitle: "Client travel",
          expenseCategory: "Travel", expenseDescription: "Taxi and local travel", amount: 4200,
          employeeId: employeeA.id, status: VoucherStatus.PENDING_APPROVAL, submittedAt: new Date()
        },
        {
          voucherNumber: "EXP-2026-000003", voucherDate: new Date("2026-08-25"),
          expenseDate: new Date("2026-08-20"), department: "HR", expenseTitle: "Team lunch",
          expenseCategory: "Meals", expenseDescription: "Team event", amount: 5800,
          employeeId: employeeB.id, directorId: director.id, status: VoucherStatus.APPROVED,
          submittedAt: new Date("2026-08-21"), approvalDate: new Date("2026-08-22")
        },
        {
          voucherNumber: "EXP-2026-000004", voucherDate: new Date("2026-08-24"),
          expenseDate: new Date("2026-08-19"), department: "Finance", expenseTitle: "Courier",
          expenseCategory: "Other", expenseDescription: "Document courier", amount: 900,
          employeeId: employeeB.id, directorId: director.id, status: VoucherStatus.REJECTED,
          submittedAt: new Date("2026-08-20"), rejectionReason: "Missing supporting details", updatedAt: new Date()
        }
      ]
    });
  }
}

main().finally(() => prisma.$disconnect());