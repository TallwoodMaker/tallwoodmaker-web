import type React from "react";
import { PLATFORMS, PLATFORM_LABELS, type Platform } from "@/config/social";

// Validated categorical slots (dataviz palette, light surface): fixed
// order, one per platform, never cycled.
export const SERIES_COLORS: Record<Platform, string> = {
  instagram: "#2a78d6",
  tiktok: "#eb6834",
  youtube: "#1baf7a",
};
const BAR = "#2a78d6";
const GRID = "#e4dfd0";
const AXIS_TEXT = "#66635c";
const INK = "#141413";

const nf = new Intl.NumberFormat("en-GB");

function shortDate(day: string) {
  return new Date(`${day}T12:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}

/** Bar with 4px rounded top, square at the baseline. */
function barPath(x: number, y: number, w: number, h: number) {
  const r = Math.min(4, w / 2, h);
  return `M${x},${y + h}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h}Z`;
}

/**
 * Each chart is drawn twice: a narrow viewBox for phones and a wide one from
 * sm up, so the 11px labels stay about 11px instead of scaling with the SVG.
 */
function Responsive({ narrow, wide }: { narrow: React.ReactNode; wide: React.ReactNode }) {
  return (
    <>
      <div className="sm:hidden">{narrow}</div>
      <div className="hidden max-w-[900px] sm:block">{wide}</div>
    </>
  );
}

/** Single-series daily bars (e.g. signups or visits per day, 30 days). */
export function DailyBars(props: { data: [string, number][]; unit: string }) {
  return (
    <Responsive
      narrow={<DailyBarsSvg {...props} W={360} />}
      wide={<DailyBarsSvg {...props} W={720} />}
    />
  );
}

function DailyBarsSvg({
  data,
  unit,
  W,
}: {
  data: [string, number][];
  unit: string;
  W: number;
}) {
  const H = 180;
  const left = 30;
  const bottom = 22;
  const top = 12;
  const plotW = W - left;
  const plotH = H - top - bottom;
  const max = Math.max(1, ...data.map(([, v]) => v));
  const slot = plotW / data.length;
  const total = data.reduce((n, [, v]) => n + v, 0);
  const labelIdx = [0, Math.floor(data.length / 2), data.length - 1];

  return (
    <figure className="flex flex-col gap-2">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label={`${nf.format(total)} ${unit} in the last ${data.length} days`}
      >
        <line x1={left} x2={W} y1={top} y2={top} stroke={GRID} strokeDasharray="3 3" />
        <line x1={left} x2={W} y1={top + plotH} y2={top + plotH} stroke={GRID} />
        <text x={left - 6} y={top + 4} textAnchor="end" fontSize="11" fill={AXIS_TEXT}>
          {nf.format(max)}
        </text>
        <text x={left - 6} y={top + plotH + 4} textAnchor="end" fontSize="11" fill={AXIS_TEXT}>
          0
        </text>
        {data.map(([day, value], i) => {
          const h = (value / max) * plotH;
          const x = left + i * slot + 1;
          return (
            <g key={day} className="group">
              {value > 0 && (
                <path
                  d={barPath(x, top + plotH - h, slot - 2, h)}
                  fill={BAR}
                  className="group-hover:opacity-75"
                />
              )}
              {/* Hit target: the whole column, bigger than the bar. */}
              <rect x={left + i * slot} y={top} width={slot} height={plotH} fill="transparent">
                <title>{`${shortDate(day)}: ${nf.format(value)} ${unit}`}</title>
              </rect>
            </g>
          );
        })}
        {labelIdx.map((i) => (
          <text
            key={i}
            x={left + i * slot + slot / 2}
            y={H - 6}
            textAnchor={i === 0 ? "start" : i === data.length - 1 ? "end" : "middle"}
            fontSize="11"
            fill={AXIS_TEXT}
          >
            {shortDate(data[i][0])}
          </text>
        ))}
      </svg>
      {total === 0 && (
        <figcaption className="text-[13px] text-ink-muted">No data yet.</figcaption>
      )}
    </figure>
  );
}

type FollowerRow = { week_start: string; platform: Platform; followers: number | null };

/** Followers per platform per week: one line per platform. */
export function FollowersChart({ rows }: { rows: FollowerRow[] }) {
  if (!rows.some((r) => r.followers !== null)) {
    return <p className="text-[14px] text-ink-muted">No weekly entries yet.</p>;
  }
  return (
    <Responsive
      narrow={<FollowersSvg rows={rows} W={360} />}
      wide={<FollowersSvg rows={rows} W={720} />}
    />
  );
}

function FollowersSvg({ rows, W }: { rows: FollowerRow[]; W: number }) {
  const points = rows.filter((r) => r.followers !== null);
  const weeks = [...new Set(points.map((r) => r.week_start))].sort();
  const values = points.map((r) => r.followers!);
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  const pad = Math.max(1, (hi - lo) * 0.1);
  const yMin = Math.max(0, lo - pad);
  const yMax = hi + pad;

  const H = 220;
  const left = 44;
  const right = 110; // room for the end labels
  const top = 12;
  const bottom = 22;
  const plotW = W - left - right;
  const plotH = H - top - bottom;
  const x = (week: string) =>
    weeks.length === 1
      ? left + plotW / 2
      : left + (weeks.indexOf(week) / (weeks.length - 1)) * plotW;
  const y = (v: number) => top + plotH - ((v - yMin) / (yMax - yMin)) * plotH;

  const series = PLATFORMS.map((platform) => ({
    platform,
    points: points
      .filter((r) => r.platform === platform)
      .sort((a, b) => a.week_start.localeCompare(b.week_start)),
  })).filter((s) => s.points.length > 0);

  return (
    <figure className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-4 text-[13px]">
        {series.map(({ platform }) => (
          <span key={platform} className="inline-flex items-center gap-1.5">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ background: SERIES_COLORS[platform] }}
            />
            {PLATFORM_LABELS[platform]}
          </span>
        ))}
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label="Followers per platform per week"
      >
        {[yMax, (yMax + yMin) / 2, yMin].map((v, i) => (
          <g key={i}>
            <line x1={left} x2={left + plotW} y1={y(v)} y2={y(v)} stroke={GRID} strokeDasharray={i === 2 ? undefined : "3 3"} />
            <text x={left - 6} y={y(v) + 4} textAnchor="end" fontSize="11" fill={AXIS_TEXT}>
              {nf.format(Math.round(v))}
            </text>
          </g>
        ))}
        {[weeks[0], weeks[weeks.length - 1]].map((week, i) => (
          <text
            key={i}
            x={x(week)}
            y={H - 6}
            textAnchor={weeks.length === 1 ? "middle" : i === 0 ? "start" : "end"}
            fontSize="11"
            fill={AXIS_TEXT}
          >
            {shortDate(week)}
          </text>
        ))}
        {series.map(({ platform, points: pts }) => {
          const color = SERIES_COLORS[platform];
          const last = pts[pts.length - 1];
          return (
            <g key={platform}>
              {pts.length > 1 && (
                <polyline
                  points={pts.map((r) => `${x(r.week_start)},${y(r.followers!)}`).join(" ")}
                  fill="none"
                  stroke={color}
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              )}
              {pts.map((r) => (
                <g key={r.week_start}>
                  <circle cx={x(r.week_start)} cy={y(r.followers!)} r="4" fill={color} stroke="#fff" strokeWidth="2" />
                  <circle cx={x(r.week_start)} cy={y(r.followers!)} r="10" fill="transparent">
                    <title>{`${PLATFORM_LABELS[platform]}, week of ${shortDate(r.week_start)}: ${nf.format(r.followers!)} followers`}</title>
                  </circle>
                </g>
              ))}
              {/* Direct label at the line end, in ink (identity = the dot). */}
              <text x={x(last.week_start) + 10} y={y(last.followers!) + 4} fontSize="12" fill={INK}>
                {`${PLATFORM_LABELS[platform]} ${nf.format(last.followers!)}`}
              </text>
            </g>
          );
        })}
      </svg>
    </figure>
  );
}
