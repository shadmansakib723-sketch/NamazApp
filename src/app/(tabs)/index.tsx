import { StyleSheet, useWindowDimensions, View } from "react-native";

import { HomeHeroBackground } from "@/components/HomeHeroBackground";
import { NextPrayerCard } from "@/components/NextPrayerCard";
import { Screen } from "@/components/Screen";

/**
 * HomeScreen
 *
 * Fixed, non-scrollable layout. Z-order (back → front):
 *
 *   [Screen / SafeAreaView]        flex: 1 container
 *     ├─ [HomeHeroBackground]      zIndex: 0 — absolutely positioned, non-interactive
 *     └─ [content layer]           zIndex: 1 — sits on top of the hero artwork
 *          ├─ [heroSpacer]         same height as artwork → card starts just below it
 *          └─ [NextPrayerCard]
 *
 * Single source of truth for hero height
 * ──────────────────────────────────────
 * heroHeight = screenWidth × (3 / 4)   (4:3 image aspect ratio)
 * Shared between HomeHeroBackground and the spacer — no duplicated numbers.
 */
export default function HomeScreen() {
  const { width: screenWidth } = useWindowDimensions();

  /** Derived from the 4:3 aspect ratio of fff.png */
  const heroHeight = screenWidth * (3 / 4);

  return (
    <Screen>
      {/* ── Hero artwork: decorative, non-interactive, fixed (z=0) ── */}
      <HomeHeroBackground height={heroHeight} />

      {/* ── Content layer (z=1) ─────────────────────────────────── */}
      <View style={styles.contentLayer}>
        {/* Spacer that keeps content below the hero artwork */}
        <View style={{ height: heroHeight - 24 }} />

        {/* Next Prayer card — pulled up 24 px to overlap the hero bottom edge */}
        <NextPrayerCard
          prayerName="Dhuhr"
          prayerTime="11:48 AM"
          countdown="in 2h 16m"
          city="Sylhet District"
          country="Bangladesh"
          date="Thursday, 17 Sep"
        />
      </View>
    </Screen>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  contentLayer: {
    flex: 1,
    zIndex: 1,
  },
});
