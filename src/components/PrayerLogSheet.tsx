import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import type { SvgProps } from "react-native-svg";

import type { PrayerKey, PrayerStatus } from "@/types/prayer";

import AsrIcon from "../../assets/asr.svg";
import DhuhrIcon from "../../assets/dhuhr.svg";
import FajrIcon from "../../assets/fajr.svg";
import IshaIcon from "../../assets/isha.svg";
import MaghribIcon from "../../assets/maghrib.svg";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Option {
  status: Exclude<PrayerStatus, null>;
  label: string;
  subtitle: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  rowBg: string;
}

interface Props {
  visible: boolean;
  prayerKey: PrayerKey | null;
  prayerLabel: string;
  onSelect: (status: Exclude<PrayerStatus, null>) => void;
  onClose: () => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PRAYER_ICONS: Record<PrayerKey, React.FC<SvgProps>> = {
  fajr: FajrIcon,
  dhuhr: DhuhrIcon,
  asr: AsrIcon,
  maghrib: MaghribIcon,
  isha: IshaIcon,
};

const OPTIONS: Option[] = [
  {
    status: "on_time",
    label: "Prayed on time",
    subtitle: "Completed within its prayer time",
    icon: "✓",
    iconBg: "#22C55E",
    iconColor: "#fff",
    rowBg: "#F0FDF4",
  },
  {
    status: "late",
    label: "Prayed late",
    subtitle: "Prayed after its time ended",
    icon: "⏰",
    iconBg: "#F59E0B",
    iconColor: "#fff",
    rowBg: "#FFFBEB",
  },
  {
    status: "excused",
    label: "Excused",
    subtitle: "Not applicable due to a valid religious exemption",
    icon: "✦",
    iconBg: "#6366F1",
    iconColor: "#fff",
    rowBg: "#EEF2FF",
  },
  {
    status: "missed",
    label: "Missed",
    subtitle: "Prayer was not performed",
    icon: "✕",
    iconBg: "#EF4444",
    iconColor: "#fff",
    rowBg: "#FEF2F2",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * PrayerLogSheet
 *
 * A bottom-sheet modal (no overlay) that lets the user log their prayer status.
 * Uses React Native Modal with no backgroundColour so the screen beneath stays
 * fully visible — no dim overlay.
 */
export function PrayerLogSheet({
  visible,
  prayerKey,
  prayerLabel,
  onSelect,
  onClose,
}: Props) {
  const Icon = prayerKey ? PRAYER_ICONS[prayerKey] : null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* Invisible full-screen touch target to close on tap outside */}
      <Pressable style={styles.tapOutside} onPress={onClose} />

      {/* Sheet */}
      <View style={styles.sheet}>
        {/* Drag handle */}
        <View style={styles.handle} />

        {/* Close button */}
        <Pressable style={styles.closeBtn} onPress={onClose} hitSlop={12}>
          <Text style={styles.closeBtnText}>✕</Text>
        </Pressable>

        {/* Prayer header: icon + name + subtitle */}
        <View style={styles.header}>
          {Icon && (
            <View style={styles.iconCircle}>
              <Icon width={48} height={48} />
            </View>
          )}
          <View style={styles.headerText}>
            <Text style={styles.prayerName}>{prayerLabel}</Text>
            <Text style={styles.prayerSubtitle}>Today&apos;s prayer</Text>
          </View>
        </View>

        {/* Question */}
        <Text style={styles.question}>
          How did you perform your {prayerLabel} prayer?
        </Text>

        {/* Options */}
        <View style={styles.options}>
          {OPTIONS.map((opt) => (
            <Pressable
              key={opt.status}
              style={[styles.optionRow, { backgroundColor: opt.rowBg }]}
              onPress={() => onSelect(opt.status)}
            >
              {/* Left icon */}
              <View
                style={[styles.optionIcon, { backgroundColor: opt.iconBg }]}
              >
                <Text style={[styles.optionIconText, { color: opt.iconColor }]}>
                  {opt.icon}
                </Text>
              </View>

              {/* Text */}
              <View style={styles.optionTextBlock}>
                <Text style={styles.optionLabel}>{opt.label}</Text>
                <Text style={styles.optionSubtitle}>{opt.subtitle}</Text>
              </View>

              {/* Radio circle */}
              <View style={styles.radio} />
            </Pressable>
          ))}
        </View>
      </View>
    </Modal>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // Invisible area above the sheet — closes on tap
  tapOutside: {
    flex: 1,
  },

  // The white sheet panel
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 36,
    paddingTop: 12,
    // iOS shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    // Android elevation
    elevation: 12,
  },

  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#D1D5DB",
    alignSelf: "center",
    marginBottom: 12,
  },

  closeBtn: {
    position: "absolute",
    top: 16,
    right: 20,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  closeBtnText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "700",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: "hidden",
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  prayerName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    fontFamily: "Poppins_600SemiBold",
  },
  prayerSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
    fontFamily: "Poppins_400Regular",
  },

  question: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 14,
    fontFamily: "Poppins_600SemiBold",
  },

  options: {
    gap: 10,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    padding: 12,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  optionIconText: {
    fontSize: 16,
    fontWeight: "700",
  },
  optionTextBlock: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    fontFamily: "Poppins_600SemiBold",
  },
  optionSubtitle: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 2,
    fontFamily: "Poppins_400Regular",
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
    backgroundColor: "#fff",
    marginLeft: 8,
  },
});
