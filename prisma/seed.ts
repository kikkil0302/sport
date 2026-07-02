import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../lib/generated/prisma/client";

const db = new PrismaClient({
  adapter: new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  }),
});

const BUILT_IN_EXERCISES: { name: string; muscleGroup: string }[] = [
  { name: "Squat", muscleGroup: "Jambes" },
  { name: "Presse à cuisses", muscleGroup: "Jambes" },
  { name: "Fentes", muscleGroup: "Jambes" },
  { name: "Leg curl", muscleGroup: "Jambes" },
  { name: "Mollets debout", muscleGroup: "Jambes" },
  { name: "Soulevé de terre", muscleGroup: "Dos" },
  { name: "Rowing barre", muscleGroup: "Dos" },
  { name: "Tractions", muscleGroup: "Dos" },
  { name: "Tirage vertical", muscleGroup: "Dos" },
  { name: "Développé couché", muscleGroup: "Pectoraux" },
  { name: "Développé incliné haltères", muscleGroup: "Pectoraux" },
  { name: "Pompes", muscleGroup: "Pectoraux" },
  { name: "Écarté couché", muscleGroup: "Pectoraux" },
  { name: "Développé militaire", muscleGroup: "Épaules" },
  { name: "Élévations latérales", muscleGroup: "Épaules" },
  { name: "Oiseau (élévations buste penché)", muscleGroup: "Épaules" },
  { name: "Curl biceps", muscleGroup: "Biceps" },
  { name: "Curl marteau", muscleGroup: "Biceps" },
  { name: "Dips", muscleGroup: "Triceps" },
  { name: "Extensions triceps poulie", muscleGroup: "Triceps" },
  { name: "Crunch", muscleGroup: "Abdominaux" },
  { name: "Relevés de jambes", muscleGroup: "Abdominaux" },
];

async function main() {
  for (const exercise of BUILT_IN_EXERCISES) {
    // upsert cannot target a compound unique containing NULL, so emulate it.
    const existing = await db.exercise.findFirst({
      where: { name: exercise.name, userId: null },
    });
    if (existing) {
      await db.exercise.update({
        where: { id: existing.id },
        data: { muscleGroup: exercise.muscleGroup },
      });
    } else {
      await db.exercise.create({ data: exercise });
    }
  }
  console.log(`Seeded ${BUILT_IN_EXERCISES.length} built-in exercises.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
