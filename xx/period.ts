import type { PeriodType } from "@/types/period";

export const PERIOD_TABS: { key: PeriodType; label: string }[] = [
  { key: "weekly", label: "Weekly" },
  { key: "monthly", label: "Monthly" },
  { key: "yearly", label: "Yearly" },
];

// How many past periods the picker lists
const PICKER_COUNT: Record<PeriodType, number> = {
  weekly: 12,
  monthly: 12,
  yearly: 5,
};

/** Monday of the week containing `date`. */
function startOfWeek(date: Date): Date {
  const offset = (date.getDay() + 6) % 7;
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() - offset);
}

function formatDay(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/** Move `date` forward/backward by whole periods. `steps` can be negative. */
export function shiftPeriod(date: Date, period: PeriodType, steps: number): Date {
  const y = date.getFullYear();
  const m = date.getMonth();
  const d = date.getDate();

  if (period === "weekly") return new Date(y, m, d + 7 * steps);
  if (period === "monthly") return new Date(y, m + steps, 1);
  return new Date(y + steps, m, 1);
}

/** "Mar 30 – Apr 5, 2026" | "March 2026" | "2026" */
export function formatPeriod(date: Date, period: PeriodType): string {
  if (period === "yearly") return String(date.getFullYear());

  if (period === "monthly") {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  }

  const start = startOfWeek(date);
  const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6);
  return `${formatDay(start)} – ${formatDay(end)}, ${end.getFullYear()}`;
}

/** Current period first, then older ones. */
export function getRecentPeriods(period: PeriodType): Date[] {
  const now = new Date();
  return Array.from({ length: PICKER_COUNT[period] }, (_, i) =>
    shiftPeriod(now, period, -i),
  );
}
