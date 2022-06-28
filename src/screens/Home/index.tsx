import React, { useState } from "react";
import { Alert, Dimensions, TouchableOpacity, View } from "react-native";
import { Circle, Path, Svg } from "react-native-svg";
import Animated, {
  Easing,
  interpolate,
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { Fontisto } from "@expo/vector-icons";

import { styles } from "./styles";
import { theme } from "../../styles/theme";
import { Header } from "../components/Header";

const { width } = Dimensions.get("screen");

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedSvg = Animated.createAnimatedComponent(Svg);
const AnimatedPath = Animated.createAnimatedComponent(Path);

export function Home() {
  const [percentage, setPercentage] = useState<number>();
  const [water, setWater] = useState<number>(0);
  const [isAnimationRun, setIsAnimationRun] = useState<boolean>(false);
  const heightAnimated = useSharedValue(100);
  const waveAnimated = useSharedValue(5);
  const buttonBorderAnimated = useSharedValue(0);

  const buttonProps = useAnimatedProps(() => {
    return {
      cx: "60",
      cy: "60",
      r: "40",
      fill: `${theme.colors.blue100}`,
      strokeWidth: `${interpolate(
        buttonBorderAnimated.value,
        [0, 0.5, 1],
        [17, 40, 17]
      )}`,
      stroke: `${theme.colors.blue90}`,
      strokeOpacity: "0.5",
    };
  });

  const svgContainerProps = useAnimatedProps(() => {
    return {
      width,
      height: heightAnimated.value,
      viewBox: `0 0 ${width} ${heightAnimated.value}`,
    };
  });

  const firstWaveProps = useAnimatedProps(() => {
    return {
      d: `
          M 0 0 
          Q 45 ${waveAnimated.value} 90 0
          T 180 0
          T 270 0
          T 360 0
          T 900 0
          T 540 0
          V ${heightAnimated.value}
          H 0
          Z
          `,
    };
  });

  const secondWaveAnimatedProps = useAnimatedProps(() => {
    return {
      d: `

          M 0 0 
          Q 35 ${waveAnimated.value + 10} 70 0
          T 140 0
          T 210 0
          T 280 0
          T 350 0
          T 500 0
          V ${heightAnimated.value}
          H 0
          Z
          `,
    };
  });

  const handleDrink = () => {
    setIsAnimationRun(true);
    buttonBorderAnimated.value = 0;
    waveAnimated.value = 5;
    buttonBorderAnimated.value = withTiming(1, {
      duration: 500,
      easing: Easing.ease,
    });

    waveAnimated.value = withRepeat(
      withTiming(17, {
        duration: 500,
        easing: Easing.ease,
      }),
      2,
      true
    );

    heightAnimated.value = withTiming(heightAnimated.value + 170, {
      duration: 1000,
      easing: Easing.ease,
    });

    const sumWater = water + 100;
    if (sumWater > 1000) {
      setWater(0);
      setPercentage(0);

      waveAnimated.value = withRepeat(
        withTiming(17, {
          duration: 3000,
          easing: Easing.ease,
        }),
        2,
        true
      );

      heightAnimated.value = withTiming(100, {
        duration: 3000,
        easing: Easing.ease,
      });

      Alert.alert("Show", "1 Litro se foi :)");
      setTimeout(() => setIsAnimationRun(false), 3000);
      return;
    }
    setWater(sumWater);
    setPercentage(Math.trunc(sumWater * 0.1));
    setTimeout(() => setIsAnimationRun(false), 1000);
  };

  return (
    <View style={styles.container}>
      <Header ml={water} percent={percentage || 0} />

      <AnimatedSvg animatedProps={svgContainerProps}>
        <AnimatedPath
          animatedProps={firstWaveProps}
          fill={theme.colors.blue100}
          transform="translate(0 10)"
        />

        <AnimatedPath
          animatedProps={secondWaveAnimatedProps}
          fill={theme.colors.blue90}
          transform="translate(0 15)"
        />
      </AnimatedSvg>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleDrink}
          disabled={isAnimationRun}
        >
          <Svg width={120} height={120}>
            <AnimatedCircle animatedProps={buttonProps} />
          </Svg>
          <Fontisto
            name="blood-drop"
            size={32}
            color={theme.colors.blue90}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
