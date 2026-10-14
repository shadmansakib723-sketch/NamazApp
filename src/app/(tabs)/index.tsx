import { ScrollView, StyleSheet, useWindowDimensions, View } from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { HomeHeroBackground } from "@/components/HomeHeroBackground";
import { NextPrayerCard } from "@/components/NextPrayerCard";
import { PrayerTapCard } from "@/components/PrayerTapCard";
import { QazaCard } from "@/components/QazaCard";
import { StreakSheet } from "@/components/StreakSheet";
import { useNextPrayer } from "@/hooks/useNextPrayer";
import type { PrayerKey, PrayerStatus } from "@/types/prayer";

/**
 * HomeScreen
 *
 * Z-order (back → front):
 *
 *   [SafeAreaView]
 *     ├─ [HomeHeroBackground]   zIndex: 1 — fixed hero artwork with interactive fire/coin chips
 *     └─ [contentLayer]         zIndex: 1 — sits on top (pointerEvents="box-none")
 *          ├─ [heroSpacer]      same height as artwork (pointerEvents="none")
 *          └─ [sheetContainer]  rounded-top white panel
 *               └─ [ScrollView] scrollable prayer cards & qaza
 *
 * State ownership
 * ───────────────
 * `statuses` lives here so both PrayerTapCard and QazaCard can read/write it
 * without Zustand (same screen, no cross-screen sharing needed).
 *
 * Hero height
 * ───────────
 * heroHeight = screenWidth × (3 / 4)  — derived from fff.png 4:3 aspect ratio.
 */
export default function HomeScreen() {
  const { width: screenWidth } = useWindowDimensions();
  const prayer = useNextPrayer();

  /** Derived from the 4:3 aspect ratio of fff.png */
  const heroHeight = screenWidth * (3 / 4);

  // ── Streak sheet visibility ───────────────────────────────────────────────
  const [streakSheetVisible, setStreakSheetVisible] = useState(false);

  // Placeholder values — replace with real store/data later
  const currentStreak = 5;
  const highestStreak = 12;

  // ── Prayer status state (single source of truth) ─────────────────────────
  const [statuses, setStatuses] = useState<Record<PrayerKey, PrayerStatus>>({
    fajr: null,
    dhuhr: null,
    asr: null,
    maghrib: null,
    isha: null,
  });

  /** Called by PrayerTapCard when the user logs a prayer */
  function handleStatusChange(
    key: PrayerKey,
    status: Exclude<PrayerStatus, null>,
  ) {
    setStatuses((prev) => ({ ...prev, [key]: status }));
  }

  /** Called by QazaCard when the user confirms they made up a missed prayer */
  function handleQazaPrayed(key: PrayerKey) {
    setStatuses((prev) => ({ ...prev, [key]: "qaza" }));
  }

  return (
    <>
      <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
        {/* ── Hero artwork: decorative with interactive streak & coin chips ── */}
        <HomeHeroBackground
          height={heroHeight}
          streak={currentStreak}
          onStreakPress={() => setStreakSheetVisible(true)}
        />

        {/* ── Content layer ────────────────────────────────────────── */}
        <View pointerEvents="box-none" style={styles.contentLayer}>
          {/* Spacer that pushes the rounded sheet below the hero artwork */}
          <View pointerEvents="none" style={{ height: heroHeight - 42 }} />

          {/* ── White sheet panel with rounded top corners ─────────── */}
          <View style={styles.sheetContainer}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {/* Next Prayer card */}
              <NextPrayerCard
                allPrayers={prayer.allPrayers}
                city={prayer.city}
                country={prayer.country}
                date={prayer.date}
              />

              {/* Prayer tap card — 5 daily prayers */}
              <PrayerTapCard
                statuses={statuses}
                onStatusChange={handleStatusChange}
              />

              {/* Qaza card — appears only when at least one prayer is missed */}
              <QazaCard statuses={statuses} onQazaPrayed={handleQazaPrayed} />
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>

      {/* Streak bottom sheet — Modal overlays entire screen */}
      <StreakSheet
        visible={streakSheetVisible}
        currentStreak={currentStreak}
        highestStreak={highestStreak}
        onClose={() => setStreakSheetVisible(false)}
      />
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  contentLayer: {
    flex: 1,
    zIndex: 1,
  },
  sheetContainer: {
    flex: 1,
    backgroundColor: "#ffffffff",
    borderTopLeftRadius: 13,
    borderTopRightRadius: 13,
    paddingTop: 12,
    overflow: "hidden",
  },
  scrollContent: {
    paddingBottom: 32,
  },
});
