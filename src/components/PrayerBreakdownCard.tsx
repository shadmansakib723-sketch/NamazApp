import { Text, View } from "react-native";
import type { SvgProps } from "react-native-svg";

import AsrIcon from "../../assets/asr.svg";
import DhuhrIcon from "../../assets/dhuhr.svg";
import FajrIcon from "../../assets/fajr.svg";
import IshaIcon from "../../assets/isha.svg";
import MaghribIcon from "../../assets/maghrib.svg";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PrayerRowProps {
  label: string;
  Icon: React.FC<SvgProps>;
  prayed: number;
  total: number;
}

interface PrayerBreakdownCardProps {
  fajr?: number;
  dhuhr?: number;
  asr?: number;
  maghrib?: number;
  isha?: number;
  /** Total possible per prayer in the period (e.g. 7 for a week) */
  total?: number;
  onViewDetails?: () => void;
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────

function ProgressBar({ progress }: { progress: number }) {
  const clamped = Math.min(Math.max(progress, 0), 1);

  return (
    <View className="h-2.5 flex-1 overflow-hidden rounded-full bg-[#E8F5E9]">
      <View
        className="h-full rounded-full bg-[#2D6A4F]"
        style={{ width: `${clamped * 100}%` }}
      />
    </View>
  );
}

// ─── Prayer Row ───────────────────────────────────────────────────────────────

function PrayerRow({ label, Icon, prayed, total }: PrayerRowProps) {
  const progress = total > 0 ? prayed / total : 0;

  return (
    <View className="flex-row items-center gap-3 py-2.5">
      {/* Icon */}
      <View className="h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-[#F3F4EC]">
        <Icon width={28} height={28} />
      </View>

      {/* Name */}
      <Text className="font-poppins-semibold w-[62px] text-[13px] text-[#1A3C34]">
        {label}
      </Text>

      {/* Count */}
      <Text className="font-poppins text-[12px] text-[#6B6B6B]">
        {prayed}/{total}
      </Text>

      {/* Progress bar */}
      <ProgressBar progress={progress} />

      {/* Chevron */}
      <Text className="font-poppins-semibold text-[18px] text-[#1A3C34]">›</Text>
    </View>
  );
}

// ─── Main Card ────────────────────────────────────────────────────────────────

export function PrayerBreakdownCard({
  fajr = 0,
  dhuhr = 0,
  asr = 0,
  maghrib = 0,
  isha = 0,
  total = 7,
  onViewDetails,
}: PrayerBreakdownCardProps) {
  const rows: PrayerRowProps[] = [
    { label: "Fajr",    Icon: FajrIcon,    prayed: fajr,    total },
    { label: "Dhuhr",   Icon: DhuhrIcon,   prayed: dhuhr,   total },
    { label: "Asr",     Icon: AsrIcon,     prayed: asr,     total },
    { label: "Maghrib", Icon: MaghribIcon, prayed: maghrib, total },
    { label: "Isha",    Icon: IshaIcon,    prayed: isha,    total },
  ];

  return (
    <View
      className="mx-4 mt-3 rounded-2xl bg-white p-4"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
      }}
    >
      {/* Header */}
      <View className="mb-1 flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <View className="h-9 w-9 items-center justify-center rounded-xl bg-[#D8F3DC]">
            <Text style={{ fontSize: 18 }}>🕌</Text>
          </View>
          <Text className="font-poppins-bold text-[15px] text-[#1A3C34]">
            Prayer Breakdown
          </Text>
        </View>

        <Text
          className="font-poppins-semibold text-[13px] text-[#2D6A4F]"
          onPress={onViewDetails}
        >
          View Details ›
        </Text>
      </View>

      {/* Divider */}
      <View className="mb-1 h-px bg-[#F0F0F0]" />

      {/* Prayer rows */}
      {rows.map((row, index) => (
        <View key={row.label}>
          <PrayerRow {...row} />
          {index < rows.length - 1 && (
            <View className="h-px bg-[#F8FAF8]" />
          )}
        </View>
      ))}
    </View>
  );
}