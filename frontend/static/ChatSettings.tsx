import {
	Alert,
	Dimensions,
	Image,
	Platform,
	TouchableOpacity,
	View,
} from "react-native";
import TextWithFont from "../shared/components/TextWithFont";
import { FC, useCallback, useState } from "react";
import { createTheme } from "../shared/theme";
import { useGlobalContext } from "../core/context/Context";
import { ChatSettingsRouteProps, ThemeType } from "../shared/types";
import { ScrollView } from "react-native-gesture-handler";
import uuid from "react-native-uuid";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../core/store/store";
import storage from "../core/storage/storage";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "@react-navigation/native";
import { logoutUserIfTokenHasProblems } from "../fetches/http";

const ChatSettings: FC<ChatSettingsRouteProps> = ({ navigation }) => {
	// Global context
	const { appTheme, setAppTheme, wallpaperPicture, wallpaperGradient } =
		useGlobalContext();

	// Redux states and dispatch
	const user = useSelector((state: RootState) => state.user);
	const dispatch = useDispatch();

	// Theme states
	const theme = createTheme(appTheme);

	const themeTitles: ThemeType[] = [
		"default",
		"light",
		"darkBlue",
		"black",
		"green",
		"purple",
		"yellow",
	];

	// Functions
	const handleSetNewTheme = async (themeTitle: ThemeType) => {
		const themeTitlesArr: ThemeType[] = await storage.getAllDataForKey(
			"themeTitle"
		);
		const themeTitleIds = await storage.getIdsForKey("themeTitle");
		if (!themeTitlesArr.length || !themeTitleIds.length) {
			setAppTheme("default");
			return storage.save({
				key: "themeTitle",
				id: uuid.v4().toString(),
				data: "default",
			});
		} else {
			await storage.save({
				key: "themeTitle",
				id: themeTitleIds[0],
				data: themeTitle,
			});
			const updatedThemeTitles: ThemeType[] = await storage.getAllDataForKey(
				"themeTitle"
			);
			setAppTheme(updatedThemeTitles[0]);
		}
	};

	// Effects
	useFocusEffect(
		useCallback(() => {
			logoutUserIfTokenHasProblems(dispatch, navigation);
		}, [])
	);

	return (
		<View
			style={{
				width: "100%",
				height: "100%",
				backgroundColor: theme.colors.main[500],
			}}
		>
			<View // Outer Container for chat example
				style={{
					backgroundColor: theme.colors.main[500],
				}}
			>
				{wallpaperGradient ? (
					<>
						<LinearGradient
							colors={wallpaperGradient.colors}
							start={{ x: 0.1, y: 0.1 }}
							end={{ x: 0.9, y: 0.9 }}
							style={{
								position: "absolute",
								width: "100%",
								height: "100%",
							}}
						></LinearGradient>
						{wallpaperGradient.withImage && (
							<Image
								source={require("../assets/chat-background-items.png")}
								style={{
									position: "absolute",
									opacity: 0.7,
									width: "100%",
									height: "100%",
								}}
								tintColor={wallpaperGradient.imageColor}
							></Image>
						)}
					</>
				) : (
					<Image
						source={
							wallpaperPicture
								? { uri: wallpaperPicture.uri }
								: require("../assets/chat-background-items.png")
						}
						style={{
							position: "absolute",
							width: "100%",
							height: "100%",
							tintColor: wallpaperPicture ? "none" : theme.colors.contrast[100],
							opacity: 0.7,
						}}
					></Image>
				)}
				<TouchableOpacity // Container for message row
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
							{"Hello! How are you? :)"}
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
							Some Text
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
			<TouchableOpacity
				onPress={() => navigation.navigate("ChangeWallpaper")}
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
					Change wallpaper
				</TextWithFont>
			</TouchableOpacity>
			<View
				style={{
					width: "100%",
					minHeight: 50,
					paddingVertical: theme.spacing(4),
					paddingHorizontal: theme.spacing(2),
					backgroundColor: theme.colors.main[400],
				}}
			>
				<TextWithFont
					styleProps={{
						paddingHorizontal: theme.spacing(2),
					}}
				>
					Themes
				</TextWithFont>
				<ScrollView
					horizontal
					contentContainerStyle={{
						flexDirection: "row",
					}}
				>
					{themeTitles.map((themeTitle) => {
						const themeExample = createTheme(themeTitle);
						return (
							<TouchableOpacity
								key={uuid.v4() + "-containerThemeExample"}
								onPress={() => handleSetNewTheme(themeTitle)}
								style={{
									padding: themeExample.spacing(2),
								}}
							>
								<View
									style={{
										flexDirection: "column",
										width: 100,
										height: 200,
										backgroundColor: themeExample.colors.main[500],
										borderRadius: themeExample.spacing(2),
										padding: themeExample.spacing(2),
									}}
								>
									<View
										style={{
											flexDirection: "row",
											justifyContent: "flex-start",
											width: "100%",
										}}
									>
										<View
											style={{
												width: 40,
												height: 20,
												backgroundColor: themeExample.colors.main[300],
												paddingVertical: themeExample.spacing(2),
												paddingHorizontal: themeExample.spacing(3),
												borderTopLeftRadius: themeExample.borderRadius(2),
												borderTopRightRadius: themeExample.borderRadius(2),
												borderBottomLeftRadius: 0,
												borderBottomRightRadius: themeExample.borderRadius(2),
											}}
										></View>
									</View>
									<View
										style={{
											flexDirection: "row",
											justifyContent: "flex-end",
											width: "100%",
										}}
									>
										<View
											style={{
												width: 40,
												height: 20,
												backgroundColor: themeExample.colors.main[300],
												paddingVertical: themeExample.spacing(2),
												paddingHorizontal: themeExample.spacing(3),
												borderTopLeftRadius: themeExample.borderRadius(2),
												borderTopRightRadius: themeExample.borderRadius(2),
												borderBottomLeftRadius: themeExample.borderRadius(2),
												borderBottomRightRadius: 0,
											}}
										></View>
									</View>
								</View>
								<View
									style={{
										position: "absolute",
										bottom: "10%",
										left: "50%",
										justifyContent: "center",
										alignItems: "center",
										width: 20,
										height: 20,
										borderRadius: 40,
										borderColor: theme.colors.contrast[400],
										borderWidth: 1,
										padding: theme.spacing(0.5),
									}}
								>
									{themeTitle === appTheme && (
										<View
											style={{
												width: "100%",
												height: "100%",
												backgroundColor: theme.colors.contrast[400],
												borderRadius: 100,
											}}
										></View>
									)}
								</View>
							</TouchableOpacity>
						);
					})}
				</ScrollView>
			</View>
		</View>
	);
};

export default ChatSettings;
