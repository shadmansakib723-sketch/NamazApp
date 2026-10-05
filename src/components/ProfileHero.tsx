import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProfileHeroProps {
  /** URI string for a remote avatar (e.g. Google profile photo). */
  avatarUri?: string | null;
  /** Called when the settings gear icon is tapped. */
  onSettingsPress?: () => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const BANNER = require("../../assets/llll.png");
const DEFAULT_AVATAR = require("../../assets/images.png");

const AVATAR_SIZE = 96;

/** How many pixels the avatar overlaps below the banner. */
export const PROFILE_HERO_OVERLAP = AVATAR_SIZE / 2;

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * ProfileHero
 *
 * Renders the full-width banner image (llll.png) anchored to the top of the
 * screen with a circular avatar that half-overlaps the banner's bottom edge.
 *
 * Layout strategy
 * ───────────────
 * The banner sits at the top edge of the screen (no safe-area padding) to
 * fill edge-to-edge. The avatar is absolutely positioned at `bottom: 0` so
 * it sits centred at the banner / content boundary. The parent adds
 * `paddingBottom: PROFILE_HERO_OVERLAP` to leave room for the overlap.
 *
 * The exported constant `PROFILE_HERO_OVERLAP` lets the parent screen push
 * its content down by the exact overlap amount — no magic numbers duplicated.
 */
export function ProfileHero({ avatarUri, onSettingsPress }: ProfileHeroProps) {
  const insets = useSafeAreaInsets();
  const avatarSource = avatarUri ? { uri: avatarUri } : DEFAULT_AVATAR;

  return (
    <View style={styles.wrapper}>
      {/* Full-width banner image */}
      <Image source={BANNER} style={styles.banner} resizeMode="cover" />

      {/* Settings icon — top-right, clears status bar via safe area inset */}
      {onSettingsPress ? (
        <TouchableOpacity
          onPress={onSettingsPress}
          activeOpacity={0.7}
          style={[styles.settingsButton, { top: insets.top + 8 }]}
        >
          <Text className="text-2xl text-white">⚙️</Text>
        </TouchableOpacity>
      ) : null}

      {/* Circular avatar — centred, half-overlapping the banner bottom */}
      <View style={styles.avatarRing}>
        <Image source={avatarSource} style={styles.avatar} resizeMode="cover" />
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  wrapper: {
    paddingBottom: PROFILE_HERO_OVERLAP,
    backgroundColor: "transparent",
  },
  banner: {
    width: "100%",
    height: 190,
  },
  // Dynamic top offset (status bar height) — must use StyleSheet (runtime value)
  settingsButton: {
    position: "absolute",
    right: 16,
    padding: 6,
  },
  avatarRing: {
    position: "absolute",
    bottom: 0,
    alignSelf: "center",
    width: AVATAR_SIZE + 8,   // +8 = 4 px white border on each side
    height: AVATAR_SIZE + 8,
    borderRadius: (AVATAR_SIZE + 8) / 2,
    borderWidth: 4,
    borderColor: "#ffffff",
    overflow: "hidden",
    // Elevation / shadow so the ring lifts off the banner
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
});
