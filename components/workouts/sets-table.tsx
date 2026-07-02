export interface SetRow {
  id: string;
  exerciseName: string;
  reps: number;
  weightKg: number | null;
}

/** Shared sets table for workout and program detail pages. */
export function SetsTable({
  sets,
  deleteAction,
  emptyMessage,
}: {
  sets: SetRow[];
  deleteAction: (setId: string) => Promise<void>;
  emptyMessage: string;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
      <table className="w-full text-sm">
        <thead className="bg-zinc-50 text-left text-xs uppercase tracking-wide text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
          <tr>
            <th className="px-4 py-2">#</th>
            <th className="px-4 py-2">Exercice</th>
            <th className="px-4 py-2">Réps</th>
            <th className="px-4 py-2">Charge</th>
            <th className="px-4 py-2" />
          </tr>
        </thead>
        <tbody>
          {sets.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="px-4 py-8 text-center text-zinc-500 dark:text-zinc-400"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            sets.map((set, index) => (
              <tr
                key={set.id}
                className="border-t border-zinc-200 dark:border-zinc-800"
              >
                <td className="px-4 py-2 text-zinc-500 dark:text-zinc-400">
                  {index + 1}
                </td>
                <td className="px-4 py-2 font-medium">{set.exerciseName}</td>
                <td className="px-4 py-2">{set.reps}</td>
                <td className="px-4 py-2">
                  {set.weightKg !== null ? `${set.weightKg} kg` : "Poids du corps"}
                </td>
                <td className="px-4 py-2 text-right">
                  <form action={deleteAction.bind(null, set.id)}>
                    <button
                      type="submit"
                      className="text-xs text-red-500 hover:underline"
                      aria-label={`Supprimer la série ${index + 1}`}
                    >
                      Supprimer
                    </button>
                  </form>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
