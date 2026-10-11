import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import SeedlingIcon from "../../assets/seedling.svg";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProfileCreateCardProps {
  isLoading: boolean;
  onCreateProfile: () => void;
  onGoogleSignIn: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * ProfileCreateCard
 *
 * Shown inside the bottom sheet when the user is not signed in.
 * Includes the seedling illustration, a disabled "Create Profile" button,
 * an OR divider, and a "Sign in with Google" button.
 */
export function ProfileCreateCard({ isLoading, onCreateProfile, onGoogleSignIn }: ProfileCreateCardProps) {
  return (
    <View className="items-center px-6 pt-8 pb-8">
      {/* Seedling illustration */}
      <SeedlingIcon width={120} height={100} />

      {/* Title */}
      <Text className="mt-4 text-[22px] font-poppins-bold text-slate-900 text-center tracking-tight">
        Create Your Profile
      </Text>

      {/* Subtitle */}
      <Text className="mt-2 text-sm font-poppins text-slate-500 text-center leading-5">
        Start your journey by creating{"\n"}your profile. Let us know your name!
      </Text>

      {/* Create Profile */}
      <TouchableOpacity
        onPress={onCreateProfile}
        disabled={isLoading}
        activeOpacity={0.8}
        style={styles.createBtn}
        className="mt-6 w-full flex-row items-center justify-center"
      >
        {isLoading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.createBtnText}>Create Profile  →</Text>
        )}
      </TouchableOpacity>

      {/* OR divider */}
      <View className="flex-row items-center w-full my-5 gap-2">
        <View className="flex-1 h-px bg-slate-200" />
        <Text className="text-xs font-poppins-semibold text-slate-400 tracking-widest">OR</Text>
        <View className="flex-1 h-px bg-slate-200" />
      </View>

      {/* Sign in with Google */}
      <TouchableOpacity
        onPress={onGoogleSignIn}
        disabled={isLoading}
        activeOpacity={0.85}
        style={styles.googleBtn}
        className="w-full flex-row items-center justify-center"
      >
        {isLoading ? (
          <ActivityIndicator color="#1D4ED8" />
        ) : (
          <Text style={styles.googleBtnText}>Sign in with Google</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
// StyleSheet used only for shadows and border properties NativeWind can't handle

const styles = StyleSheet.create({
  createBtn: {
    paddingVertical: 15,
    borderRadius: 14,
    backgroundColor: "#22a552ff", // light green — visually disabled state
  },
  createBtnText: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    letterSpacing: 0.2,
  },
  googleBtn: {
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    backgroundColor: "#FFFFFF",
  },
  googleBtnText: {
    fontSize: 15,
    fontFamily: "Poppins-SemiBold",
    color: "#1D4ED8",
  },
});
