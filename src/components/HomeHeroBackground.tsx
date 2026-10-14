import LottieView from "lottie-react-native";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import CoinIcon from "../../assets/coin.svg";
import FireIcon from "../../assets/fire.svg";

// ─── Props ────────────────────────────────────────────────────────────────────

interface HomeHeroBackgroundProps {
  /**
   * The pixel height of the hero area.
   * Provided by the parent so height is computed once (from screen width and
   * the known 4:3 image aspect ratio) and shared with the sibling spacer —
   * eliminating any duplicated magic numbers.
   */
  height: number;
  /** Current streak count to display next to the fire icon */
  streak?: number;
  /** Called when the user taps the fire/streak icon */
  onStreakPress: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * HomeHeroBackground
 *
 * Renders the decorative hero artwork (fff.png) anchored to the top of the
 * screen. It lives *outside* the ScrollView so it never scrolls with the
 * page content.
 *
 * Layout strategy
 * ───────────────
 * Absolutely positioned (top: 0, left: 0, right: 0) with a height derived
 * from the screen width and the image's 4:3 aspect ratio. This guarantees the
 * container matches the image proportions exactly, so resizeMode="cover" fills
 * without any cropping on any screen size.
 *
 * The hero itself has pointerEvents="box-none" so touches pass through to
 * content underneath, while the stat chips (fire + coin) are interactive.
 *
 * Lottie overlay
 * ──────────────
 * cat.json is rendered on the right side of the hero using absolute
 * positioning. It loops indefinitely.
 */
export function HomeHeroBackground({
  height,
  streak = 0,
  onStreakPress,
}: HomeHeroBackgroundProps) {
  return (
    <View
      pointerEvents="box-none"
      style={[styles.container, { height }]}
    >
      {/* Background artwork */}
      <Image
        source={require("../../assets/fff.png")}
        style={styles.image}
        resizeMode="cover"
        fadeDuration={0}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      />

      {/* Lottie animation — right side of hero */}
      <LottieView
        source={require("../../assets/cat.json")}
        autoPlay
        loop
        style={styles.lottie}
      />

      {/* ── Stat preview overlay (fire + coin) ─────────────────────── */}
      <View style={styles.statsOverlay} pointerEvents="box-none">
        {/* Fire / Streak — Interactive */}
        <TouchableOpacity
          onPress={onStreakPress}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.statChip}
        >
          <View style={[styles.iconBubble, { backgroundColor: "#FFE0C2" }]}>
            <FireIcon width={18} height={18} />
          </View>
          <Text style={styles.statValue}>{streak}</Text>
        </TouchableOpacity>

        {/* Coin / Points — Not interactive yet */}
        <View style={styles.statChip}>
          <View style={[styles.iconBubble, { backgroundColor: "#FFF3CD" }]}>
            <CoinIcon width={18} height={18} />
          </View>
          <Text style={styles.statValue}>0</Text>
        </View>
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "transparent",
    zIndex: 1,
  },
  image: {
    width: "100%",
    height: "100%",
    backgroundColor: "transparent",
  },
  lottie: {
    position: "absolute",
    right: 5,
    bottom: 10,
    width: "45%",
    height: "45%",
  },
  statsOverlay: {
    position: "absolute",
    top: 200,
    left: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  statChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  iconBubble: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: {
    fontFamily: "Poppins-Bold",
    fontSize: 15,
    color: "#ffffff",
    includeFontPadding: false,
  },
});