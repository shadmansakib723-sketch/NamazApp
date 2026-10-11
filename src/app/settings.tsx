import { ActivityIndicator, Alert, Linking, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { signOut } from "@/lib/googleAuth";
import { useAuthStore } from "@/store/useAuthStore";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SettingsRowProps {
  label: string;
  onPress: () => void;
  destructive?: boolean;
  isLoading?: boolean;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SettingsRow({ label, onPress, destructive = false, isLoading = false }: SettingsRowProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      disabled={isLoading}
      className="flex-row items-center justify-between px-5 py-4 border-b border-slate-100"
    >
      {isLoading ? (
        <ActivityIndicator color="#DC2626" />
      ) : (
        <Text className={`text-base ${destructive ? "text-red-600 font-poppins-semibold" : "text-slate-800 font-poppins-medium"}`}>
          {label}
        </Text>
      )}
      {!isLoading && (
        <Text className="text-lg text-slate-400 font-poppins">›</Text>
      )}
    </TouchableOpacity>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

/**
 * SettingsScreen
 *
 * Presented as a modal (slides up from the bottom).
 * Contains app-level links: Privacy Policy and Terms & Conditions.
 * When signed in, also shows a Sign Out option.
 */
export default function SettingsScreen() {
  const router = useRouter();
  const { user, isLoading, setUser, setLoading } = useAuthStore();

  async function handleSignOut() {
    setLoading(true);
    try {
      await signOut();
      setUser(null);
      router.back();
    } catch {
      Alert.alert("Sign-out failed", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

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
        <Text className="text-xl font-poppins-bold text-slate-900">Settings</Text>
      </View>

      {/* ── General Rows ── */}
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

      {/* ── Account Rows (only when signed in) ── */}
      {user && (
        <View className="mt-4 mx-4 rounded-2xl bg-white overflow-hidden border border-slate-100">
          <SettingsRow
            label="Sign Out"
            onPress={handleSignOut}
            destructive
            isLoading={isLoading}
          />
        </View>
      )}
    </SafeAreaView>
  );
}
