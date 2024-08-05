import { FC, useCallback, useState } from "react";
import { Checkbox, Modal } from "react-native-paper";
import TextWithFont from "../shared/components/TextWithFont";
import { useGlobalContext } from "../core/context/Context";
import { createTheme } from "../shared/theme";
import { Dimensions, Image, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";
import ColorPicker, {
	colorKit,
	OpacitySlider,
	Panel2,
	Panel5,
	returnedResults,
	SaturationSlider,
} from "reanimated-color-picker";
import { useFocusEffect } from "@react-navigation/native";
import storage from "../core/storage/storage";
import uuid from "react-native-uuid";
import {
	IBase64Wallpaper,
	IWallpaperGradient,
	WallpaperGradientRouteProps,
} from "../shared/types";
import { getWallpapersGradientsAndSetState } from "../shared/functions";

const WallpaperGradient: FC<WallpaperGradientRouteProps> = ({ navigation }) => {
	const deviceHeight = Dimensions.get("window").height;

	// Global context states
	const { appTheme, setWallpaperGradient } = useGlobalContext();

	// Theme
	const theme = createTheme(appTheme);

	// Animated
	const colorsContainerHeight = useSharedValue(0);
	const imageColorContainerHeight = useSharedValue(0);

	// States
	const [gradientColors, setGradientColors] = useState<string[]>([
		colorKit.randomRgbColor().hex(),
		colorKit.randomRgbColor().hex(),
		colorKit.randomRgbColor().hex(),
		colorKit.randomRgbColor().hex(),
	]);
	const [imageColor, setImageColor] = useState<string>("#ffffff");

	const [currentChangingColorIdx, setCurrentChangingColorIdx] =
		useState<number>(0);

	const [withImage, setWithImage] = useState<boolean>(false);
	const [visibleSetButton, setVisibleSetButton] = useState<boolean>(true);

	// Functions

	const handleClickColorPickerMenu = () => {
		if (
			imageColorContainerHeight.value === 0 &&
			colorsContainerHeight.value === 0
		) {
			colorsContainerHeight.value = withTiming(deviceHeight * 0.3, {
				duration: 100,
			});
			setVisibleSetButton(false);
		}
		if (
			colorsContainerHeight.value === 0 &&
			imageColorContainerHeight.value !== 0
		) {
			imageColorContainerHeight.value = withTiming(deviceHeight * 0.3, {
				duration: 100,
			});
			colorsContainerHeight.value = withTiming(0, { duration: 100 });
			setVisibleSetButton(false);
		}
		if (colorsContainerHeight.value !== 0) {
			colorsContainerHeight.value = withTiming(0, { duration: 100 });
			setVisibleSetButton(true);
		}
	};

	const handleClickImageColorMenu = () => {
		if (
			imageColorContainerHeight.value === 0 &&
			colorsContainerHeight.value === 0
		) {
			imageColorContainerHeight.value = withTiming(deviceHeight * 0.3, {
				duration: 100,
			});
			setVisibleSetButton(false);
		}
		if (
			imageColorContainerHeight.value === 0 &&
			colorsContainerHeight.value !== 0
		) {
			imageColorContainerHeight.value = withTiming(deviceHeight * 0.3, {
				duration: 100,
			});
			colorsContainerHeight.value = withTiming(0, { duration: 100 });
			setVisibleSetButton(false);
		}
		if (imageColorContainerHeight.value !== 0) {
			imageColorContainerHeight.value = withTiming(0, {
				duration: 100,
			});
			setVisibleSetButton(true);
		}
	};

	const handleChangeColorInPicker = (color: returnedResults) => {
		const gradientColorsSlice = gradientColors.slice();
		gradientColorsSlice[currentChangingColorIdx] = color.hex;

		setGradientColors(gradientColorsSlice);
	};

	const handleChangeImageColor = (color: returnedResults) => {
		setImageColor(color.hex);
	};

	const handleCancelImageColorPicker = () => {
		imageColorContainerHeight.value = withTiming(0, {
			duration: 100,
		});
		setImageColor("#ffffff");
		setVisibleSetButton(true);
	};

	const handleClickSetWallpaper = async () => {
		const base64Wallpapers: IBase64Wallpaper[] = await storage.getAllDataForKey(
			"base64Wallpapers"
		);

		const updatedWallpapers = base64Wallpapers.map((storageWallpaper) => ({
			...storageWallpaper,
			selected: false,
		}));

		storage.clearMapForKey("base64Wallpapers");

		await Promise.all(
			updatedWallpapers.map((updWallpaper) =>
				storage.save({
					key: "base64Wallpapers",
					id: uuid.v4().toString(),
					data: updWallpaper,
				})
			)
		);

		const wallpapersGradients: IBase64Wallpaper[] =
			await storage.getAllDataForKey("wallpaperGradient");

		const updatedwallpapersGradients = wallpapersGradients.map(
			(storageWallpaperGradient) => ({
				...storageWallpaperGradient,
				selected: false,
			})
		);

		storage.clearMapForKey("wallpaperGradient");

		await Promise.all(
			updatedwallpapersGradients.map((updWallpaperGradient) =>
				storage.save({
					key: "wallpaperGradient",
					id: uuid.v4().toString(),
					data: updWallpaperGradient,
				})
			)
		);
		await storage.save({
			key: "wallpaperGradient",
			id: uuid.v4().toString(),
			data: {
				id: uuid.v4(),
				colors: gradientColors,
				withImage,
				imageColor,
				selected: true,
			},
		});

		getWallpapersGradientsAndSetState(setWallpaperGradient);
		navigation.navigate("ChangeWallpaper");
	};

	useFocusEffect(
		useCallback(() => {
			getWallpapersGradientsAndSetState(setWallpaperGradient);

			return () => {
				colorsContainerHeight.value = withTiming(0, { duration: 100 });
				setCurrentChangingColorIdx(0);
				setWithImage(false);
				setGradientColors([
					colorKit.randomRgbColor().hex(),
					colorKit.randomRgbColor().hex(),
					colorKit.randomRgbColor().hex(),
					colorKit.randomRgbColor().hex(),
				]);
			};
		}, [])
	);

	return (
		<View // Container for Wallpaper Gradient component
			style={{
				flex: 1,
				flexDirection: "column",
				justifyContent: "flex-end",
				backgroundColor: theme.colors.main[500],
			}}
		>
			<LinearGradient
				colors={gradientColors}
				start={{ x: 0.1, y: 0.1 }}
				end={{ x: 0.9, y: 0.9 }}
				style={{
					position: "absolute",
					width: "100%",
					height: "100%",
				}}
			></LinearGradient>
			{withImage && (
				<Image
					source={require("../assets/chat-background-items.png")}
					style={{
						position: "absolute",
						width:"100%",
						opacity: 0.7,
					}}
					tintColor={imageColor}
				></Image>
			)}
			<View // Container for messages example
			>
				<TouchableOpacity // Container for message row
					key={uuid.v4() + "-containerForMessageRow"}
					style={{
						position: "relative",
						flexDirection: "row",
						justifyContent: "flex-start",
						width: "100%",
						paddingHorizontal: theme.spacing(3),
						paddingVertical: theme.spacing(1.5),
					}}
				>
					<TouchableOpacity // Container for message
						key={uuid.v4() + "-containerForMessage"}
						style={{
							flexDirection: "column",
							gap: theme.spacing(1),
							backgroundColor: theme.colors.main[300],
							paddingVertical: theme.spacing(2),
							paddingHorizontal: theme.spacing(3),
							borderTopLeftRadius: theme.borderRadius(2),
							borderTopRightRadius: theme.borderRadius(2),
							borderBottomLeftRadius: 0,
							borderBottomRightRadius: theme.borderRadius(2),
							minWidth: 72,
							maxWidth: "80%",
						}}
					>
						<TextWithFont
							styleProps={{
								width: "100%",
								textAlign: "left",
								maxWidth: "100%",
							}}
						>
							Click "Set" to apply the wallpaper
						</TextWithFont>
						<TextWithFont
							styleProps={{
								textAlign: "right",
								width: "100%",
								fontSize: theme.fontSize(3),
								color: theme.colors.main[200],
							}}
						>
							{"20:50"}
						</TextWithFont>
					</TouchableOpacity>
				</TouchableOpacity>

				<TouchableOpacity // Container for message row
					key={uuid.v4() + "-containerForMessageRow"}
					style={{
						position: "relative",
						flexDirection: "row",
						justifyContent: "flex-end",
						width: "100%",
						paddingHorizontal: theme.spacing(3),
						paddingVertical: theme.spacing(1.5),
					}}
				>
					<TouchableOpacity // Container for message
						key={uuid.v4() + "-containerForMessage"}
						style={{
							flexDirection: "column",
							gap: theme.spacing(1),
							backgroundColor: theme.colors.contrast[500],
							paddingVertical: theme.spacing(2),
							paddingHorizontal: theme.spacing(3),
							borderTopLeftRadius: theme.borderRadius(2),
							borderTopRightRadius: theme.borderRadius(2),
							borderBottomLeftRadius: theme.borderRadius(2),
							borderBottomRightRadius: 0,
							minWidth: 72,
							maxWidth: "80%",
						}}
					>
						<TextWithFont
							styleProps={{
								width: "100%",
								textAlign: "left",
								maxWidth: "100%",
							}}
						>
							Awesome!
						</TextWithFont>
						<TextWithFont
							styleProps={{
								textAlign: "right",
								width: "100%",
								fontSize: theme.fontSize(3),
								color: theme.colors.main[100],
							}}
						>
							{"20:50"}
						</TextWithFont>
					</TouchableOpacity>
				</TouchableOpacity>
			</View>
			<View // Container for buttons "Image" and "Colors"
				style={{
					flexDirection: "row",
					justifyContent: "space-between",
					padding: theme.spacing(3),
				}}
			>
				<TouchableOpacity // Image button
					onPress={() => {
						if (withImage) {
							setWithImage(!withImage);
							handleCancelImageColorPicker();
						} else {
							setWithImage(!withImage);
							handleClickImageColorMenu();
						}
					}}
					style={{
						flexDirection: "row",
						alignItems: "center",
						gap: theme.spacing(2),
						backgroundColor: theme.colors.main[400],
						paddingVertical: theme.spacing(1),
						paddingHorizontal: theme.spacing(4),
						borderRadius: theme.spacing(4),
					}}
				>
					<Checkbox
						status={withImage ? "checked" : "unchecked"}
						color={theme.colors.main[100]}
						uncheckedColor={theme.colors.main[100]}
					></Checkbox>

					<TextWithFont>Image</TextWithFont>
				</TouchableOpacity>
				<TouchableOpacity // Colors button
					onPress={handleClickColorPickerMenu}
					style={{
						flexDirection: "row",
						alignItems: "center",
						gap: theme.spacing(2),
						backgroundColor: theme.colors.main[400],
						paddingVertical: theme.spacing(1),
						paddingHorizontal: theme.spacing(4),
						borderRadius: theme.spacing(4),
					}}
				>
					<Ionicons
						name="color-palette-outline"
						size={24}
						color={theme.colors.main[100]}
					/>
					<TextWithFont>Colors</TextWithFont>
				</TouchableOpacity>
			</View>
			{visibleSetButton && (
				<View // Container for "Set wallpaper" button
					style={{
						justifyContent: "center",
						alignItems: "center",
						padding: theme.spacing(3),
						marginBottom: theme.spacing(3),
					}}
				>
					<TouchableOpacity
						onPress={handleClickSetWallpaper}
						style={{
							justifyContent: "center",
							alignItems: "center",
							width: "100%",
							backgroundColor: theme.colors.contrast[200],
							borderRadius: theme.spacing(4),
							paddingVertical: theme.spacing(2),
						}}
					>
						<TextWithFont>Set wallpaper</TextWithFont>
					</TouchableOpacity>
				</View>
			)}
			<Animated.View
				style={{
					flexDirection: "column",
					width: "100%",
					height: colorsContainerHeight,
					backgroundColor: theme.colors.main[400],
					borderTopLeftRadius: theme.spacing(4),
					borderTopRightRadius: theme.spacing(4),
				}}
			>
				<View // Container for current color value and colors
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						padding: theme.spacing(3),
						paddingHorizontal: theme.spacing(4),
					}}
				>
					<TextWithFont>
						{gradientColors.find(
							(grCol, idx) => idx == currentChangingColorIdx
						)}
					</TextWithFont>
					<View // container for colors
						style={{
							flexDirection: "row",
							gap: theme.spacing(2),
						}}
					>
						{gradientColors.map((grCol, idx) =>
							idx === currentChangingColorIdx ? (
								<View
									key={uuid.v4() + "-containerForGradientColor"}
									style={{
										width: 20,
										height: 20,
										borderRadius: 40,
										padding: theme.spacing(0.5),
										borderColor: grCol,
										borderWidth: 1,
									}}
								>
									<View
										style={{
											width: "100%",
											height: "100%",
											backgroundColor: grCol,
											borderRadius: 40,
										}}
									></View>
								</View>
							) : (
								<TouchableOpacity
									onPress={() => setCurrentChangingColorIdx(idx)}
									style={{
										width: 20,
										height: 20,
										backgroundColor: grCol,
										borderRadius: 40,
									}}
								></TouchableOpacity>
							)
						)}
					</View>
				</View>

				<ColorPicker
					value={gradientColors[currentChangingColorIdx]}
					onChange={handleChangeColorInPicker}
				>
					<Panel2 verticalChannel="brightness"></Panel2>
				</ColorPicker>
			</Animated.View>
			<Animated.View // Container for image color picker
				style={{
					flexDirection: "column",
					width: "100%",
					height: imageColorContainerHeight,
					backgroundColor: theme.colors.main[400],
					borderTopLeftRadius: theme.spacing(4),
					borderTopRightRadius: theme.spacing(4),
					maxHeight: Dimensions.get("window").height * 0.3,
				}}
			>
				<View // Container for buttons
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						padding: theme.spacing(4),
					}}
				>
					<TouchableOpacity onPress={() => handleCancelImageColorPicker()}>
						<TextWithFont
							styleProps={{
								fontSize: theme.fontSize(4),
								color: theme.colors.contrast[300],
							}}
						>
							Cancel
						</TextWithFont>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => {
							imageColorContainerHeight.value = withTiming(0, {
								duration: 100,
							});
							setVisibleSetButton(true);
						}}
					>
						<TextWithFont
							styleProps={{
								fontSize: theme.fontSize(4),
								color: theme.colors.contrast[300],
							}}
						>
							Set
						</TextWithFont>
					</TouchableOpacity>
				</View>
				<ColorPicker
					value="#ffffff"
					adaptSpectrum
					onChange={handleChangeImageColor}
					style={{
						padding: theme.spacing(4),
						gap: theme.spacing(3),
						maxHeight: "80%",
						paddingBottom: 0,
					}}
				>
					<Panel2
						style={{
							maxHeight: "100%",
						}}
					></Panel2>
				</ColorPicker>
			</Animated.View>
		</View>
	);
};

export default WallpaperGradient;
