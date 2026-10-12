import { Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

// ─── Types ────────────────────────────────────────────────────────────────────

interface StatBoxProps {
  label: string;
  icon: string;
  value: number;
  color: string;
}

interface TrackedPrayersCardProps {
  /** Prayers prayed on time */
  onTime?: number;
  /** Prayers prayed late */
  late?: number;
  /** Prayers missed */
  missed?: number;
  /** Qaza prayers */
  qaza?: number;
  /** Total prayers in the period (e.g. 5 for one day, 35 for a week) */
  total?: number;
}

// ─── Circular Progress ────────────────────────────────────────────────────────

const RING_SIZE = 110;
const STROKE = 10;
const RADIUS = (RING_SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function CircularProgress({
  prayed,
  total,
}: {
  prayed: number;
  total: number;
}) {
  const progress = total > 0 ? Math.min(prayed / total, 1) : 0;
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  return (
    <View className="items-center justify-center">
      <Svg
        width={RING_SIZE}
        height={RING_SIZE}
        style={{ transform: [{ rotate: "-90deg" }] }}
      >
        {/* Track */}
        <Circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RADIUS}
          stroke="#E8F5E9"
          strokeWidth={STROKE}
          fill="none"
        />
        {/* Progress arc */}
        <Circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RADIUS}
          stroke="#2D6A4F"
          strokeWidth={STROKE}
          fill="none"
          strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </Svg>

      {/* Centre label */}
      <View
        style={{
          position: "absolute",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text className="font-poppins-bold text-[20px] text-[#1A3C34]">
          {prayed}
          <Text className="font-poppins-semibold text-[14px] text-[#1A3C34]">
            /{total}
          </Text>
        </Text>
        <Text className="font-poppins text-[9px] text-[#6B6B6B]">
          tracked
        </Text>
      </View>
    </View>
  );
}

// ─── Stat Box ─────────────────────────────────────────────────────────────────

function StatBox({ label, icon, value, color }: StatBoxProps) {
  return (
    <View className="flex-1 items-start rounded-xl bg-[#F8FAF8] px-3 py-2.5">
      <Text style={{ fontSize: 16 }}>{icon}</Text>
      <Text className="font-poppins-bold mt-1 text-[18px] text-[#1A3C34]">
        {value}
      </Text>
      <Text className="font-poppins text-[11px]" style={{ color }}>
        {label}
      </Text>
    </View>
  );
}

// ─── Main Card ────────────────────────────────────────────────────────────────

export function TrackedPrayersCard({
  onTime = 0,
  late = 0,
  missed = 0,
  qaza = 0,
  total = 35,
}: TrackedPrayersCardProps) {
  const prayed = onTime + late;

  return (
    <View
      className="mx-4 mt-4 rounded-2xl bg-white p-4"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
      }}
    >
      {/* Header */}
      <View className="mb-4 flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          {/* Mosque icon */}
          <View className="h-9 w-9 items-center justify-center rounded-xl bg-[#D8F3DC]">
            <Text style={{ fontSize: 18 }}>🕌</Text>
          </View>

          <View>
            <Text className="font-poppins-bold text-[15px] text-[#1A3C34]">
              Tracked Prayers
            </Text>
            <Text className="font-poppins text-[11px] text-[#6B6B6B]">
              Your prayer progress this week
            </Text>
          </View>
        </View>

        {/* Top-right track icon */}
        <View className="h-8 w-8 items-center justify-center rounded-lg bg-[#F3F4EC]">
          <Text style={{ fontSize: 15 }}>📿</Text>
        </View>
      </View>

      {/* Body */}
      <View className="flex-row items-center gap-3">
        {/* Circular progress ring */}
        <CircularProgress prayed={prayed} total={total} />

        {/* 2x2 stat grid */}
        <View className="flex-1 gap-2">
          <View className="flex-row gap-2">
            <StatBox label="On Time" icon="✅" value={onTime} color="#2D6A4F" />
            <StatBox label="Late" icon="🕐" value={late} color="#D4930A" />
          </View>
          <View className="flex-row gap-2">
            <StatBox label="Missed" icon="❌" value={missed} color="#C0392B" />
            <StatBox label="Qaza" icon="🌙" value={qaza} color="#7B5EA7" />
          </View>
        </View>
      </View>
    </View>
  );
}