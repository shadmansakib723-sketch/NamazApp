import { StyleSheet, View } from "react-native";
import { Text } from "react-native";

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * StatsBar
 *
 * A horizontal row of three stat tiles: Streak, Friends, Points.
 * Matches the design reference image — rounded pill container,
 * soft icon bubbles, green/gold accent colours.
 *
 * Pure UI — no logic or props needed for now.
 * Styled with NativeWind classes; StyleSheet used only for
 * platform shadow (iOS/Android) and the exact icon font sizes.
 */
export function StatsBar() {
  return (
    <View style={styles.container} className="mx-4 flex-row rounded-3xl bg-surface px-3 py-3">
      {/* ── Streak ─────────────────────────────────────────────────── */}
      <StatTile
        iconBg="bg-orange-100"
        icon="🔥"
        value="5 Days"
        label="Streak"
        sublabel="Keep going!"
      />

      {/* ── Separator ──────────────────────────────────────────────── */}
      <View style={styles.separator} />

      {/* ── Friends ────────────────────────────────────────────────── */}
      <StatTile
        iconBg="bg-green-100"
        icon="👥"
        value="3 / 7"
        label="Friends"
        sublabel="prayed today"
      />

      {/* ── Separator ──────────────────────────────────────────────── */}
      <View style={styles.separator} />

      {/* ── Points ─────────────────────────────────────────────────── */}
      <StatTile
        iconBg="bg-yellow-100"
        icon="⭐"
        value="320"
        label="Points"
        sublabel="Earn & unlock"
      />
    </View>
  );
}

// ─── StatTile ─────────────────────────────────────────────────────────────────

interface StatTileProps {
  /** Background colour class for the icon bubble */
  iconBg: string;
  /** Emoji icon */
  icon: string;
  /** Big number / primary value */
  value: string;
  /** Top-row label */
  label: string;
  /** Smaller sub-label below the value */
  sublabel: string;
}

function StatTile({ iconBg, icon, value, label, sublabel }: StatTileProps) {
  return (
    <View className="flex-1 flex-row items-center gap-x-2 px-1">
      {/* Icon bubble */}
      <View
        className={`h-11 w-11 items-center justify-center rounded-2xl ${iconBg}`}
      >
        <Text style={styles.icon}>{icon}</Text>
      </View>

      {/* Text block */}
      <View className="flex-1">
        <Text className="font-poppins text-xs text-text-secondary">{label}</Text>
        <Text className="font-poppins-bold text-base text-brand-dark leading-tight">
          {value}
        </Text>
        <Text className="font-poppins text-xs text-text-muted">{sublabel}</Text>
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    // Shadow — iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    // Shadow — Android
    elevation: 3,
  },
  separator: {
    width: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 6,
    alignSelf: "stretch",
  },
  icon: {
    fontSize: 22,
  },
});
