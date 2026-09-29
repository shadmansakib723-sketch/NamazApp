import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "react-native";
import { useState } from "react";
import type { SvgProps } from "react-native-svg";

import AsrIcon from "../../assets/asr.svg";
import DhuhrIcon from "../../assets/dhuhr.svg";
import FajrIcon from "../../assets/fajr.svg";
import IshaIcon from "../../assets/isha.svg";
import MaghribIcon from "../../assets/maghrib.svg";

// ─── Types ────────────────────────────────────────────────────────────────────

type PrayerKey = "fajr" | "dhuhr" | "asr" | "maghrib" | "isha";

interface Prayer {
  key: PrayerKey;
  label: string;
  accentColor: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PRAYER_ICONS: Record<PrayerKey, React.FC<SvgProps>> = {
  fajr: FajrIcon,
  dhuhr: DhuhrIcon,
  asr: AsrIcon,
  maghrib: MaghribIcon,
  isha: IshaIcon,
};

const PRAYERS: Prayer[] = [
  { key: "fajr", label: "Fajr", accentColor: "#53b458" },
  { key: "dhuhr", label: "Dhuhr", accentColor: "#3B90C8" },
  { key: "asr", label: "Asr", accentColor: "#D4924A" },
  { key: "maghrib", label: "Maghrib", accentColor: "#9B4FA8" },
  { key: "isha", label: "Isha", accentColor: "#1E3A6E" },
];

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * PrayerTapCard
 *
 * A clean card matching StatsBar and NextPrayerCard with subtle shadow elevation,
 * surface background token, and interactive prayer tracking tiles.
 */
export function PrayerTapCard() {
  const [prayed, setPrayed] = useState<Set<PrayerKey>>(new Set());

  function toggle(key: PrayerKey) {
    setPrayed((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  return (
    <View style={styles.card} className="mx-4 mt-3 rounded-2xl bg-surface p-3.5">
      {/* Card Header Title */}
      <Text className="mb-3 text-center font-poppins-semibold text-xs text-text-secondary">
        » Tap when you pray «
      </Text>

      {/* 5 Prayer Action Buttons */}
      <View className="flex-row justify-between gap-x-1.5">
        {PRAYERS.map((prayer) => {
          const isDone = prayed.has(prayer.key);
          const Icon = PRAYER_ICONS[prayer.key];

          return (
            <Pressable
              key={prayer.key}
              onPress={() => toggle(prayer.key)}
              accessibilityRole="button"
              accessibilityLabel={`Mark ${prayer.label} as prayed`}
              className="flex-1 items-center rounded-xl bg-white py-2.5"
              style={
                isDone
                  ? { borderColor: prayer.accentColor, borderWidth: 2 }
                  : { borderColor: "transparent", borderWidth: 2 }
              }
            >
              {/* Circular SVG Icon */}
              <View className="mb-1.5 h-11 w-11 items-center justify-center overflow-hidden rounded-full">
                <Icon width={44} height={44} />
              </View>

              {/* Prayer Name */}
              <Text className="mb-1.5 text-center font-poppins-semibold text-[11px] text-brand-dark">
                {prayer.label}
              </Text>

              {/* Checkbox Indicator */}
              <View
                className="h-5 w-5 items-center justify-center rounded-full border border-[#CCCCCC] bg-white"
                style={
                  isDone
                    ? {
                      backgroundColor: prayer.accentColor,
                      borderColor: prayer.accentColor,
                    }
                    : undefined
                }
              >
                {isDone && (
                  <Text className="text-xs font-bold leading-[14px] text-white">
                    ✓
                  </Text>
                )}
              </View>
            </Pressable>
          );
        })}
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
});
