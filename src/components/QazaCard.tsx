import { Modal, Pressable, StyleSheet, View } from "react-native";
import { Text } from "react-native";
import { useState } from "react";
import type { SvgProps } from "react-native-svg";

import type { PrayerKey, PrayerStatus } from "@/types/prayer";

import AsrIcon from "../../assets/asr.svg";
import DhuhrIcon from "../../assets/dhuhr.svg";
import FajrIcon from "../../assets/fajr.svg";
import IshaIcon from "../../assets/isha.svg";
import MaghribIcon from "../../assets/maghrib.svg";

// ─── Constants ────────────────────────────────────────────────────────────────

const PRAYERS: { key: PrayerKey; label: string }[] = [
  { key: "fajr", label: "Fajr" },
  { key: "dhuhr", label: "Dhuhr" },
  { key: "asr", label: "Asr" },
  { key: "maghrib", label: "Maghrib" },
  { key: "isha", label: "Isha" },
];

const PRAYER_ICONS: Record<PrayerKey, React.FC<SvgProps>> = {
  fajr: FajrIcon,
  dhuhr: DhuhrIcon,
  asr: AsrIcon,
  maghrib: MaghribIcon,
  isha: IshaIcon,
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  statuses: Record<PrayerKey, PrayerStatus>;
  /** Called when the user confirms they prayed a Qaza prayer */
  onQazaPrayed: (key: PrayerKey) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * QazaCard
 *
 * Appears below PrayerTapCard only when at least one prayer is "missed".
 * Lists each missed prayer as a pending row. Tapping opens a confirmation
 * bottom sheet — if confirmed, the parent marks that prayer as "qaza".
 * Disappears completely once all missed prayers have been made up.
 */
export function QazaCard({ statuses, onQazaPrayed }: Props) {
  // Which missed prayer the user tapped (opens the confirmation sheet)
  const [activeQaza, setActiveQaza] = useState<PrayerKey | null>(null);

  // Only show prayers that are currently "missed", in prayer order
  const missedPrayers = PRAYERS.filter((p) => statuses[p.key] === "missed");

  // Card disappears when nothing is left
  if (missedPrayers.length === 0) return null;

  const activePrayer = activeQaza
    ? PRAYERS.find((p) => p.key === activeQaza)
    : null;

  function handleConfirm() {
    if (!activeQaza) return;
    onQazaPrayed(activeQaza);
    setActiveQaza(null);
  }

  function closeSheet() {
    setActiveQaza(null);
  }

  return (
    <>
      {/* ── Qaza Card ──────────────────────────────────────────────── */}
      <View style={styles.card} className="mx-4 mb-2 mt-3 rounded-2xl bg-surface p-3.5">
        {/* Header */}
        <View className="mb-3 flex-row items-center gap-x-2">
          <Text className="font-poppins-semibold text-xs text-text-secondary">
            🕌  Qaza Prayers
          </Text>
        </View>

        {/* Missed prayer rows */}
        {missedPrayers.map((prayer) => {
          const Icon = PRAYER_ICONS[prayer.key];
          return (
            <Pressable
              key={prayer.key}
              onPress={() => setActiveQaza(prayer.key)}
              accessibilityRole="button"
              accessibilityLabel={`Mark ${prayer.label} Qaza as prayed`}
              className="mb-2 flex-row items-center rounded-xl bg-red-50 px-3 py-2.5"
            >
              {/* Prayer icon */}
              <View className="mr-3 h-9 w-9 items-center justify-center overflow-hidden rounded-full">
                <Icon width={36} height={36} />
              </View>

              {/* Prayer name */}
              <Text className="flex-1 font-poppins-semibold text-sm text-[#111827]">
                {prayer.label}
              </Text>

              {/* Pending badge */}
              <View className="rounded-full bg-red-100 px-2.5 py-0.5">
                <Text className="font-poppins-semibold text-[10px] text-red-600">
                  Pending
                </Text>
              </View>

              {/* Chevron */}
              <Text className="ml-2 text-base text-[#9CA3AF]">›</Text>
            </Pressable>
          );
        })}
      </View>

      {/* ── Qaza Confirmation Sheet ─────────────────────────────────── */}
      <Modal
        visible={activeQaza !== null}
        transparent
        animationType="slide"
        onRequestClose={closeSheet}
        statusBarTranslucent
      >
        {/* Transparent area above the sheet — tap to dismiss */}
        <Pressable style={styles.tapOutside} onPress={closeSheet} />

        <View style={styles.sheet}>
          {/* Handle */}
          <View style={styles.handle} />

          {/* Close button */}
          <Pressable style={styles.closeBtn} onPress={closeSheet} hitSlop={12}>
            <Text style={styles.closeBtnText}>✕</Text>
          </Pressable>

          {activePrayer && (
            <>
              {/* Prayer header */}
              <View style={styles.header}>
                <View style={styles.iconCircle}>
                  {(() => {
                    const Icon = PRAYER_ICONS[activePrayer.key];
                    return <Icon width={48} height={48} />;
                  })()}
                </View>
                <View style={styles.headerText}>
                  <Text style={styles.prayerName}>
                    {activePrayer.label} — Qaza
                  </Text>
                  <Text style={styles.prayerSubtitle}>Missed prayer</Text>
                </View>
              </View>

              {/* Question */}
              <Text style={styles.question}>
                Have you made up your {activePrayer.label} prayer?
              </Text>
            </>
          )}

          {/* Action buttons */}
          <View style={styles.buttons}>
            <Pressable
              style={styles.confirmBtn}
              onPress={handleConfirm}
              accessibilityRole="button"
            >
              <Text style={styles.confirmBtnText}>✓  Yes, I prayed it</Text>
            </Pressable>

            <Pressable
              style={styles.cancelBtn}
              onPress={closeSheet}
              accessibilityRole="button"
            >
              <Text style={styles.cancelBtnText}>Not yet</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },

  // Sheet
  tapOutside: {
    flex: 1,
  },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 36,
    paddingTop: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#D1D5DB",
    alignSelf: "center",
    marginBottom: 12,
  },
  closeBtn: {
    position: "absolute",
    top: 16,
    right: 20,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  closeBtnText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "700",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: "hidden",
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  prayerName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    fontFamily: "Poppins_600SemiBold",
  },
  prayerSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
    fontFamily: "Poppins_400Regular",
  },
  question: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 24,
    fontFamily: "Poppins_600SemiBold",
  },
  buttons: {
    gap: 10,
  },
  confirmBtn: {
    backgroundColor: "#22C55E",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  confirmBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    fontFamily: "Poppins_600SemiBold",
  },
  cancelBtn: {
    backgroundColor: "#F3F4F6",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  cancelBtnText: {
    color: "#6B7280",
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "Poppins_400Regular",
  },
});
