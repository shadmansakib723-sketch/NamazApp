export default {
  expo: {
    name: "Salah Tracker",
    slug: "salah-tracker",
    version: "1.0.0",
    orientation: "portrait",

    // iOS icon — solid background, no transparency
    icon: "./assets/icon.png",

    scheme: "salahtracker",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,

    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.sakib.salahtracker",
    },

    android: {
      package: "com.sakib.salahtracker",
      adaptiveIcon: {
        // Foreground: transparent background cat logo
        foregroundImage: "./assets/icon_transparent.png",
        // Background color: warm cream matching the icon
        backgroundColor: "#F9E8C9",
      },
    },

    web: {
      bundler: "metro",
    },

    plugins: [
      "expo-router",
      "expo-font",
      "expo-asset",
      "@react-native-google-signin/google-signin",
    ],

    experiments: {
      typedRoutes: true,
    },

    extra: {
      eas: {
        projectId: "c79df209-fd89-4a83-81b0-875ee67c3bca",
      },
    },
  },
};
