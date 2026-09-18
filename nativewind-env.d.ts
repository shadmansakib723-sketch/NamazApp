/// <reference types="nativewind/types" />

// Allows TypeScript to accept side-effect CSS imports (e.g. `import "./global.css"`)
// which NativeWind v4 requires in the root layout.
declare module "*.css";
