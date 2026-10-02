import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";

import { supabase } from "./supabase";
import type { AuthUser } from "@/types/auth";

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID!,
});

export async function signInWithGoogle(): Promise<AuthUser> {
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

  const signInResult = await GoogleSignin.signIn();

  const idToken = signInResult.data?.idToken;
  if (!idToken) {
    throw new Error("No ID token returned from Google Sign-In");
  }

  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: "google",
    token: idToken,
  });

  if (error) throw error;

  const user = data.user;
  if (!user) throw new Error("No user returned from Supabase");

  return {
    id: user.id,
    email: user.email ?? "",
    name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? "",
    avatarUrl: user.user_metadata?.avatar_url ?? null,
  };
}

export async function signOut(): Promise<void> {
  await GoogleSignin.signOut();
  await supabase.auth.signOut();
}

export { statusCodes };
