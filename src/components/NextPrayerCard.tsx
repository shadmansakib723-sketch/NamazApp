import { StyleSheet, View } from "react-native";
import { Text } from "react-native";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NextPrayerCardProps {
  /** Name of the next prayer, e.g. "Dhuhr" */
  prayerName: string;
  /** Formatted prayer time, e.g. "11:48 AM" */
  prayerTime: string;
  /** Human-readable countdown, e.g. "in 2h 16m" */
  countdown: string;
  /** City / district name, e.g. "Sylhet District" */
  city: string;
  /** Country name, e.g. "Bangladesh" */
  country: string;
  /** Formatted date string, e.g. "Thursday, 17 Sep" */
  date: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * NextPrayerCard
 *
 * Displays a two-column info card:
 *   Left  — mosque icon, "Next Prayer" label, prayer name, time, countdown
 *   Right — location and date rows
 *
 * All styling is done with NativeWind classes.
 * StyleSheet is used only for the vertical divider (dynamic height fill)
 * and the card shadow (platform-specific props).
 */
export function NextPrayerCard({
  prayerName,
  prayerTime,
  countdown,
  city,
  country,
  date,
}: NextPrayerCardProps) {
  return (
    <View style={styles.card} className="mx-4 flex-row rounded-2xl bg-surface p-5">
      {/* ── Left column ─────────────────────────────────────────────────── */}
      <View className="flex-1 justify-center gap-y-1">
        {/* Mosque icon + "Next Prayer" label */}
        <View className="flex-row items-center gap-x-2">
          <Text style={styles.mosqueIcon}>🕌</Text>
          <Text className="font-poppins text-xs text-text-secondary">
            Next Prayer
          </Text>
        </View>

        {/* Prayer name */}
        <Text className="font-poppins-bold text-3xl text-brand-dark">
          {prayerName}
        </Text>

        {/* Prayer time */}
        <Text className="font-poppins-bold text-2xl text-brand-dark">
          {prayerTime}
        </Text>

        {/* Countdown */}
        <Text className="font-poppins text-sm text-text-secondary">
          {countdown}
        </Text>
      </View>

      {/* ── Vertical divider ────────────────────────────────────────────── */}
      <View style={styles.divider} />

      {/* ── Right column ────────────────────────────────────────────────── */}
      <View className="flex-1 justify-center gap-y-4 pl-4">
        {/* Location row */}
        <View className="flex-row items-start gap-x-3">
          <View className="mt-0.5 h-8 w-8 items-center justify-center rounded-full bg-brand-subtle">
            <Text style={styles.rowIcon}>📍</Text>
          </View>
          <View className="flex-1">
            <Text className="font-poppins-semibold text-sm text-brand-dark">
              {city}
            </Text>
            <Text className="font-poppins text-xs text-brand-mid">
              {country}
            </Text>
          </View>
        </View>

        {/* Date row */}
        <View className="flex-row items-center gap-x-3">
          <View className="h-8 w-8 items-center justify-center rounded-full bg-brand-subtle">
            <Text style={styles.rowIcon}>📅</Text>
          </View>
          <Text className="font-poppins-semibold text-sm text-brand-dark">
            {date}
          </Text>
        </View>
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    // Shadow — iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    // Shadow — Android
    elevation: 3,
  },
  divider: {
    width: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 4,
    alignSelf: "stretch",
  },
  mosqueIcon: {
    fontSize: 18,
  },
  rowIcon: {
    fontSize: 14,
  },
});
