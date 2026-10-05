# Auth Setup — Google Sign-In + Supabase

## Overview

This document describes how authentication was set up in the Salah Tracker app.
The goal was: user taps "Sign in with Google" → native Android Google account picker appears → user is authenticated via Supabase → Profile screen shows their name and email.

**Status:** Implemented and working on Android (debug build).

---

## How the Auth Flow Works

```
User taps "Sign in with Google"
        ↓
@react-native-google-signin/google-signin
  → Native Android account picker popup appears
  → User picks their Google account
  → Returns a Google ID Token
        ↓
supabase.auth.signInWithIdToken({ provider: "google", token: idToken })
  → Supabase verifies the token with Google
  → Supabase auto-creates or retrieves the user record
  → Returns a Supabase session + user object
        ↓
AuthUser is extracted from user.user_metadata
  → Saved into Zustand (useAuthStore)
        ↓
Profile screen re-renders:
  → Shows avatar, name, email, and a Log Out button
```

---

## External Services Used

### 1. Google Cloud Console
- **Project:** Salah Tracker
- **Two OAuth 2.0 credentials were created:**

| Type | Client ID | Purpose |
|---|---|---|
| Android | `1025045838732-ek27q1t48v5q9abpuqc62fo3btj7kb47.apps.googleusercontent.com` | Tells Google to trust the Android app (uses package name + SHA-1). Never used in code — works silently. |
| Web | `1025045838732-cl20a8nbss0pp6mr8d0fr67sbd2nvvle.apps.googleusercontent.com` | Used in code. Required to generate an ID token that Supabase can verify. |

- **Android OAuth client configured with:**
  - Package name: `com.sakib.salahtracker`
  - SHA-1: `5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25` (debug keystore at `android/app/debug.keystore`)

- **Web OAuth client authorized redirect URI:**
  `https://omepnyfdlfnzrsnuqite.supabase.co/auth/v1/callback`

### 2. Supabase
- **Project URL:** `https://omepnyfdlfnzrsnuqite.supabase.co`
- **Auth Provider:** Google is enabled under Authentication → Providers → Google
- **Web Client ID and Client Secret** from Google Cloud Console were pasted into Supabase
- Supabase automatically creates a user record on first sign-in
- User data visible in Supabase: Authentication → Users

---

## Packages Installed

```bash
npx expo install @react-native-google-signin/google-signin @supabase/supabase-js @react-native-async-storage/async-storage
```

| Package | Why |
|---|---|
| `@react-native-google-signin/google-signin` | Native Android Google account picker |
| `@supabase/supabase-js` | Supabase client for auth |
| `@react-native-async-storage/async-storage` | Required by Supabase to persist session to disk |

---

## Files Created

### `src/types/auth.ts`
Defines the `AuthUser` type used throughout the app.

```ts
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
}
```

---

### `src/lib/supabase.ts`
Creates and exports the Supabase client singleton. Uses AsyncStorage so the Supabase session is saved to disk and survives app restarts. `detectSessionInUrl` is false because this is a native app, not a web app.

---

### `src/lib/googleAuth.ts`
Contains all sign-in and sign-out logic. This is the only file that talks to Google and Supabase directly.

- `GoogleSignin.configure()` is called once at module load with the **Web Client ID** (from env)
- `signInWithGoogle()`:
  1. Checks Play Services are available
  2. Calls `GoogleSignin.signIn()` to get Google ID token
  3. Passes ID token to `supabase.auth.signInWithIdToken()`
  4. Returns an `AuthUser` extracted from `user.user_metadata`
- `signOut()`:
  1. Calls `GoogleSignin.signOut()` — clears Google session
  2. Calls `supabase.auth.signOut()` — clears Supabase session

---

### `src/store/useAuthStore.ts`
Zustand store that holds the signed-in user globally. Follows the same pattern as the existing `useAppStore.ts`.

```ts
interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  setUser: (user: AuthUser | null) => void;
  setLoading: (value: boolean) => void;
}
```

> KNOWN LIMITATION: This store is in-memory only. When the app is closed and reopened, user resets to null even though Supabase has a valid session on disk. See Known Limitations section.

---

## Files Modified

### `src/app/(tabs)/profile.tsx`
Completely rewritten. Has two states:

**Signed out:**
- Short description text
- "Sign in with Google" button → calls `handleSignIn()`

**Signed in:**
- Avatar image from Google profile URL (falls back to initials if no photo)
- User's full name
- User's email
- "Log out" button → calls `handleSignOut()`

Loading states handled with `ActivityIndicator`. Errors shown with `Alert`. SIGN_IN_CANCELLED is silently ignored.

---

### `app.json`
The `@react-native-google-signin/google-signin` plugin was added to the plugins array. Expo added this automatically during `npx expo install`.

---

### `.env`
Created with these variables (not committed to git — in .gitignore):

```
EXPO_PUBLIC_SUPABASE_URL=https://omepnyfdlfnzrsnuqite.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<see actual .env file>
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=1025045838732-cl20a8nbss0pp6mr8d0fr67sbd2nvvle.apps.googleusercontent.com
```

### `.env.example`
Updated to show the required env var names without values.

---

## Important: Native Build Required

This feature uses a native module. It will NOT work in Expo Go. Always run:

```bash
npx expo run:android
```

Running `expo start` and scanning with Expo Go will crash with:
```
TurboModuleRegistry.getEnforcing: 'RNGoogleSignin' could not be found
```

---

## Known Limitations (Future Tasks)

### 1. Session not restored on app restart
**Problem:** `useAuthStore` is in-memory. When the app restarts, `user` is `null` even though Supabase has a valid session saved in AsyncStorage.

**Fix (not yet done):** On app startup in `src/app/_layout.tsx`, call `supabase.auth.getSession()`. If a valid session exists, extract the user metadata and call `setUser()` to restore the signed-in state without requiring the user to sign in again.

### 2. No production keystore SHA-1 registered
The SHA-1 registered in Google Cloud Console is the debug keystore only. When a production/release build is made for the Play Store, the release keystore SHA-1 must also be added to the Android OAuth client in Google Cloud Console.

### 3. Features not locked to auth
No features are gated behind sign-in. The Profile screen is the only place auth is used. Future tasks will connect user identity to prayer logs and friend data in Supabase.

---

## What Supabase Stores Automatically

On first sign-in, Supabase creates a user record with no extra code needed:

| Field | Source |
|---|---|
| `id` | Supabase-generated UUID |
| `email` | From Google account |
| `user_metadata.full_name` | From Google profile |
| `user_metadata.avatar_url` | From Google profile photo URL |
| `user_metadata.provider_id` | Google user ID |
| `app_metadata.provider` | "google" |

View in: Supabase Dashboard → Authentication → Users.

No custom database tables were created in this task. That is a separate future task.
