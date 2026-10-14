import { StyleSheet, View } from "react-native";
import { Text } from "react-native";
import type { SvgProps } from "react-native-svg";

import AsrIcon from "../../assets/asr.svg";
import DhuhrIcon from "../../assets/dhuhr.svg";
import FajrIcon from "../../assets/fajr.svg";
import IshaIcon from "../../assets/isha.svg";
import MaghribIcon from "../../assets/maghrib.svg";
import type { PrayerRow } from "@/utils/prayerTimes";

// ─── Icon map ─────────────────────────────────────────────────────────────────

// Sunrise reuses FajrIcon as requested
const ICONS: Record<PrayerRow["key"], React.FC<SvgProps>> = {
  fajr: FajrIcon,
  sunrise: FajrIcon,
  dhuhr: DhuhrIcon,
  asr: AsrIcon,
  maghrib: MaghribIcon,
  isha: IshaIcon,
};

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NextPrayerCardProps {
  /** All 6 prayer rows (Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha) */
  allPrayers: PrayerRow[];
  /** City / district name, e.g. "Sylhet District" */
  city: string;
  /** Country name, e.g. "Bangladesh" */
  country: string;
  /** Formatted date string, e.g. "Thursday, 17 Sep" */
  date: string;
}

// ─── Sub-component: single prayer row ─────────────────────────────────────────

interface PrayerListRowProps {
  row: PrayerRow;
  isLast: boolean;
}

function PrayerListRow({ row, isLast }: PrayerListRowProps) {
  const Icon = ICONS[row.key];

  return (
    <>
      <View
        className="flex-row items-center gap-x-2 py-1"
      >
        {/* Circular icon */}
        <View className="h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-[#F3F4EC]">
          <Icon width={22} height={22} />
        </View>

        {/* Prayer name */}
        <Text
          className={`flex-1 font-poppins text-xs ${row.isNext ? "font-poppins-semibold text-brand-dark" : "text-text-secondary"}`}
        >
          {row.name}
        </Text>

        {/* Time */}
        <Text
          className={`font-poppins text-xs ${row.isNext ? "font-poppins-semibold text-brand-dark" : "text-text-secondary"}`}
        >
          {row.time}
        </Text>


      </View>

      {/* Thin divider — not after the last row */}
      {!isLast && <View style={styles.rowDivider} />}
    </>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * NextPrayerCard
 *
 * Two-column card:
 *   Left  — vertical list of all 6 prayer times; next prayer is highlighted
 *   Right — location and date rows (unchanged)
 *
 * Styling: NativeWind throughout; StyleSheet only for shadow + dividers.
 */
export function NextPrayerCard({
  allPrayers,
  city,
  country,
  date,
}: NextPrayerCardProps) {
  return (
    <View style={styles.card} className="mx-4 flex-row rounded-2xl bg-surface p-4">
      {/* ── Left column: prayer list ──────────────────────────────────────── */}
      <View className="flex-1 justify-center">
        {allPrayers.map((row, index) => (
          <PrayerListRow
            key={row.key}
            row={row}
            isLast={index === allPrayers.length - 1}
          />
        ))}
      </View>

      {/* ── Vertical divider ─────────────────────────────────────────────── */}
      <View style={styles.divider} />

      {/* ── Right column: location + date (untouched) ────────────────────── */}
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
  rowDivider: {
    height: 1,
    backgroundColor: "#EFEFEF",
    marginVertical: 1,
  },
  rowIcon: {
    fontSize: 14,
  },
});
