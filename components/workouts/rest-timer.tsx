"use client";

import { useEffect, useRef, useState } from "react";

const PRESETS = [60, 90, 120, 180] as const;

function beep() {
  try {
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.frequency.value = 880;
    gain.gain.setValueAtTime(0.2, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.6);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.6);
  } catch {
    // Audio indisponible (autoplay bloqué…) : le passage à 0 reste visible.
  }
}

/** Minuteur de repos entre les séries — 100 % client, aucun envoi serveur. */
export function RestTimer() {
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  function start(seconds: number) {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setSecondsLeft(seconds);
    intervalRef.current = setInterval(() => {
      setSecondsLeft((current) => {
        if (current === null || current <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          if (current !== null && current <= 1) beep();
          return current === null ? null : 0;
        }
        return current - 1;
      });
    }, 1000);
  }

  function stop() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setSecondsLeft(null);
  }

  const display =
    secondsLeft === null
      ? null
      : `${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, "0")}`;

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
      <span className="text-sm font-medium">Repos</span>
      {PRESETS.map((preset) => (
        <button
          key={preset}
          type="button"
          onClick={() => start(preset)}
          className="h-11 rounded-lg border border-zinc-300 px-3 text-sm transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
        >
          {preset < 120 ? `${preset} s` : `${preset / 60} min`}
        </button>
      ))}
      {display !== null && (
        <span
          className={`ml-auto flex items-center gap-2 text-lg font-bold tabular-nums ${
            secondsLeft === 0
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-zinc-900 dark:text-zinc-100"
          }`}
          aria-live="polite"
        >
          {secondsLeft === 0 ? "C'est reparti !" : display}
          <button
            type="button"
            onClick={stop}
            aria-label="Arrêter le minuteur"
            className="text-xs font-normal text-zinc-500 underline dark:text-zinc-400"
          >
            arrêter
          </button>
        </span>
      )}
    </div>
  );
}
