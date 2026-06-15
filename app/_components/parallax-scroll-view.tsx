import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { ScrollView, View, ViewProps } from "react-native";

interface ParallaxScrollViewProps extends ViewProps {
  headerBackgroundColor?: { light: string; dark: string };
  headerImage?: React.ReactNode;
  children?: React.ReactNode;
}

export default function ParallaxScrollView({
  headerBackgroundColor,
  headerImage,
  children,
  style,
  ...otherProps
}: ParallaxScrollViewProps) {
  const colorScheme = useColorScheme() || "light";
  const backgroundColor =
    headerBackgroundColor?.[colorScheme] || Colors[colorScheme].background;

  return (
    <View style={{ flex: 1, backgroundColor }}>
      <View style={{ height: 200, backgroundColor, justifyContent: "center" }}>
        {headerImage}
      </View>
      <ScrollView style={[{ flex: 1 }, style]} {...otherProps}>
        {children}
      </ScrollView>
    </View>
  );
}
