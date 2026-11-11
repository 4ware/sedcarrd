import { describe, expect, test } from "bun:test";
import { senderAddress } from "./send-email";

describe("senderAddress", () => {
  test("sends from hello@ on the verified Resend domain", () => {
    expect(senderAddress("sedcarrd.com")).toBe("Sedcarrd <hello@sedcarrd.com>");
  });

  test("falls back to Resend's test sender without a domain", () => {
    expect(senderAddress("")).toBe("Sedcarrd <onboarding@resend.dev>");
  });
});
