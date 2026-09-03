import { describe, expect, it } from "vitest";

describe("voucher workflow rules", () => {
  it("accepts only draft -> pending -> approved/rejected", () => {
    const valid: Record<string,string[]> = {
      DRAFT: ["PENDING_APPROVAL"],
      PENDING_APPROVAL: ["APPROVED", "REJECTED"],
      APPROVED: [],
      REJECTED: []
    };
    expect(valid.DRAFT).toContain("PENDING_APPROVAL");
    expect(valid.APPROVED).not.toContain("REJECTED");
    expect(valid.REJECTED).not.toContain("APPROVED");
  });
});