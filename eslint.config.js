// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const prettier = require("eslint-config-prettier");

module.exports = defineConfig([
  // Expo's recommended rules (TypeScript, React, React Native)
  expoConfig,

  // Disables ESLint rules that conflict with Prettier formatting
  prettier,

  {
    rules: {
      // These import rules use a TypeScript resolver that conflicts with
      // eslint-config-expo's bundled plugin versions. TypeScript itself
      // (via `npm run typecheck`) already catches all invalid imports.
      "import/no-unresolved": "off",
      "import/namespace": "off",
      "import/no-duplicates": "off",
    },
  },

  {
    // node_modules is ignored by default in ESLint v9
    ignores: [".expo/*", "dist/*"],
  },
]);
