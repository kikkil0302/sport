// Icônes SVG maison par groupe musculaire — aucun asset externe.
// Figures « bâton » à traits ronds, servies dans un badge coloré doux.

interface GlyphProps {
  className?: string;
}

function Svg({ children, className }: GlyphProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

/** Haltère — icône générique. */
export function DumbbellGlyph({ className }: GlyphProps) {
  return (
    <Svg className={className}>
      <path d="M7 8.5v7M4.5 10v4M17 8.5v7M19.5 10v4M7 12h10" />
    </Svg>
  );
}

/** Squat, barre sur les épaules. */
function LegsGlyph({ className }: GlyphProps) {
  return (
    <Svg className={className}>
      <circle cx="12" cy="4.6" r="1.7" />
      <path d="M5 8.6h14M12 8.6v4.6M12 13.2l-3.4 3 .3 3.6M12 13.2l3.4 3-.3 3.6" />
    </Svg>
  );
}

/** Traction à la barre fixe. */
function BackGlyph({ className }: GlyphProps) {
  return (
    <Svg className={className}>
      <path d="M4 4.5h16" />
      <circle cx="12" cy="8.6" r="1.7" />
      <path d="M10.6 10.6 8.5 4.5M13.4 10.6l2.1-6.1M12 10.3v4.6M12 14.9l-1.7 4.2M12 14.9l1.7 4.2" />
    </Svg>
  );
}

/** Développé couché sur banc. */
function ChestGlyph({ className }: GlyphProps) {
  return (
    <Svg className={className}>
      <path d="M6 6.8h12M5 5.2v3.2M19 5.2v3.2" />
      <path d="M9.2 6.8v5M14.8 6.8v5M6.5 13.6h11" />
      <circle cx="4.4" cy="13.6" r="1.5" />
      <path d="M3 17.4h18" />
    </Svg>
  );
}

/** Développé militaire, barre au-dessus de la tête. */
function ShouldersGlyph({ className }: GlyphProps) {
  return (
    <Svg className={className}>
      <path d="M6 4.6h12" />
      <circle cx="12" cy="9.4" r="1.7" />
      <path d="M9.8 12 7.6 4.6M14.2 12l2.2-7.4M12 11.1v5.4M12 16.5l-2 4M12 16.5l2 4" />
    </Svg>
  );
}

/** Bras fléchi (curl) — sert aux biceps comme aux triceps. */
function ArmGlyph({ className }: GlyphProps) {
  return (
    <Svg className={className}>
      <path d="M5.5 19.5v-5.2c0-3.6 2.2-6 5.2-6.6" />
      <path d="M8.6 13.4c2 .2 4.1-1 5.6-3.2l1.9-2.7" />
      <path d="M14.6 5.4l3 2.2M17.9 5.2l-1.6 4.6" />
    </Svg>
  );
}

/** Sangle abdominale stylisée. */
function AbsGlyph({ className }: GlyphProps) {
  return (
    <Svg className={className}>
      <path d="M8.5 4.5c-.6 5 .3 10 3.5 15 3.2-5 4.1-10 3.5-15" />
      <path d="M12 5v14M9 9.4h6M8.9 13.4h6.2" />
    </Svg>
  );
}

const GLYPHS: Record<string, (props: GlyphProps) => React.ReactNode> = {
  Jambes: LegsGlyph,
  Dos: BackGlyph,
  Pectoraux: ChestGlyph,
  Épaules: ShouldersGlyph,
  Biceps: ArmGlyph,
  Triceps: ArmGlyph,
  Abdominaux: AbsGlyph,
};

/** Couleurs douces par groupe (fond clair / encre soutenue, modes clair + sombre). */
const BADGE_COLORS: Record<string, string> = {
  Jambes: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
  Dos: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  Pectoraux: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
  Épaules: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  Biceps: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  Triceps: "bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300",
  Abdominaux: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
};

const DEFAULT_COLORS =
  "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300";

const SIZES = {
  sm: { badge: "h-8 w-8 rounded-lg", glyph: "h-5 w-5" },
  md: { badge: "h-10 w-10 rounded-xl", glyph: "h-6 w-6" },
  lg: { badge: "h-12 w-12 rounded-xl", glyph: "h-7 w-7" },
} as const;

/** Badge coloré avec l'icône du groupe musculaire (haltère si groupe inconnu). */
export function MuscleBadge({
  group,
  size = "md",
}: {
  group: string;
  size?: keyof typeof SIZES;
}) {
  const Glyph = GLYPHS[group] ?? DumbbellGlyph;
  const colors = BADGE_COLORS[group] ?? DEFAULT_COLORS;
  const { badge, glyph } = SIZES[size];
  return (
    <span
      className={`flex shrink-0 items-center justify-center ${badge} ${colors}`}
      title={group}
    >
      <Glyph className={glyph} />
    </span>
  );
}
