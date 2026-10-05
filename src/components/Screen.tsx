import type { PropsWithChildren } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export function Screen({ children }: PropsWithChildren) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#b0ec18ff" }} edges={["top", "left", "right"]}>
      {children}
    </SafeAreaView>
  );
}
