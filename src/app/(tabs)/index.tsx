import { StyleSheet, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { HomeHeroBackground } from "@/components/HomeHeroBackground";
import { NextPrayerCard } from "@/components/NextPrayerCard";
import { PrayerTapCard } from "@/components/PrayerTapCard";
import { StatsBar } from "@/components/StatsBar";
import { useNextPrayer } from "@/hooks/useNextPrayer";

/**
 * HomeScreen
 *
 * Fixed, non-scrollable layout. Z-order (back → front):
 *
 *   [SafeAreaView]                 flex: 1 container
 *     ├─ [HomeHeroBackground]      zIndex: 0 — absolutely positioned, non-interactive
 *     └─ [content layer]           zIndex: 1 — sits on top of the hero artwork
 *          ├─ [heroSpacer]         same height as artwork → card starts just below it
 *          ├─ [NextPrayerCard]
 *          └─ [PrayerTapCard]      below NextPrayerCard, no scroll
 *
 * Single source of truth for hero height
 * ──────────────────────────────────────
 * heroHeight = screenWidth × (3 / 4)   (4:3 image aspect ratio)
 * Shared between HomeHeroBackground and the spacer — no duplicated numbers.
 */
export default function HomeScreen() {
  const { width: screenWidth } = useWindowDimensions();
  const prayer = useNextPrayer();

  /** Derived from the 4:3 aspect ratio of fff.png */
  const heroHeight = screenWidth * (3 / 4);

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
      {/* ── Hero artwork: decorative, non-interactive, fixed (z=0) ── */}
      <HomeHeroBackground height={heroHeight} />

      {/* ── Content layer (z=1) ─────────────────────────────────── */}
      <View style={styles.contentLayer}>
        {/* Spacer that pushes the rounded sheet below the hero artwork */}
        <View style={{ height: heroHeight - 42 }} />

        {/* ── Bottom sheet container with rounded top corners ────── */}
        <View style={styles.sheetContainer}>
          {/* Stats bar — streak, friends, points */}
          <StatsBar />

          {/* Gap between StatsBar and NextPrayerCard */}
          <View className="h-3" />

          {/* Next Prayer card — all props driven by useNextPrayer hook */}
          <NextPrayerCard
            prayerName={prayer.prayerName}
            prayerTime={prayer.prayerTime}
            countdown={prayer.countdown}
            city={prayer.city}
            country={prayer.country}
            date={prayer.date}
          />

          {/* Prayer tap card — directly below, fixed (no scroll) */}
          <PrayerTapCard />
        </View>
      </View>
    </SafeAreaView>
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
  },
});


