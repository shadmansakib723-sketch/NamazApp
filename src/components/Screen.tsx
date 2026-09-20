import type { PropsWithChildren } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export function Screen({ children }: PropsWithChildren) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F0F6F3" }} edges={["top", "left", "right"]}>
      {children}
    </SafeAreaView>
  );
}
