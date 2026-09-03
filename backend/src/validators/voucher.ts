import { z } from "zod";
export const voucherSchema = z.object({
  voucherDate: z.coerce.date(),
  expenseDate: z.coerce.date(),
  department: z.string().min(1),
  expenseTitle: z.string().min(1),
  expenseCategory: z.string().min(1),
  expenseDescription: z.string().optional(),
  amount: z.coerce.number().positive()
});
export const rejectSchema = z.object({ reason: z.string().min(1, "Rejection reason is required") });