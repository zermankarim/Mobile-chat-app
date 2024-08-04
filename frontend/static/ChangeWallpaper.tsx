import {
	Alert,
	Dimensions,
	Image,
	Platform,
	ScrollView,
	TouchableOpacity,
	View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import {
	blobToBase64,
	getWallpapersGradientsAndSetState,
	getWallpapersPicturesAndSetState,
} from "../shared/functions";
import { FC, useCallback, useEffect, useState } from "react";
import { createTheme } from "../shared/theme";
import { useGlobalContext } from "../core/context/Context";
import TextWithFont from "../shared/components/TextWithFont";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import storage from "../core/storage/storage";
import {
	ChangeWallpaperRouteProps,
	IBase64Wallpaper,
	IWallpaperGradient,
} from "../shared/types";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import uuid from "react-native-uuid";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";

const ChangeWallpaper: FC<ChangeWallpaperRouteProps> = ({ navigation }) => {
	// Global context states
	const {
		appTheme,
		wallpaperPicture,
		setWallpaperPicture,
		setWallpaperGradient,
	} = useGlobalContext();

	// Theme
	const theme = createTheme(appTheme);

	// States
	const [wallpapersPreview, setWallpapersPreview] = useState<
		IBase64Wallpaper[]
	>([]);
	const [wallpapersGradientsPreview, setWallpapersGradientsPreview] = useState<
		IWallpaperGradient[]
	>([]);

	// Functions
	const handleClickImagePicker = async () => {
		// If user doesn't get permission for camera and gallery
		if (Platform.OS !== "web") {
			const { status } =
				await ImagePicker.requestMediaLibraryPermissionsAsync();
			if (status !== "granted") {
				Alert.alert(
					"Sorry, we need camera roll permissions to make this work!"
				);
				return;
			}
		}

		// else
		try {
			let result = await ImagePicker.launchImageLibraryAsync({
				allowsEditing: true,
				quality: 1,
				aspect: [1, 2],
			});

			if (!result.canceled) {
				const imageURI = result.assets[0].uri;
				const response = await fetch(imageURI);
				const blob: Blob = await response.blob();
				const base64Image = await blobToBase64(blob);
				uploadAndChangeWallpaper(base64Image);
			}
		} catch (e: any) {
			console.error(e.message);
		}
	};

	const uploadAndChangeWallpaper = async (base64Image: string) => {
		try {
			const base64Wallpapers: IBase64Wallpaper[] =
				await storage.getAllDataForKey("base64Wallpapers");

			const updatedWallpapers = base64Wallpapers.map((wallpaper) => ({
				...wallpaper,
				selected: false,
			}));
			storage.clearMapForKey("base64Wallpapers");

			await storage.save({
				key: "base64Wallpapers",
				id: uuid.v4().toString(),
				data: {
					uri: base64Image,
					selected: true,
				},
			});
			await Promise.all(
				updatedWallpapers.map((wallpaper) =>
					storage.save({
						key: "base64Wallpapers",
						id: uuid.v4().toString(),
						data: wallpaper,
					})
				)
			);
			getWallpapersPicturesAndSetState(
				setWallpaperPicture,
				setWallpapersPreview
			);
		} catch (e: any) {
			console.error(
				`changeWallpaper: Error during saving wallpaper: ${e.message}`
			);
			Alert.alert(`Error during saving wallpaper: ${e.message}`);
		}
	};

	const isBase64Wallpaper = (
		wallpaper: IBase64Wallpaper | IWallpaperGradient
	): wallpaper is IBase64Wallpaper => {
		return (wallpaper as IBase64Wallpaper).uri !== undefined;
	};

	const changeWallpaperTo = async (
		wallpaper: IBase64Wallpaper | IWallpaperGradient
	) => {
		const base64Wallpapers: IBase64Wallpaper[] = await storage.getAllDataForKey(
			"base64Wallpapers"
		);

		const wallpapersGradients: IWallpaperGradient[] =
			await storage.getAllDataForKey("wallpaperGradient");

		let updatedBase64Wallpapers;
		let updatedWallpapersGradients;

		if (isBase64Wallpaper(wallpaper)) {
			updatedBase64Wallpapers = base64Wallpapers.map((storageWallpaper) => ({
				...storageWallpaper,
				selected: storageWallpaper.uri === wallpaper.uri,
			}));

			updatedWallpapersGradients = wallpapersGradients.map(
				(storageWallpaper) => ({
					...storageWallpaper,
					selected: false,
				})
			);
		} else {
			updatedBase64Wallpapers = base64Wallpapers.map((storageWallpaper) => ({
				...storageWallpaper,
				selected: false,
			}));

			updatedWallpapersGradients = wallpapersGradients.map(
				(storageWallpaper) => ({
					...storageWallpaper,
					selected: storageWallpaper.id === wallpaper.id,
				})
			);
		}

		storage.clearMapForKey("base64Wallpapers");
		storage.clearMapForKey("wallpaperGradient");

		await Promise.all(
			updatedBase64Wallpapers.map((updatedBase64Wallpaper) =>
				storage.save({
					key: "base64Wallpapers",
					id: uuid.v4().toString(),
					data: updatedBase64Wallpaper,
				})
			)
		);
		await Promise.all(
			updatedWallpapersGradients.map((updatedWallpapersGradient) =>
				storage.save({
					key: "wallpaperGradient",
					id: uuid.v4().toString(),
					data: updatedWallpapersGradient,
				})
			)
		);

		getWallpapersPicturesAndSetState(setWallpaperPicture, setWallpapersPreview);
		getWallpapersGradientsAndSetState(
			setWallpaperGradient,
			setWallpapersGradientsPreview
		);
	};

	// Effects
	useFocusEffect(
		useCallback(() => {
			getWallpapersPicturesAndSetState(
				setWallpaperPicture,
				setWallpapersPreview
			);
			getWallpapersGradientsAndSetState(
				setWallpaperGradient,
				setWallpapersGradientsPreview
			);
		}, [])
	);

	return (
		<View // Container for Change Wallpaper Component
			style={{
				flex: 1,
				gap: theme.spacing(3),
				backgroundColor: theme.colors.main[500],
			}}
		>
			<View // Container for choose buttons
			>
				<TouchableOpacity
					onPress={handleClickImagePicker}
					style={{
						flexDirection: "row",
						alignItems: "center",
						gap: theme.spacing(2),
						width: "100%",
						minHeight: 50,
						padding: theme.spacing(4),
						backgroundColor: theme.colors.main[400],
						borderBottomColor: theme.colors.main[500],
						borderBottomWidth: 1,
					}}
				>
					<MaterialIcons
						name="wallpaper"
						size={24}
						color={theme.colors.contrast[300]}
					/>
					<TextWithFont
						styleProps={{
							color: theme.colors.contrast[300],
						}}
					>
						Choose from gallery
					</TextWithFont>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => navigation.navigate("WallpaperGradient")}
					style={{
						flexDirection: "row",
						alignItems: "center",
						gap: theme.spacing(2),
						width: "100%",
						minHeight: 50,
						padding: theme.spacing(4),
						backgroundColor: theme.colors.main[400],
						borderBottomColor: theme.colors.main[500],
						borderBottomWidth: 1,
					}}
				>
					<Ionicons
						name="color-palette-outline"
						size={24}
						color={theme.colors.contrast[300]}
					/>
					<TextWithFont
						styleProps={{
							color: theme.colors.contrast[300],
						}}
					>
						Set a gradient
					</TextWithFont>
				</TouchableOpacity>
			</View>
			<ScrollView
				contentContainerStyle={{
					flexDirection: "row",
					flexWrap: "wrap",
					padding: theme.spacing(3),
				}}
				style={{
					minHeight: "100%",
					backgroundColor: theme.colors.main[400],
				}}
			>
				{wallpapersGradientsPreview.length
					? wallpapersGradientsPreview.map((wallpaper) => (
							<TouchableOpacity
								onPress={() => changeWallpaperTo(wallpaper)}
								key={uuid.v4() + "-containerWallpaper"}
								style={{
									justifyContent: "center",
									alignItems: "center",
									padding: theme.spacing(1),
									width:
										Dimensions.get("window").width / 3 - theme.spacing(1) * 3,
									height: (Dimensions.get("window").width / 3) * 2,
								}}
							>
								{wallpaper.selected && (
									<View
										style={{
											position: "absolute",
											zIndex: 1,
											backgroundColor: theme.colors.main[500],
											padding: theme.spacing(1),
											borderRadius: 50,
										}}
									>
										<AntDesign
											name="checkcircleo"
											size={24}
											color={theme.colors.main[100]}
										/>
									</View>
								)}
								<LinearGradient
									colors={wallpaper.colors}
									start={{ x: 0.1, y: 0.1 }}
									end={{ x: 0.9, y: 0.9 }}
									style={{
										position: "absolute",
										width: "100%",
										height: "100%",
									}}
								></LinearGradient>
								{wallpaper.withImage && (
									<Image
										source={require("../assets/chat-background-items.png")}
										style={{
											position: "absolute",
											opacity: 0.7,
											width: "100%",
											height: "100%",
										}}
										tintColor={wallpaper.imageColor}
									></Image>
								)}
							</TouchableOpacity>
					  ))
					: null}
				{wallpapersPreview.length || wallpapersGradientsPreview.length ? (
					wallpapersPreview.map((wallpaper) => (
						<TouchableOpacity
							onPress={() => changeWallpaperTo(wallpaper)}
							key={uuid.v4() + "-containerWallpaper"}
							style={{
								justifyContent: "center",
								alignItems: "center",
								padding: theme.spacing(1),
							}}
						>
							{wallpaper.selected && (
								<View
									style={{
										position: "absolute",
										zIndex: 1,
										backgroundColor: theme.colors.main[500],
										padding: theme.spacing(1),
										borderRadius: 50,
									}}
								>
									<AntDesign
										name="checkcircleo"
										size={24}
										color={theme.colors.main[100]}
									/>
								</View>
							)}
							<Image
								source={{ uri: wallpaper.uri }}
								style={{
									width:
										Dimensions.get("window").width / 3 - theme.spacing(1) * 3,
									height: (Dimensions.get("window").width / 3) * 2,
								}}
							></Image>
						</TouchableOpacity>
					))
				) : (
					<View
						style={{
							justifyContent: "center",
							alignItems: "center",
							flex: 1,
							gap: theme.spacing(4),
						}}
					>
						<MaterialCommunityIcons
							name="emoticon-sad-outline"
							size={64}
							color={theme.colors.main[200]}
						/>
						<TextWithFont
							styleProps={{
								color: theme.colors.main[200],
							}}
						>
							You haven't any wallpapers
						</TextWithFont>
					</View>
				)}
			</ScrollView>
		</View>
	);
};

export default ChangeWallpaper;
