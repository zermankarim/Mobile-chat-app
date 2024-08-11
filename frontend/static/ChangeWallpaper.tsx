import {
	Alert,
	Platform,
	ScrollView,
	TouchableOpacity,
	View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { blobToBase64, uploadWallpaperImageToDir } from "../shared/functions";
import { FC, useCallback, useState } from "react";
import { createTheme } from "../shared/theme";
import { useGlobalContext } from "../core/context/Context";
import TextWithFont from "../shared/components/TextWithFont";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import {
	ChangeWallpaperRouteProps,
	IBase64Wallpaper,
	IBase64WallpaperWithoutImg,
	IWallpaperGradient,
} from "../shared/types";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import uuid from "react-native-uuid";
import Ionicons from "@expo/vector-icons/Ionicons";
import { logoutUserIfTokenHasProblems } from "../fetches/http";
import { useDispatch } from "react-redux";
import { storageMMKV } from "../core/storage/storageMMKV";
import { useMMKVString } from "react-native-mmkv";
import { ActivityIndicator } from "react-native-paper";
import WallpaperPreview from "../shared/components/WallpaperPreview";
import { DocumentDirectoryPath, readFile } from "react-native-fs";

const ChangeWallpaper: FC<ChangeWallpaperRouteProps> = ({ navigation }) => {
	// Global context states
	const { appTheme, setWallpaper } = useGlobalContext();

	// MMKV states
	const [wallpapersStor, setWallpapersStor] = useMMKVString("wallpapersStor");

	// Redux states and dispatch
	const dispatch = useDispatch();

	// Theme
	const theme = createTheme(appTheme);

	// States
	const [wallpapersPreview, setWallpapersPreview] = useState<
		(IBase64Wallpaper | IWallpaperGradient)[]
	>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [files, setFiles] = useState<string[]>([]);

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
			const wallpaperForUpload: IBase64WallpaperWithoutImg = {
				id: uuid.v4().toString(),
				selected: true,
				type: "base64Wallpaper",
			};

			const pathForSaving = `${DocumentDirectoryPath}/wallpapers/${wallpaperForUpload.id}.jpg`;
			const imagePath = `file://${pathForSaving}`;

			await uploadWallpaperImageToDir(base64Image, pathForSaving);

			const wallpaperWithImage: IBase64Wallpaper = {
				...wallpaperForUpload,
				uri: imagePath,
			};
			if (!wallpapersStor) {
				storageMMKV.set(
					"wallpapersStor",
					JSON.stringify([wallpaperWithImage] as IBase64WallpaperWithoutImg[])
				);
			} else {
				const wallpapersStorParse: (
					| IBase64WallpaperWithoutImg
					| IWallpaperGradient
				)[] = JSON.parse(wallpapersStor);
				const updatedWallpapers: (
					| IBase64WallpaperWithoutImg
					| IWallpaperGradient
				)[] = wallpapersStorParse.map((wallpaper) => ({
					...wallpaper,
					selected: false,
				}));
				setWallpapersStor(
					JSON.stringify([wallpaperWithImage, ...updatedWallpapers] as (
						| IBase64WallpaperWithoutImg
						| IWallpaperGradient
					)[])
				);
			}
		} catch (e: any) {
			console.error(
				`changeWallpaper: Error during saving wallpaper: ${e.message}`
			);
			Alert.alert(`Error during saving wallpaper: ${e.message}`);
		}
	};

	const changeWallpaperTo = (
		wallpaper: IBase64Wallpaper | IWallpaperGradient
	) => {
		const wallpapersStorParse: (IBase64Wallpaper | IWallpaperGradient)[] =
			JSON.parse(wallpapersStor!);
		const updWallpapersStorParse: (IBase64Wallpaper | IWallpaperGradient)[] =
			wallpapersStorParse.map((wllp) => ({
				...wllp,
				selected: wllp.id === wallpaper.id,
			}));
		setWallpapersStor(JSON.stringify(updWallpapersStorParse));
	};

	// Effects
	useFocusEffect(
		useCallback(() => {
			logoutUserIfTokenHasProblems(dispatch, navigation);
		}, [])
	);

	useFocusEffect(
		useCallback(() => {
			if (wallpapersStor) {
				const wallpapersStorParse: IWallpaperGradient[] =
					JSON.parse(wallpapersStor);
				setWallpapersPreview(wallpapersStorParse);
				const selectedWallpaper = wallpapersStorParse.find(
					(wllp) => wllp.selected === true
				);
				if (selectedWallpaper) {
					setWallpaper(selectedWallpaper);
				} else {
					setWallpaper(null);
				}
			} else {
				setWallpapersPreview([]);
				setWallpaper(null);
			}
			setLoading(false);
			return () => {
				setWallpapersPreview([]);
			};
		}, [wallpapersStor])
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
				{loading ? (
					<ActivityIndicator
						size={"large"}
						color={theme.colors.main[100]}
						style={{
							flex: 1,
							backgroundColor: theme.colors.main[400],
						}}
					></ActivityIndicator>
				) : wallpapersPreview.length ? (
					wallpapersPreview.map((wallpaper) => (
						<WallpaperPreview
							key={wallpaper.id + "-containerWallpaper"}
							changeWallpaperTo={changeWallpaperTo}
							theme={theme}
							wallpaper={wallpaper}
							wallpaperType={wallpaper.type}
							wallpaperSelected={wallpaper.selected}
						></WallpaperPreview>
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
