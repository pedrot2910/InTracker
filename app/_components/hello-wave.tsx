import { useEffect, useRef } from "react";
import { Animated, Text } from "react-native";

export function HelloWave() {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [animatedValue]);

  const rotation = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "20deg"],
  });

  return (
    <Animated.View
      style={[
        {
          transform: [{ rotateZ: rotation }],
          transformOrigin: "bottom center",
        },
      ]}
    >
      <Text style={{ fontSize: 28 }}>👋</Text>
    </Animated.View>
  );
}
