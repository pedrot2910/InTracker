import { ParamListBase, TabNavigationState } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import { ComponentProps } from "react";
import { Platform, Pressable } from "react-native";

export function HapticTab(
  props: ComponentProps<typeof Pressable> & {
    state: TabNavigationState<ParamListBase>;
    descriptors: Record<
      string,
      {
        options: any;
      }
    >;
    navigation: any;
  },
) {
  const { state, navigation, ...rest } = props;

  const onPress = () => {
    if (Platform.OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  return <Pressable onPress={onPress} {...rest} />;
}
