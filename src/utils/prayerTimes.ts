import {
  Coordinates,
  CalculationMethod,
  PrayerTimes,
  Prayer,
} from "adhan";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NextPrayer {
  /** Display name, e.g. "Fajr" */
  name: string;
  /** Exact start time as a Date object */
  time: Date;
}

// ─── Constants ────────────────────────────────────────────────────────────────

/** Human-readable prayer name map from adhan Prayer enum values */
const PRAYER_LABELS: Record<string, string> = {
  [Prayer.Fajr]: "Fajr",
  [Prayer.Dhuhr]: "Dhuhr",
  [Prayer.Asr]: "Asr",
  [Prayer.Maghrib]: "Maghrib",
  [Prayer.Isha]: "Isha",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Calculates today's prayer times for a given coordinate.
 * Uses the Muslim World League method — widely accepted internationally.
 */
function getPrayerTimes(latitude: number, longitude: number): PrayerTimes {
  const coords = new Coordinates(latitude, longitude);
  const params = CalculationMethod.MuslimWorldLeague();
  return new PrayerTimes(coords, new Date(), params);
}

/**
 * Returns the next upcoming prayer relative to now.
 * If all prayers for today have passed, returns Fajr of the next day.
 */
export function getNextPrayer(latitude: number, longitude: number): NextPrayer {
  const times = getPrayerTimes(latitude, longitude);
  const now = new Date();

  // Ordered list of prayers with their times
  const prayers: { prayer: string; time: Date }[] = [
    { prayer: Prayer.Fajr, time: times.fajr },
    { prayer: Prayer.Dhuhr, time: times.dhuhr },
    { prayer: Prayer.Asr, time: times.asr },
    { prayer: Prayer.Maghrib, time: times.maghrib },
    { prayer: Prayer.Isha, time: times.isha },
  ];

  // Find the first prayer that hasn't started yet
  for (const { prayer, time } of prayers) {
    if (time > now) {
      return { name: PRAYER_LABELS[prayer] ?? prayer, time };
    }
  }

  // All today's prayers have passed — return tomorrow's Fajr
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const coords = new Coordinates(latitude, longitude);
  const params = CalculationMethod.MuslimWorldLeague();
  const tomorrowTimes = new PrayerTimes(coords, tomorrow, params);

  return { name: "Fajr", time: tomorrowTimes.fajr };
}

/**
 * Formats a Date to 12-hour time string, e.g. "11:48 AM"
 */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Formats a Date to display string, e.g. "Thursday, 17 Sep"
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });
}

/**
 * Calculates a human-readable countdown from now to a future time.
 * Returns e.g. "in 2h 16m" or "in 45m"
 */
export function formatCountdown(targetTime: Date): string {
  const nowMs = Date.now();
  const diffMs = targetTime.getTime() - nowMs;

  if (diffMs <= 0) return "now";

  const totalMinutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0) {
    return `in ${hours}h ${minutes}m`;
  }
  return `in ${minutes}m`;
}
