import { FC } from "react";
import { Dimensions, Image, TouchableOpacity, View } from "react-native";
import { CustomTheme, IBase64Wallpaper, IWallpaperGradient } from "../types";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign } from "@expo/vector-icons";

type WallpaperPreviewProps = {
	wallpaper: IWallpaperGradient | IBase64Wallpaper;
	wallpaperType: "base64Wallpaper" | "wallpaperGradient";
	wallpaperSelected: boolean;
	changeWallpaperTo: (wallpaper: IWallpaperGradient | IBase64Wallpaper) => void;
	theme: CustomTheme;
};

const WallpaperPreview: FC<WallpaperPreviewProps> = ({
	wallpaper,
	changeWallpaperTo,
	theme,
	wallpaperType,
	wallpaperSelected,
}) => {
	return wallpaper.type === "wallpaperGradient" ? (
		<TouchableOpacity
			onPress={() => {
				changeWallpaperTo(wallpaper);
			}}
			key={wallpaper.id + "-containerWallpaper"}
			style={{
				justifyContent: "center",
				alignItems: "center",
				padding: theme.spacing(1),
				width: Dimensions.get("window").width / 3 - theme.spacing(1) * 3,
				height: (Dimensions.get("window").width / 3) * 2,
			}}
		>
			{wallpaperSelected && (
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
			{!wallpaper.withImage ? null : (
				<Image
					source={require("../../assets/chat-background-items.png")}
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
	) : (
		<TouchableOpacity
			onPress={() => {
				changeWallpaperTo(wallpaper);
			}}
			key={wallpaper.id + "-containerWallpaper"}
			style={{
				justifyContent: "center",
				alignItems: "center",
				width: Dimensions.get("window").width / 3 - theme.spacing(1) * 3,
				height: (Dimensions.get("window").width / 3) * 2,
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
					width: "100%",
					height: "100%",
				}}
			></Image>
		</TouchableOpacity>
	);
};

export default WallpaperPreview;
