import { Text, View } from "react-native";

import { Screen } from "@/components/Screen";

export default function TrackerScreen() {
  return (
    <Screen>
      <View className="flex-1 px-6 pt-8">
        <Text className="text-3xl font-bold text-slate-950">Tracker</Text>
        <Text className="mt-2 text-base text-slate-500">
          Salary tracking will be added here next.
        </Text>
      </View>
    </Screen>
  );
}
