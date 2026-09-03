-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('EMPLOYEE', 'DIRECTOR', 'ACCOUNTS');

-- CreateEnum
CREATE TYPE "public"."VoucherStatus" AS ENUM ('DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL,
    "employeeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Voucher" (
    "id" TEXT NOT NULL,
    "voucherNumber" TEXT NOT NULL,
    "voucherDate" TIMESTAMP(3) NOT NULL,
    "expenseDate" TIMESTAMP(3) NOT NULL,
    "department" TEXT NOT NULL,
    "expenseTitle" TEXT NOT NULL,
    "expenseCategory" TEXT NOT NULL,
    "expenseDescription" TEXT,
    "amount" DECIMAL(12,2) NOT NULL,
    "status" "public"."VoucherStatus" NOT NULL DEFAULT 'DRAFT',
    "employeeId" TEXT NOT NULL,
    "employeeSignaturePath" TEXT,
    "directorId" TEXT,
    "directorSignaturePath" TEXT,
    "approvalDate" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "submittedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Voucher_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_employeeId_key" ON "public"."User"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "Voucher_voucherNumber_key" ON "public"."Voucher"("voucherNumber");

-- CreateIndex
CREATE INDEX "Voucher_employeeId_idx" ON "public"."Voucher"("employeeId");

-- CreateIndex
CREATE INDEX "Voucher_directorId_idx" ON "public"."Voucher"("directorId");

-- CreateIndex
CREATE INDEX "Voucher_status_idx" ON "public"."Voucher"("status");

-- CreateIndex
CREATE INDEX "Voucher_department_idx" ON "public"."Voucher"("department");

-- CreateIndex
CREATE INDEX "Voucher_expenseCategory_idx" ON "public"."Voucher"("expenseCategory");

-- CreateIndex
CREATE INDEX "Voucher_expenseDate_idx" ON "public"."Voucher"("expenseDate");

-- CreateIndex
CREATE INDEX "Voucher_createdAt_idx" ON "public"."Voucher"("createdAt");

-- AddForeignKey
ALTER TABLE "public"."Voucher" ADD CONSTRAINT "Voucher_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Voucher" ADD CONSTRAINT "Voucher_directorId_fkey" FOREIGN KEY ("directorId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
