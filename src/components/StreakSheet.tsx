import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import FireIcon from "../../assets/fire.svg";

interface Props {
  visible: boolean;
  currentStreak: number;
  highestStreak: number;
  onClose: () => void;
}

function getMotivationalMessage(streak: number): string {
  if (streak === 0) return "Start your streak today — pray all 5 prayers! 🌙";
  if (streak < 3) return "Great start! Keep going and build the habit. 💪";
  if (streak < 7) return "You're on a roll! Stay consistent. 🔥";
  if (streak < 14) return "One week strong! Mashallah, keep it up! ⭐";
  if (streak < 30) return "Two weeks of consistency — you're inspiring! 🌟";
  return "A month of dedication — truly remarkable! 🏆";
}

/** Bottom sheet showing the user's current and highest prayer streak. */
export function StreakSheet({
  visible,
  currentStreak,
  highestStreak,
  onClose,
}: Props) {
  const stats = [
    { emoji: "🔥", value: currentStreak, label: "Current\nStreak", bg: "bg-orange-50" },
    { emoji: "🏆", value: highestStreak, label: "Highest\nStreak", bg: "bg-yellow-50" },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* Tap outside to close */}
      <Pressable className="flex-1" onPress={onClose} />

      <View className="rounded-t-3xl bg-white px-5 pb-10 pt-3" style={styles.sheetShadow}>
        <View className="mb-3 h-1 w-10 self-center rounded-full bg-gray-300" />

        <Pressable
          className="absolute right-5 top-4 h-7 w-7 items-center justify-center rounded-full bg-gray-100"
          onPress={onClose}
          hitSlop={12}
        >
          <Text className="text-xs font-bold text-gray-500">✕</Text>
        </Pressable>

        <View className="mb-5 mt-2 flex-row items-center">
          <View className="mr-3 h-14 w-14 items-center justify-center rounded-full bg-orange-50">
            <FireIcon width={36} height={36} />
          </View>
          <View className="flex-1">
            <Text className="font-poppins-semibold text-xl text-gray-900">Prayer Streak</Text>
            <Text className="font-poppins text-[13px] text-gray-500">
              Your consistency at a glance
            </Text>
          </View>
        </View>

        <View className="mb-5 flex-row gap-3">
          {stats.map(({ emoji, value, label, bg }) => (
            <View key={label} className={`flex-1 items-center rounded-2xl p-4 ${bg}`}>
              <Text className="mb-1.5 text-2xl">{emoji}</Text>
              <Text className="font-poppins-semibold text-4xl text-gray-900">{value}</Text>
              <Text className="mt-1 text-center font-poppins text-xs text-gray-500">{label}</Text>
              <Text className="mt-0.5 font-poppins text-[11px] text-gray-400">days</Text>
            </View>
          ))}
        </View>

        <View className="mb-4 h-px bg-gray-100" />

        <View className="mb-3.5 rounded-xl bg-green-50 p-3.5">
          <Text className="text-center font-poppins text-sm text-green-800">
            {getMotivationalMessage(currentStreak)}
          </Text>
        </View>

        <Text className="text-center font-poppins text-[11px] text-gray-400">
          A streak is maintained by completing all 5 prayers each day.
        </Text>
      </View>
    </Modal>
  );
}

// Shadow needs platform-specific props, so it stays in StyleSheet (per agent.md)
const styles = StyleSheet.create({
  sheetShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 12,
  },
});