import { Linking, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SettingsRowProps {
  label: string;
  onPress: () => void;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SettingsRow({ label, onPress }: SettingsRowProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="flex-row items-center justify-between px-5 py-4 border-b border-slate-100"
    >
      <Text className="text-base text-slate-800">{label}</Text>
      <Text className="text-lg text-slate-400">›</Text>
    </TouchableOpacity>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

/**
 * SettingsScreen
 *
 * Presented as a modal (slides up from the bottom).
 * Contains app-level links: Privacy Policy and Terms & Conditions.
 */
export default function SettingsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8fafc" }} edges={["top", "left", "right"]}>
      {/* ── Header ── */}
      <View className="flex-row items-center px-5 py-4 border-b border-slate-100 bg-white">
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          className="mr-4"
        >
          <Text className="text-2xl text-slate-700">✕</Text>
        </TouchableOpacity>
        <Text className="text-xl font-bold text-slate-900">Settings</Text>
      </View>

      {/* ── Rows ── */}
      <View className="mt-6 mx-4 rounded-2xl bg-white overflow-hidden border border-slate-100">
        <SettingsRow
          label="Privacy Policy"
          onPress={() => Linking.openURL("https://example.com/privacy")}
        />
        <SettingsRow
          label="Terms and Conditions"
          onPress={() => Linking.openURL("https://example.com/terms")}
        />
      </View>
    </SafeAreaView>
  );
}
