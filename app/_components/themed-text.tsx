import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Text, TextProps } from "react-native";

interface ThemedTextProps extends TextProps {
  type?: "default" | "title" | "subtitle" | "link" | "defaultSemiBold";
}

export function ThemedText({
  style,
  type = "default",
  ...rest
}: ThemedTextProps) {
  const colorScheme = useColorScheme() || "light";
  const color = Colors[colorScheme].text;

  const textStyle = {
    default: { fontSize: 16, color },
    title: { fontSize: 32, fontWeight: "700", color },
    subtitle: { fontSize: 20, fontWeight: "600", color },
    link: {
      fontSize: 16,
      color: Colors[colorScheme].tint,
      textDecorationLine: "underline" as const,
    },
    defaultSemiBold: { fontSize: 16, fontWeight: "600", color },
  };

  return <Text style={[textStyle[type], style]} {...rest} />;
}
