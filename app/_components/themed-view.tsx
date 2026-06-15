import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { View, ViewProps } from "react-native";

export function ThemedView({ style, ...otherProps }: ViewProps) {
  const colorScheme = useColorScheme() || "light";
  const backgroundColor = Colors[colorScheme].background;

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
