/// <reference types="nativewind/types" />

// Allows TypeScript to accept side-effect CSS imports (e.g. `import "./global.css"`)
// which NativeWind v4 requires in the root layout.
declare module "*.css";

// Allows TypeScript to accept .svg file imports as React Native SVG components
// (powered by react-native-svg-transformer).
declare module "*.svg" {
  import React from "react";
  import { SvgProps } from "react-native-svg";
  const content: React.FC<SvgProps>;
  export default content;
}
