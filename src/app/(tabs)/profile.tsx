import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

import { useRouter } from "expo-router";

import { ProfileCreateCard } from "@/components/ProfileCreateCard";
import { ProfileHero } from "@/components/ProfileHero";
import { ProfilePeriodSelector } from "@/components/ProfilePeriodSelector";
import { signInWithGoogle, statusCodes } from "@/lib/googleAuth";
import { useAuthStore } from "@/store/useAuthStore";

/**
 * ProfileScreen
 *
 * Layout:
 *   [ProfileHero]    banner + avatar + name/subtitle  (zIndex: 0, never scrolls)
 *   [settingsButton]                                   (zIndex: 2)
 *   [contentLayer]                                     (zIndex: 1)
 *     ├─ spacer
 *     └─ sheet
 *          ├─ <ProfileCreateCard />   when signed out
 *          └─ empty view              when signed in (sign-out is in Settings)
 */
export default function ProfileScreen() {
  const { user, isLoading, setUser, setLoading } = useAuthStore();
  const router = useRouter();
  const { width: screenWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const heroHeight = screenWidth * (3 / 4);

  // ─── Handlers ─────────────────────────────────────────────────────────────

  async function handleSignIn() {
    setLoading(true);
    try {
      const authUser = await signInWithGoogle();
      setUser(authUser);
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        "code" in error &&
        (error as { code: string }).code === statusCodes.SIGN_IN_CANCELLED
      ) {
        // user cancelled — do nothing
      } else {
        Alert.alert("Sign-in failed", "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
      {/* Banner + avatar + name */}
      <ProfileHero
        avatarUri={user?.avatarUrl}
        name={user ? user.name : "Guest"}
        subtitle={user ? user.email : "Sign in to get the best experience"}
        height={heroHeight}
      />

      {/* Settings — above everything */}
      <TouchableOpacity
        onPress={() => router.push("/settings")}
        activeOpacity={0.7}
        style={[styles.settingsButton, { top: insets.top + 8 }]}
      >
        <View style={styles.settingsCircle}>
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <Path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1ZM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
              fill="#1b4332"
            />
          </Svg>
        </View>
      </TouchableOpacity>

      {/* Content layer */}
      <View style={styles.contentLayer}>
        <View style={{ height: heroHeight - 42 }} />

        <ScrollView
          style={styles.sheet}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {user ? (
            // Signed in — period selector scaffolding
            <ProfilePeriodSelector />
          ) : (
            // Not signed in
            <ProfileCreateCard isLoading={isLoading} onCreateProfile={handleSignIn} onGoogleSignIn={handleSignIn} />
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  settingsButton: {
    position: "absolute",
    right: 16,
    zIndex: 2,
  },
  settingsCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 4,
  },
  contentLayer: {
    flex: 1,
    zIndex: 1,
  },
  sheet: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 13,
    borderTopRightRadius: 13,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 32,
  },

});
