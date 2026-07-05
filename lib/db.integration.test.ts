import { afterAll, describe, expect, it } from "vitest";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "./generated/prisma/client";

// Exercises the real Prisma 7 driver-adapter chain against the migrated dev database.
const db = new PrismaClient({
  adapter: new PrismaBetterSqlite3({ url: "file:./prisma/dev.db" }),
});

const TEST_EMAIL = "integration-test@trakmetrik.local";

afterAll(async () => {
  await db.user.deleteMany({ where: { email: TEST_EMAIL } });
  await db.$disconnect();
});

describe("database integration", () => {
  it("creates, reads and deletes a user with a session", async () => {
    await db.user.deleteMany({ where: { email: TEST_EMAIL } });

    const user = await db.user.create({
      data: {
        email: TEST_EMAIL,
        passwordHash: "salt:hash",
        sessions: {
          create: {
            tokenHash: `test-token-${Date.now()}`,
            expiresAt: new Date(Date.now() + 60_000),
          },
        },
      },
      include: { sessions: true },
    });
    expect(user.sessions).toHaveLength(1);

    const found = await db.user.findUnique({ where: { email: TEST_EMAIL } });
    expect(found?.id).toBe(user.id);

    // onDelete: Cascade must remove the session with the user.
    await db.user.delete({ where: { id: user.id } });
    const orphanSessions = await db.session.findMany({
      where: { userId: user.id },
    });
    expect(orphanSessions).toHaveLength(0);
  });
});
