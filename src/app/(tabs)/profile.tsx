import { ActivityIndicator, Alert, Image, Text, TouchableOpacity, View } from "react-native";

import { Screen } from "@/components/Screen";
import { signInWithGoogle, signOut, statusCodes } from "@/lib/googleAuth";
import { useAuthStore } from "@/store/useAuthStore";

export default function ProfileScreen() {
  const { user, isLoading, setUser, setLoading } = useAuthStore();

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

  return (
    <Screen>
      <View className="flex-1 px-6 pt-8">
        <Text className="text-3xl font-bold text-slate-950">Profile</Text>

        {user ? (
          // Signed-in state
          <View className="mt-10 items-center">
            {user.avatarUrl ? (
              <Image
                source={{ uri: user.avatarUrl }}
                className="h-24 w-24 rounded-full"
              />
            ) : (
              <View className="h-24 w-24 items-center justify-center rounded-full bg-slate-200">
                <Text className="text-3xl font-bold text-slate-500">
                  {user.name.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}

            <Text className="mt-4 text-xl font-semibold text-slate-900">
              {user.name}
            </Text>
            <Text className="mt-1 text-base text-slate-500">{user.email}</Text>

            <TouchableOpacity
              onPress={handleSignOut}
              disabled={isLoading}
              className="mt-10 w-full items-center rounded-2xl bg-slate-100 py-4"
            >
              {isLoading ? (
                <ActivityIndicator color="#64748b" />
              ) : (
                <Text className="text-base font-semibold text-slate-700">
                  Log out
                </Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          // Signed-out state
          <View className="mt-10">
            <Text className="mb-6 text-base text-slate-500">
              Sign in to track your prayers and connect with friends.
            </Text>

            <TouchableOpacity
              onPress={handleSignIn}
              disabled={isLoading}
              className="w-full flex-row items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white py-4"
            >
              {isLoading ? (
                <ActivityIndicator color="#64748b" />
              ) : (
                <>
                  <Text className="text-2xl">🔵</Text>
                  <Text className="text-base font-semibold text-slate-800">
                    Sign in with Google
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Screen>
  );
}
