import { describe, expect, it } from "vitest";
import { credentialsSchema, registerSchema } from "./schema";

describe("credentialsSchema", () => {
  it("trims and lowercases the e-mail before validating", () => {
    const parsed = credentialsSchema.parse({
      email: "  RIAD@Example.COM  ",
      password: "motdepasse",
    });
    expect(parsed.email).toBe("riad@example.com");
  });

  it("rejects an invalid e-mail", () => {
    expect(
      credentialsSchema.safeParse({ email: "pas-un-email", password: "motdepasse" })
        .success,
    ).toBe(false);
  });

  it("rejects a password shorter than 8 characters", () => {
    expect(
      credentialsSchema.safeParse({ email: "a@b.co", password: "court" }).success,
    ).toBe(false);
  });

  it("accepts an 8-character password (boundary)", () => {
    expect(
      credentialsSchema.safeParse({ email: "a@b.co", password: "12345678" })
        .success,
    ).toBe(true);
  });
});

describe("registerSchema", () => {
  it("accepts an optional display name", () => {
    const parsed = registerSchema.parse({
      email: "a@b.co",
      password: "motdepasse",
      displayName: "  Riad  ",
    });
    expect(parsed.displayName).toBe("Riad");
  });

  it("works without a display name", () => {
    expect(
      registerSchema.safeParse({ email: "a@b.co", password: "motdepasse" })
        .success,
    ).toBe(true);
  });

  it("rejects a display name longer than 50 characters", () => {
    expect(
      registerSchema.safeParse({
        email: "a@b.co",
        password: "motdepasse",
        displayName: "x".repeat(51),
      }).success,
    ).toBe(false);
  });
});
