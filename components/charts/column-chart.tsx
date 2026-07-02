"use client";

import { useState } from "react";
import { NUMBER_FR, niceCeil } from "./scale";

export interface ColumnDatum {
  label: string;
  value: number;
}

const W = 640;
const H = 240;
const MARGIN = { top: 14, right: 8, bottom: 26, left: 52 };
const INNER_W = W - MARGIN.left - MARGIN.right;
const INNER_H = H - MARGIN.top - MARGIN.bottom;

function barPath(x: number, yTop: number, width: number, height: number): string {
  const r = Math.min(4, height, width / 2);
  const bottom = yTop + height;
  return [
    `M ${x} ${bottom}`,
    `L ${x} ${yTop + r}`,
    `Q ${x} ${yTop} ${x + r} ${yTop}`,
    `L ${x + width - r} ${yTop}`,
    `Q ${x + width} ${yTop} ${x + width} ${yTop + r}`,
    `L ${x + width} ${bottom}`,
    "Z",
  ].join(" ");
}

/** Single-series column chart: per-bar hover tooltip, selective max label, table view. */
export function ColumnChart({
  data,
  unit,
  ariaLabel,
}: {
  data: ColumnDatum[];
  unit: string;
  ariaLabel: string;
}) {
  const [hovered, setHovered] = useState<number | null>(null);

  const max = niceCeil(Math.max(...data.map((d) => d.value), 1));
  const band = INNER_W / data.length;
  const barWidth = Math.min(24, band * 0.6);
  const y = (value: number) => MARGIN.top + INNER_H * (1 - value / max);
  const tickValues = [0, 0.25, 0.5, 0.75, 1].map((f) => f * max);
  const maxIndex = data.reduce(
    (best, d, i) => (d.value > data[best].value ? i : best),
    0,
  );

  return (
    <div className="viz-root relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={ariaLabel}
        className="w-full"
      >
        {tickValues.map((tick) => (
          <g key={tick}>
            <line
              x1={MARGIN.left}
              x2={W - MARGIN.right}
              y1={y(tick)}
              y2={y(tick)}
              stroke={tick === 0 ? "var(--viz-axis)" : "var(--viz-grid)"}
              strokeWidth={1}
            />
            <text
              x={MARGIN.left - 6}
              y={y(tick) + 3.5}
              textAnchor="end"
              fontSize={10}
              fill="var(--viz-text-muted)"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {NUMBER_FR.format(tick)}
            </text>
          </g>
        ))}

        {data.map((datum, i) => {
          const x = MARGIN.left + band * i + (band - barWidth) / 2;
          const height = (datum.value / max) * INNER_H;
          return (
            <g key={datum.label}>
              <path
                d={barPath(x, y(datum.value), barWidth, height)}
                fill="var(--viz-series-1)"
                opacity={hovered === i ? 0.8 : 1}
              />
              {i === maxIndex && datum.value > 0 && (
                <text
                  x={x + barWidth / 2}
                  y={y(datum.value) - 5}
                  textAnchor="middle"
                  fontSize={11}
                  fontWeight={600}
                  fill="var(--viz-text-secondary)"
                >
                  {NUMBER_FR.format(datum.value)}
                </text>
              )}
              <text
                x={MARGIN.left + band * (i + 0.5)}
                y={H - 8}
                textAnchor="middle"
                fontSize={10}
                fill="var(--viz-text-muted)"
              >
                {datum.label}
              </text>
              {/* Hit target: the full band, not just the painted bar. */}
              <rect
                x={MARGIN.left + band * i}
                y={MARGIN.top}
                width={band}
                height={INNER_H}
                fill="transparent"
                onPointerEnter={() => setHovered(i)}
                onPointerLeave={() => setHovered(null)}
              />
            </g>
          );
        })}
      </svg>

      {hovered !== null && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs shadow-sm dark:border-zinc-700 dark:bg-zinc-900"
          style={{
            left: `${((MARGIN.left + band * (hovered + 0.5)) / W) * 100}%`,
            top: 0,
          }}
        >
          <span className="font-semibold">
            {NUMBER_FR.format(data[hovered].value)} {unit}
          </span>{" "}
          <span className="text-zinc-500 dark:text-zinc-400">
            · {data[hovered].label}
          </span>
        </div>
      )}

      <details className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
        <summary className="cursor-pointer">Voir les données</summary>
        <table className="mt-2 w-full text-left">
          <thead>
            <tr>
              <th className="py-1 pr-4 font-medium">Semaine</th>
              <th className="py-1 font-medium">{unit}</th>
            </tr>
          </thead>
          <tbody style={{ fontVariantNumeric: "tabular-nums" }}>
            {data.map((datum) => (
              <tr key={datum.label} className="border-t border-zinc-200 dark:border-zinc-800">
                <td className="py-1 pr-4">{datum.label}</td>
                <td className="py-1">{NUMBER_FR.format(datum.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}
