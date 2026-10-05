import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { ProfileHero, PROFILE_HERO_OVERLAP } from "@/components/ProfileHero";
import { signInWithGoogle, signOut, statusCodes } from "@/lib/googleAuth";
import { useAuthStore } from "@/store/useAuthStore";

/**
 * ProfileScreen
 *
 * Layout (top → bottom):
 *
 *   [ProfileHero]   full-width banner + overlapping circular avatar
 *   [body]          name, email (signed-in only), sign-in / sign-out button
 *
 * Auth states
 * ───────────
 * Signed out → default kitten avatar, name "Cocoa", Sign in with Google button
 * Signed in  → Google profile photo, real name + email, Sign out button
 */
export default function ProfileScreen() {
  const { user, isLoading, setUser, setLoading } = useAuthStore();

  // ─── Handlers ───────────────────────────────────────────────────────────────

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

  async function handleSignOut() {
    setLoading(true);
    try {
      await signOut();
      setUser(null);
    } catch {
      Alert.alert("Sign-out failed", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Banner + circular avatar */}
      <ProfileHero avatarUri={user?.avatarUrl} />

      {/* Name, email, action button */}
      <View style={styles.body} className="items-center px-6">
        <Text className="mt-2 text-2xl font-bold text-slate-900">
          {user ? user.name : "Cocoa"}
        </Text>

        {user ? (
          <Text className="mt-1 text-sm text-slate-500">{user.email}</Text>
        ) : null}

        <TouchableOpacity
          onPress={user ? handleSignOut : handleSignIn}
          disabled={isLoading}
          activeOpacity={0.8}
          style={styles.button}
          className="mt-6 flex-row items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white"
        >
          {isLoading ? (
            <ActivityIndicator color="#64748b" />
          ) : user ? (
            <Text className="text-base font-semibold text-slate-700">Sign out</Text>
          ) : (
            <>
              <Text className="text-xl">🔵</Text>
              <Text className="text-base font-semibold text-slate-800">
                Sign in with Google
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContent: {
    flexGrow: 1,
  },
  body: {
    paddingTop: PROFILE_HERO_OVERLAP + 8,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    minWidth: 220,
  },
});
