import { Image, StyleSheet, Text, View } from "react-native";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProfileHeroProps {
  /** URI string for a remote avatar (e.g. Google profile photo). */
  avatarUri?: string | null;
  /** Display name shown beside the avatar inside the hero. */
  name: string;
  /** Optional subtitle below the name (shown when signed out or as email when signed in). */
  subtitle?: string;
  /**
   * Pixel height of the banner.
   * Derived by the parent from screenWidth × (3/4) and passed in so the
   * parent and the ScrollView spacer share a single computed value —
   * identical pattern to HomeHeroBackground.
   */
  height: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const BANNER = require("../../assets/dicka.png");
const DEFAULT_AVATAR = require("../../assets/images.png");

const AVATAR_SIZE = 80;
const AVATAR_RADIUS = 20; // rounded square (squircle)

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * ProfileHero
 *
 * Renders the full-width banner image anchored to the top of the screen.
 * Lives *outside* the ScrollView so it never scrolls with page content —
 * same pattern as HomeHeroBackground.
 *
 * Bottom-left overlay:
 *   [rounded-square avatar] [name text]
 *
 * No badge, no explorer tag — just the avatar and the name.
 */
export function ProfileHero({ avatarUri, name, subtitle, height }: ProfileHeroProps) {
  const avatarSource = avatarUri ? { uri: avatarUri } : DEFAULT_AVATAR;

  return (
    <View style={[styles.container, { height }]}>
      {/* Full-width banner image */}
      <Image source={BANNER} style={styles.banner} resizeMode="cover" />

      {/* Bottom-left: rounded-square avatar + name */}
      <View style={styles.bottomRow}>
        {/* Rounded square avatar */}
        <View style={styles.avatarWrapper}>
          <Image source={avatarSource} style={styles.avatar} resizeMode="cover" />
        </View>

        {/* Name + optional subtitle — stacked vertically */}
        <View style={styles.textContainer}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          {subtitle ? (
            <Text style={styles.subtitle} numberOfLines={2}>
              {subtitle}
            </Text>
          ) : null}
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
    zIndex: 0, // behind contentLayer (z=1) so sheet rounded corners show
  },
  banner: {
    width: "100%",
    height: "100%",
  },
  // Row at the bottom-left of the banner — avatar + name side by side
  bottomRow: {
    position: "absolute",
    bottom: 18,
    left: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  // Rounded square with white border + shadow — matches reference image
  avatarWrapper: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_RADIUS,
    borderWidth: 1,
    borderColor: "#2c681fff",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  // Name text — white, bold, with text shadow for readability over any banner
  name: {
    color: "#ffffff",
    fontSize: 15,
    fontFamily: "Poppins-Bold",
    letterSpacing: 0.2,
    textShadowColor: "rgba(0,0,0,0.45)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  // Subtitle — lighter white text below the name
  subtitle: {
    color: "rgba(255, 255, 255, 0.88)",
    fontSize: 11.5,
    fontFamily: "Poppins-Medium",
    marginTop: 2,
    textShadowColor: "rgba(0,0,0,0.4)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});
