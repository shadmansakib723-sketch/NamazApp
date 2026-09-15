import { View } from "react-native";

import { Screen } from "@/components/Screen";
import { ScreenTitle } from "@/components/ScreenTitle";

export default function ProfileScreen() {
  return (
    <Screen>
      <View className="flex-1 px-6 pt-8">
        <ScreenTitle
          title="Profile"
          subtitle="Account and profile settings will come here later."
        />
      </View>
    </Screen>
  );
}
