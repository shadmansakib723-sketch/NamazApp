import { Image, StyleSheet, View } from "react-native";

// ─── Props ────────────────────────────────────────────────────────────────────

interface HomeHeroBackgroundProps {
  /**
   * The pixel height of the hero area.
   * Provided by the parent so height is computed once (from screen width and
   * the known 4:3 image aspect ratio) and shared with the sibling spacer —
   * eliminating any duplicated magic numbers.
   */
  height: number;
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
 * Explicit zIndex: 0 is set so the layering intent is clear and does not rely
 * on natural DOM/JSX ordering.
 *
 * pointerEvents="none" ensures the artwork never intercepts touch events —
 * the user can interact with content that visually overlaps it.
 */
export function HomeHeroBackground({ height }: HomeHeroBackgroundProps) {
  return (
    <View
      pointerEvents="none"
      style={[styles.container, { height }]}
    >
      <Image
        source={require("../../assets/fff.png")}
        style={styles.image}
        resizeMode="cover"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      />
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
    // height is injected as a prop — no magic number lives here
    overflow: "hidden",
    zIndex: 0, // explicit: background layer
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
