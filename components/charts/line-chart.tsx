"use client";

import { useRef, useState } from "react";
import { NUMBER_FR } from "./scale";

export interface LineSeries {
  name: string;
  /** CSS custom property carrying the series color, e.g. "--viz-series-1". */
  colorVar: string;
  /** One value per label; null = no measurement that day. */
  points: (number | null)[];
}

const W = 640;
const H = 240;
const MARGIN = { top: 14, right: 96, bottom: 26, left: 52 };
const INNER_W = W - MARGIN.left - MARGIN.right;
const INNER_H = H - MARGIN.top - MARGIN.bottom;
const END_LABEL_MIN_GAP = 14;

interface Domain {
  min: number;
  max: number;
}

function computeDomain(series: LineSeries[], zeroBased: boolean): Domain {
  const values = series.flatMap((s) => s.points.filter((p) => p !== null));
  if (values.length === 0) return { min: 0, max: 1 };
  const rawMin = Math.min(...values);
  const rawMax = Math.max(...values);
  const pad = Math.max((rawMax - rawMin) * 0.1, 1);
  return {
    min: zeroBased ? 0 : Math.max(0, Math.floor(rawMin - pad)),
    max: Math.ceil(rawMax + pad),
  };
}

/**
 * Multi-series line chart: crosshair + all-series tooltip, legend for ≥2 series,
 * direct end labels (skipped when they would collide), table view.
 */
export function LineChart({
  labels,
  series,
  unit,
  ariaLabel,
  zeroBased = false,
  areaWash = false,
}: {
  labels: string[];
  series: LineSeries[];
  unit: string;
  ariaLabel: string;
  zeroBased?: boolean;
  areaWash?: boolean;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  const domain = computeDomain(series, zeroBased);
  const x = (i: number) =>
    MARGIN.left + (labels.length <= 1 ? INNER_W / 2 : (INNER_W * i) / (labels.length - 1));
  const y = (value: number) =>
    MARGIN.top + INNER_H * (1 - (value - domain.min) / (domain.max - domain.min || 1));
  const tickValues = [0, 0.25, 0.5, 0.75, 1].map(
    (f) => domain.min + f * (domain.max - domain.min),
  );

  function pathFor(points: (number | null)[]): string {
    let path = "";
    let penDown = false;
    points.forEach((value, i) => {
      if (value === null) {
        penDown = false;
        return;
      }
      path += `${penDown ? "L" : "M"} ${x(i).toFixed(1)} ${y(value).toFixed(1)} `;
      penDown = true;
    });
    return path.trim();
  }

  function lastIndex(points: (number | null)[]): number {
    for (let i = points.length - 1; i >= 0; i--) {
      if (points[i] !== null) return i;
    }
    return -1;
  }

  // Direct end labels only when they don't collide (else legend + tooltip carry identity).
  const endYs = series
    .map((s) => {
      const i = lastIndex(s.points);
      return i === -1 ? null : y(s.points[i] as number);
    })
    .filter((value): value is number => value !== null)
    .sort((a, b) => a - b);
  const endLabelsCollide = endYs.some(
    (value, i) => i > 0 && value - endYs[i - 1] < END_LABEL_MIN_GAP,
  );

  function handlePointerMove(event: React.PointerEvent<SVGSVGElement>) {
    const svg = svgRef.current;
    if (!svg || labels.length === 0) return;
    const rect = svg.getBoundingClientRect();
    const viewX = ((event.clientX - rect.left) / rect.width) * W;
    const step = labels.length <= 1 ? INNER_W : INNER_W / (labels.length - 1);
    const index = Math.round((viewX - MARGIN.left) / step);
    setHovered(Math.max(0, Math.min(labels.length - 1, index)));
  }

  return (
    <div className="viz-root relative">
      {series.length >= 2 && (
        <div className="mb-2 flex flex-wrap gap-4 text-xs text-zinc-600 dark:text-zinc-400">
          {series.map((s) => (
            <span key={s.name} className="inline-flex items-center gap-1.5">
              <svg width="16" height="4" aria-hidden>
                <line
                  x1={0}
                  x2={16}
                  y1={2}
                  y2={2}
                  stroke={`var(${s.colorVar})`}
                  strokeWidth={2}
                  strokeLinecap="round"
                />
              </svg>
              {s.name}
            </span>
          ))}
        </div>
      )}

      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={ariaLabel}
        className="w-full"
        onPointerMove={handlePointerMove}
        onPointerLeave={() => setHovered(null)}
      >
        {tickValues.map((tick) => (
          <g key={tick}>
            <line
              x1={MARGIN.left}
              x2={W - MARGIN.right}
              y1={y(tick)}
              y2={y(tick)}
              stroke={tick === tickValues[0] ? "var(--viz-axis)" : "var(--viz-grid)"}
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
              {NUMBER_FR.format(Math.round(tick * 10) / 10)}
            </text>
          </g>
        ))}

        {labels.map((label, i) =>
          labels.length <= 12 || i % Math.ceil(labels.length / 8) === 0 ? (
            <text
              key={`${label}-${i}`}
              x={x(i)}
              y={H - 8}
              textAnchor="middle"
              fontSize={10}
              fill="var(--viz-text-muted)"
            >
              {label}
            </text>
          ) : null,
        )}

        {hovered !== null && (
          <line
            x1={x(hovered)}
            x2={x(hovered)}
            y1={MARGIN.top}
            y2={MARGIN.top + INNER_H}
            stroke="var(--viz-axis)"
            strokeWidth={1}
          />
        )}

        {series.map((s) => {
          const end = lastIndex(s.points);
          return (
            <g key={s.name}>
              {areaWash && series.length === 1 && end !== -1 && (
                <path
                  d={`${pathFor(s.points)} L ${x(end).toFixed(1)} ${MARGIN.top + INNER_H} L ${x(
                    s.points.findIndex((p) => p !== null),
                  ).toFixed(1)} ${MARGIN.top + INNER_H} Z`}
                  fill={`var(${s.colorVar})`}
                  opacity={0.1}
                />
              )}
              <path
                d={pathFor(s.points)}
                fill="none"
                stroke={`var(${s.colorVar})`}
                strokeWidth={2}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              {end !== -1 && (
                <circle
                  cx={x(end)}
                  cy={y(s.points[end] as number)}
                  r={4.5}
                  fill={`var(${s.colorVar})`}
                  stroke="var(--viz-surface)"
                  strokeWidth={2}
                />
              )}
              {end !== -1 && !endLabelsCollide && (
                <text
                  x={x(end) + 9}
                  y={y(s.points[end] as number) + 3.5}
                  fontSize={11}
                  fontWeight={600}
                  fill="var(--viz-text-secondary)"
                >
                  {NUMBER_FR.format(s.points[end] as number)}
                  {series.length > 1 ? ` · ${s.name}` : ` ${unit}`}
                </text>
              )}
              {hovered !== null && s.points[hovered] !== null && (
                <circle
                  cx={x(hovered)}
                  cy={y(s.points[hovered] as number)}
                  r={4.5}
                  fill={`var(${s.colorVar})`}
                  stroke="var(--viz-surface)"
                  strokeWidth={2}
                />
              )}
            </g>
          );
        })}
      </svg>

      {hovered !== null && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs shadow-sm dark:border-zinc-700 dark:bg-zinc-900"
          style={{ left: `${(x(hovered) / W) * 100}%`, top: 0 }}
        >
          <div className="text-zinc-500 dark:text-zinc-400">{labels[hovered]}</div>
          {series.map((s) =>
            s.points[hovered] !== null ? (
              <div key={s.name} className="mt-0.5 flex items-center gap-1.5">
                <svg width="12" height="4" aria-hidden>
                  <line
                    x1={0}
                    x2={12}
                    y1={2}
                    y2={2}
                    stroke={`var(${s.colorVar})`}
                    strokeWidth={2}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="font-semibold">
                  {NUMBER_FR.format(s.points[hovered] as number)} {unit}
                </span>
                {series.length > 1 && (
                  <span className="text-zinc-500 dark:text-zinc-400">{s.name}</span>
                )}
              </div>
            ) : null,
          )}
        </div>
      )}

      <details className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
        <summary className="cursor-pointer">Voir les données</summary>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="py-1 pr-4 font-medium">Date</th>
                {series.map((s) => (
                  <th key={s.name} className="py-1 pr-4 font-medium">
                    {s.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody style={{ fontVariantNumeric: "tabular-nums" }}>
              {labels.map((label, i) => (
                <tr
                  key={`${label}-${i}`}
                  className="border-t border-zinc-200 dark:border-zinc-800"
                >
                  <td className="py-1 pr-4">{label}</td>
                  {series.map((s) => (
                    <td key={s.name} className="py-1 pr-4">
                      {s.points[i] !== null
                        ? `${NUMBER_FR.format(s.points[i] as number)} ${unit}`
                        : "—"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
