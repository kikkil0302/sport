import { db } from "@/lib/db";

/** Exercise picker options: built-in catalog plus the user's own exercises. */
export function exerciseOptionsFor(userId: string) {
  return db.exercise.findMany({
    where: { OR: [{ userId: null }, { userId }] },
    orderBy: [{ muscleGroup: "asc" }, { name: "asc" }],
    select: { id: true, name: true, muscleGroup: true },
  });
}
