import { Text } from "react-native";

interface ScreenTitleProps {
  title: string;
  subtitle: string;
}

export function ScreenTitle({ title, subtitle }: ScreenTitleProps) {
  return (
    <>
      <Text className="text-3xl font-bold text-slate-950">{title}</Text>
      <Text className="mt-2 text-base text-slate-500">{subtitle}</Text>
    </>
  );
}
