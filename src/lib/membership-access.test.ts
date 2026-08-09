import { describe, expect, it } from "vitest";
import { getMembershipViewState } from "./membership-access";

describe("membership view state", () => {
  it.each([
    [null, null, "REGISTER"],
    [{ emailVerifiedAt: null }, null, "VERIFY_EMAIL"],
    [{ emailVerifiedAt: new Date() }, null, "APPLICATION"],
    [{ emailVerifiedAt: new Date() }, { status: "PENDING_REVIEW" }, "PENDING"],
    [{ emailVerifiedAt: new Date() }, { status: "REJECTED" }, "REJECTED"],
    [{ emailVerifiedAt: new Date() }, { status: "APPROVED_WAITING_PAYMENT" }, "APPROVED"],
    [{ emailVerifiedAt: new Date() }, { status: "COMPLETED" }, "APPROVED"],
  ] as const)("maps account and application state", (user, request, expected) => {
    expect(getMembershipViewState(user, request)).toBe(expected);
  });
});
