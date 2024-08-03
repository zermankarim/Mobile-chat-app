import { useFocusEffect } from "@react-navigation/native";
import { FC, ReactNode, useCallback, useEffect } from "react";
import {
	Dimensions,
	StyleProp,
	StyleSheet,
	ViewProps,
	ViewStyle,
} from "react-native";
import { Style } from "react-native-paper/lib/typescript/components/List/utils";
import Animated, {
	Easing,
	SharedValue,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";

type AnimatedScreenProps = {
	children: ReactNode | SharedValue<ReactNode>;
	styleProps?: StyleProp<ViewStyle>;
	navType: "back" | "forward";
};

const AnimatedScreen: FC<AnimatedScreenProps> = ({
	children,
	styleProps,
	navType,
}) => {
	const { width } = Dimensions.get("window");
	const offset = useSharedValue(width);
	const opacity = useSharedValue(1);

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [
			{ translateX: navType === "forward" ? offset.value : -offset.value },
		],
		opacity: opacity.value,
	}));

	useFocusEffect(
		useCallback(() => {
			offset.value = withTiming(0, {
				duration: 200,
				easing: Easing.inOut(Easing.ease),
			});
			opacity.value = withTiming(1, {
				duration: 300,
				easing: Easing.inOut(Easing.ease),
			});
			return () => {
				offset.value = withTiming(width, {
					duration: 200,
					easing: Easing.inOut(Easing.ease),
				});
				opacity.value = withTiming(0, {
					duration: 300,
					easing: Easing.inOut(Easing.ease),
				});
			};
		}, [])
	);
	return (
		<Animated.View
			style={[StyleSheet.absoluteFillObject, styleProps, animatedStyle]}
		>
			{children}
		</Animated.View>
	);
};

export default AnimatedScreen;
