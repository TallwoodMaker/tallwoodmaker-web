"use client";

import { useEffect, useState } from "react";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getTimeLeft(targetMs: number): TimeLeft {
  const diff = Math.max(0, targetMs - Date.now());
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1_000),
  };
}

const UNITS: { key: keyof TimeLeft; label: string }[] = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hours" },
  { key: "minutes", label: "Minutes" },
  { key: "seconds", label: "Seconds" },
];

export default function CountdownTimer({ target }: { target: string }) {
  const targetMs = new Date(target).getTime();
  // Starts null so the server-rendered markup and the first client render
  // match; the real, ticking value is filled in after mount to avoid a
  // hydration mismatch against wall-clock time.
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const update = () => setTimeLeft(getTimeLeft(targetMs));
    const id = setInterval(update, 1000);
    // Fills in the real value right after mount instead of waiting out the
    // first full interval tick, without calling the setter synchronously
    // from the effect body itself.
    queueMicrotask(update);
    return () => clearInterval(id);
  }, [targetMs]);

  const display = timeLeft ?? { days: 0, hours: 0, minutes: 0, seconds: 0 };

  return (
    <div className="flex justify-center gap-3 sm:gap-5">
      {UNITS.map((unit) => (
        <div
          key={unit.key}
          className="w-[70px] rounded-md border border-border bg-cream px-2 py-4 text-center sm:w-[92px]"
        >
          <div className="text-[clamp(26px,5vw,40px)] font-extrabold leading-none tabular-nums">
            {String(display[unit.key]).padStart(2, "0")}
          </div>
          <div className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted">
            {unit.label}
          </div>
        </div>
      ))}
    </div>
  );
}
