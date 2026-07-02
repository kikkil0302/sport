import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";

/**
 * GDPR data portability (article 20): every piece of personal data we hold,
 * as a machine-readable JSON download. Password hashes and session tokens
 * are security material, not portable personal data, and are excluded.
 */
export async function GET(): Promise<Response> {
  const user = await getSessionUser();
  if (!user) {
    return Response.json({ error: "Non authentifié" }, { status: 401 });
  }

  const [workouts, bodyWeights, customExercises, programs] = await Promise.all([
    db.workout.findMany({
      where: { userId: user.id },
      orderBy: { performedAt: "asc" },
      include: {
        sets: {
          orderBy: { order: "asc" },
          include: { exercise: { select: { name: true, muscleGroup: true } } },
        },
      },
    }),
    db.bodyWeightEntry.findMany({
      where: { userId: user.id },
      orderBy: { measuredAt: "asc" },
    }),
    db.exercise.findMany({ where: { userId: user.id } }),
    db.program.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "asc" },
      include: {
        sets: {
          orderBy: { order: "asc" },
          include: { exercise: { select: { name: true } } },
        },
      },
    }),
  ]);

  const payload = {
    exportedAt: new Date().toISOString(),
    account: {
      email: user.email,
      displayName: user.displayName,
      createdAt: user.createdAt.toISOString(),
    },
    bodyWeights: bodyWeights.map((entry) => ({
      measuredAt: entry.measuredAt.toISOString(),
      weightKg: entry.weightKg,
    })),
    customExercises: customExercises.map((exercise) => ({
      name: exercise.name,
      muscleGroup: exercise.muscleGroup,
    })),
    programs: programs.map((program) => ({
      name: program.name,
      description: program.description,
      createdAt: program.createdAt.toISOString(),
      sets: program.sets.map((set) => ({
        exercise: set.exercise.name,
        reps: set.reps,
        weightKg: set.weightKg,
      })),
    })),
    workouts: workouts.map((workout) => ({
      performedAt: workout.performedAt.toISOString(),
      notes: workout.notes,
      sets: workout.sets.map((set) => ({
        exercise: set.exercise.name,
        muscleGroup: set.exercise.muscleGroup,
        reps: set.reps,
        weightKg: set.weightKg,
      })),
    })),
  };

  return new Response(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": 'attachment; filename="fitpilot-donnees.json"',
    },
  });
}
