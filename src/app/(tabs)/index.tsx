import { View } from "react-native";

import { Screen } from "@/components/Screen";
import { ScreenTitle } from "@/components/ScreenTitle";

export default function HomeScreen() {
  return (
    <Screen>
      <View className="flex-1 px-6 pt-8">
        <ScreenTitle
          title="Welcome to Salah Tracker"
          subtitle="Your simple starting point for tracking your salary."
        />
      </View>
    </Screen>
  );
}
