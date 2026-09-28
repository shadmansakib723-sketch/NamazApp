const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// ── SVG transformer ──────────────────────────────────────────────────────────
// Route .svg files through react-native-svg-transformer so they can be
// imported as React components (using react-native-svg under the hood).
const { transformer, resolver } = config;

config.transformer = {
  ...transformer,
  babelTransformerPath: require.resolve("react-native-svg-transformer"),
};
config.resolver = {
  ...resolver,
  assetExts: (resolver.assetExts ?? []).filter((ext) => ext !== "svg"),
  sourceExts: [...(resolver.sourceExts ?? []), "svg"],
};
// ────────────────────────────────────────────────────────────────────────────

module.exports = withNativeWind(config, { input: "./global.css" });
