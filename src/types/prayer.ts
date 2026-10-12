// Prayer log status — null means the user has not logged this prayer yet
export type PrayerStatus =
  | "on_time"
  | "late"
  | "excused"
  | "missed"
  | "qaza"   // missed but later made up (Qaza prayer)
  | null;

export type PrayerKey = "fajr" | "dhuhr" | "asr" | "maghrib" | "isha";
