import { View } from "react-native";

import { Screen } from "@/components/Screen";
import { ScreenTitle } from "@/components/ScreenTitle";

export default function TrackerScreen() {
  return (
    <Screen>
      <View className="flex-1 px-6 pt-8">
        <ScreenTitle
          title="Tracker"
          subtitle="Salary tracking will be added here next."
        />
      </View>
    </Screen>
  );
}
