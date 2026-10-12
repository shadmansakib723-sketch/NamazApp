import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "react-native";
import { useState } from "react";
import type { SvgProps } from "react-native-svg";

import type { PrayerKey, PrayerStatus } from "@/types/prayer";
import { PrayerLogSheet } from "@/components/PrayerLogSheet";

import AsrIcon from "../../assets/asr.svg";
import DhuhrIcon from "../../assets/dhuhr.svg";
import FajrIcon from "../../assets/fajr.svg";
import IshaIcon from "../../assets/isha.svg";
import MaghribIcon from "../../assets/maghrib.svg";

// ─── Types ────────────────────────────────────────────────────────────────────

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

/** Maps each status to a pill label and colour */
const STATUS_PILL: Record<
  Exclude<PrayerStatus, null>,
  { label: string; bg: string; text: string }
> = {
  on_time: { label: "On Time", bg: "#22C55E", text: "#fff" },
  late: { label: "Late", bg: "#F59E0B", text: "#fff" },
  excused: { label: "Excused", bg: "#6366F1", text: "#fff" },
  missed: { label: "Missed", bg: "#EF4444", text: "#fff" },
  qaza: { label: "Qaza", bg: "#7C3AED", text: "#fff" },
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  /** Current status for each prayer, owned by the parent screen */
  statuses: Record<PrayerKey, PrayerStatus>;
  /** Called when the user selects a status from the bottom sheet */
  onStatusChange: (key: PrayerKey, status: Exclude<PrayerStatus, null>) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * PrayerTapCard
 *
 * A clean card matching StatsBar and NextPrayerCard with subtle shadow elevation,
 * surface background token, and interactive prayer tracking tiles.
 * Tapping any prayer opens a bottom sheet to log the prayer status.
 */
export function PrayerTapCard({ statuses, onStatusChange }: Props) {
  // UI-only state — which prayer's log sheet is open right now
  const [activeSheet, setActiveSheet] = useState<PrayerKey | null>(null);

  function openSheet(key: PrayerKey) {
    setActiveSheet(key);
  }

  function closeSheet() {
    setActiveSheet(null);
  }

  function handleSelect(status: Exclude<PrayerStatus, null>) {
    if (!activeSheet) return;
    onStatusChange(activeSheet, status);
    setActiveSheet(null);
  }

  const activePrayer = activeSheet
    ? PRAYERS.find((p) => p.key === activeSheet)
    : null;

  return (
    <>
      <View
        style={styles.card}
        className="mx-4 mt-3 rounded-2xl bg-surface p-3.5"
      >
        {/* Card Header Title */}
        <Text className="mb-3 text-center font-poppins-semibold text-xs text-text-secondary">
          » Tap when you pray «
        </Text>

        {/* 5 Prayer Action Buttons */}
        <View className="flex-row justify-between gap-x-1.5">
          {PRAYERS.map((prayer) => {
            const status = statuses[prayer.key];
            const pill = status ? STATUS_PILL[status] : null;
            const Icon = PRAYER_ICONS[prayer.key];

            return (
              <Pressable
                key={prayer.key}
                onPress={() => openSheet(prayer.key)}
                accessibilityRole="button"
                accessibilityLabel={`Log ${prayer.label} prayer`}
                className="flex-1 items-center rounded-xl bg-white py-2.5"
                style={
                  pill
                    ? { borderColor: pill.bg, borderWidth: 2 }
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

                {/* Status indicator — pill if logged, empty circle otherwise */}
                {pill ? (
                  <View
                    style={[
                      styles.statusPill,
                      { backgroundColor: pill.bg },
                    ]}
                  >
                    <Text style={[styles.statusPillText, { color: pill.text }]}>
                      {pill.label}
                    </Text>
                  </View>
                ) : (
                  <View style={styles.emptyCircle} />
                )}
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Bottom sheet — rendered outside the card so it can cover the full screen */}
      <PrayerLogSheet
        visible={activeSheet !== null}
        prayerKey={activeSheet}
        prayerLabel={activePrayer?.label ?? ""}
        onSelect={handleSelect}
        onClose={closeSheet}
      />
    </>
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
  statusPill: {
    borderRadius: 99,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 44,
    alignItems: "center",
  },
  statusPillText: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.2,
    fontFamily: "Poppins_600SemiBold",
  },
  emptyCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#CCCCCC",
    backgroundColor: "#fff",
  },
});
