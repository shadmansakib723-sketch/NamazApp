import { ScrollView, StyleSheet, useWindowDimensions, View } from "react-native";

import { HomeHeroBackground } from "@/components/HomeHeroBackground";
import { Screen } from "@/components/Screen";
import { ScreenTitle } from "@/components/ScreenTitle";

/**
 * HomeScreen
 *
 * Layout z-order (back → front):
 *
 *   [Screen / SafeAreaView]           flex: 1 container
 *     ├─ [HomeHeroBackground]         zIndex: 0 — absolutely positioned, fixed, non-interactive
 *     └─ [ScrollView]                 zIndex: 1 — transparent, scrolls independently
 *          ├─ [heroSpacer]            same height as artwork → content starts below it
 *          └─ [content …]
 *
 * Single source of truth for the hero height
 * ────────────────────────────────────────────
 * The image has a fixed 4:3 aspect ratio.
 * We derive heroHeight from the real screen width at runtime:
 *
 *   heroHeight = screenWidth × (3 / 4)
 *
 * This value is passed to HomeHeroBackground AND used for the spacer height,
 * so they are always in sync — no duplicated numbers anywhere.
 *
 * Why this makes layout consistent across every device
 * ─────────────────────────────────────────────────────
 * Different phones have different pixel widths, but the 4:3 contract is
 * constant. By computing height from the actual runtime width, the image
 * container always matches the image's natural proportions exactly —
 * resizeMode="cover" therefore fills without cropping on any screen size.
 */
export default function HomeScreen() {
  const { width: screenWidth } = useWindowDimensions();

  /**
   * Derive the hero height from the image's known 4:3 aspect ratio.
   * This is the single source of truth used by both the background
   * artwork and the spacer that pushes content below it.
   */
  const heroHeight = screenWidth * (3 / 4);

  return (
    <Screen>
      {/* ── Hero background: fixed, decorative, non-interactive (z=0) ── */}
      <HomeHeroBackground height={heroHeight} />

      {/* ── Scrollable content layer (z=1) ── */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/*
         * Spacer that occupies the same height as the background artwork.
         * Keeps visible content from starting behind the image.
         * Uses the same heroHeight constant — no duplication.
         */}
        <View style={{ height: heroHeight }} />

        {/* ── Screen content ── */}
        <View className="flex-1 rounded-t-3xl bg-white px-6 pt-8">
          <ScreenTitle
            title="Welcome to Salah Tracker"
            subtitle="Your simple starting point for tracking your prayers."
          />
        </View>
      </ScrollView>
    </Screen>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  /**
   * The ScrollView must be transparent so HomeHeroBackground shows through.
   * zIndex: 1 makes the layering intent explicit — this is the interactive layer.
   */
  scrollView: {
    flex: 1,
    backgroundColor: "transparent",
    zIndex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
