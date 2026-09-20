import { Image, ImageBackground, Pressable, StyleSheet, View } from "react-native";
import { Text } from "react-native";
import { useState } from "react";

// ─── Assets ───────────────────────────────────────────────────────────────────

const BG = require("../../assets/prayer_tap_bg.jpg");

const PRAYER_IMAGES = {
  fajr: require("../../assets/prayer_fajr.jpg"),
  dhuhr: require("../../assets/prayer_dhuhr.jpg"),
  asr: require("../../assets/prayer_asr.jpg"),
  maghrib: require("../../assets/prayer_maghrib.jpg"),
  isha: require("../../assets/prayer_isha.jpg"),
} as const;

// ─── Types ────────────────────────────────────────────────────────────────────

type PrayerKey = keyof typeof PRAYER_IMAGES;

interface Prayer {
  key: PrayerKey;
  label: string;
  /** Accent color for the active tile border and checkmark — matched to each prayer's illustration palette */
  accentColor: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const PRAYERS: Prayer[] = [
  { key: "fajr", label: "Fajr", accentColor: "#53b458ff" }, // dawn blue-grey
  { key: "dhuhr", label: "Dhuhr", accentColor: "#3B90C8" }, // sky blue
  { key: "asr", label: "Asr", accentColor: "#D4924A" }, // warm gold
  { key: "maghrib", label: "Maghrib", accentColor: "#9B4FA8" }, // deep violet
  { key: "isha", label: "Isha", accentColor: "#1E3A6E" }, // midnight navy
];

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * PrayerTapCard
 *
 * Displays a green illustrated card ("Tap when you pray") with 5 tappable
 * prayer tiles. Each tile shows a circular watercolour scene, a label, and
 * a checkbox indicator.
 *
 * State  — local toggle only (UI demo). No persistence.
 * Styling — NativeWind for responsive margins/layout; StyleSheet for
 *           dynamic colors and platform-normalized elevation/shadow.
 */
export function PrayerTapCard() {
  // Set of prayed prayer keys (toggled on/off)
  const [prayed, setPrayed] = useState<Set<PrayerKey>>(new Set());

  function toggle(key: PrayerKey) {
    setPrayed((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  return (
    <View style={styles.shadowContainer} className="mx-4 mt-3">
      <View style={styles.cardContainer}>
        <ImageBackground
          source={BG}
          style={styles.bg}
          imageStyle={styles.bgImage}
          resizeMode="stretch"
        >
          {/* ── Tile row ─────────────────────────────────────────────── */}
          <View style={styles.row}>
            {PRAYERS.map((prayer) => {
              const isDone = prayed.has(prayer.key);
              return (
                <Pressable
                  key={prayer.key}
                  style={[
                    styles.tile,
                    isDone && {
                      borderColor: prayer.accentColor,
                      borderWidth: 2.5,
                    },
                  ]}
                  onPress={() => toggle(prayer.key)}
                  accessibilityLabel={`Mark ${prayer.label} as prayed`}
                  accessibilityRole="button"
                >
                  {/* Circular prayer illustration */}
                  <Image
                    source={PRAYER_IMAGES[prayer.key]}
                    style={styles.circleImage}
                    resizeMode="cover"
                  />

                  {/* Prayer name */}
                  <Text style={styles.label}>{prayer.label}</Text>

                  {/* Checkbox indicator */}
                  <View
                    style={[
                      styles.checkbox,
                      isDone && {
                        backgroundColor: prayer.accentColor,
                        borderColor: prayer.accentColor,
                      },
                    ]}
                  >
                    {isDone && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                </Pressable>
              );
            })}
          </View>
        </ImageBackground>
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // Outer container: handles shadow & elevation ONLY (no overflow: 'hidden')
  shadowContainer: {
    borderRadius: 20,
    backgroundColor: "#1F4430", // Matches the green card to give Android a solid outline
    // Shadow — iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    // Shadow — Android
    elevation: 3,
  },
  // Inner container: handles rounded corner clipping (no elevation)
  cardContainer: {
    borderRadius: 20,
    overflow: "hidden",
  },
  bg: {
    width: "100%",
    paddingTop: 52, // Space reserved for the top header text and bubble in the image
    paddingBottom: 14,
    paddingHorizontal: 8,
  },
  bgImage: {
    borderRadius: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  tile: {
    flex: 1,
    marginHorizontal: 3,
    backgroundColor: "#FFFFF5",
    borderRadius: 16,
    alignItems: "center",
    paddingTop: 8,
    paddingBottom: 10,
    borderColor: "transparent",
    borderWidth: 2.5,
  },
  circleImage: {
    width: 50,
    height: 50,
    borderRadius: 25, // perfect circle
    marginBottom: 6,
  },
  label: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 11,
    color: "#1A3C34",
    marginBottom: 6,
    textAlign: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#CCCCCC",
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  checkmark: {
    fontSize: 11,
    color: "#FFFFFF",
    lineHeight: 14,
  },
});
