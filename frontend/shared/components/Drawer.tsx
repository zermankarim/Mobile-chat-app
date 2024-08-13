import React, { useEffect } from "react";
import { SafeAreaView, View } from "react-native";

import TextWithFont from "./TextWithFont";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../core/store/store";
import { Avatar, Button } from "react-native-paper";
import { FontAwesome } from "@expo/vector-icons";
import { DrawerNavigationState, ParamListBase } from "@react-navigation/native";
import {
	DrawerDescriptorMap,
	DrawerNavigationHelpers,
} from "@react-navigation/drawer/lib/typescript/src/types";
import uuid from "react-native-uuid";
import { IButtonDrawer, ThemeType } from "../types";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SimpleLineIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { logoutUser } from "../../core/reducers/user";
import { LinearGradient } from "expo-linear-gradient";
import { useGlobalContext } from "../../core/context/Context";
import { SERVER_PORT_MAIN, SERVER_URL_MAIN } from "../../config";
import { createTheme } from "../theme";
import Feather from "@expo/vector-icons/Feather";
import Entypo from "@expo/vector-icons/Entypo";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";
import { storageMMKV } from "../../core/storage/storageMMKV";

type DrawerProps = {
	state: DrawerNavigationState<ParamListBase>;
	navigation: DrawerNavigationHelpers;
	descriptors: DrawerDescriptorMap;
};

function DrawerContent({ ...props }) {
	// Global context
	const { connectionState, setConnectionState, appTheme, setAppTheme } =
		useGlobalContext();
	const theme = createTheme(appTheme);

	// Redux states and dispatch
	const user = useSelector((state: RootState) => state.user);
	const dispatch = useDispatch();

	// Animated styles
	const widthMoon = useSharedValue(appTheme === "light" ? 0 : 40);
	const widthSun = useSharedValue(appTheme === "light" ? 40 : 0);

	const handleLogountButton = () => {
		dispatch(logoutUser());
	};

	const handleChangeTheme = async () => {
		const themeTitle: ThemeType | undefined = storageMMKV.getString(
			"themeTitle"
		) as ThemeType | undefined;
		if (!themeTitle) {
			setAppTheme("default");
			return storageMMKV.set("themeTitle", "default");
		}

		if (themeTitle !== "light") {
			storageMMKV.set("themeTitle", "light");
		} else {
			storageMMKV.set("themeTitle", "default");
		}
		const updatedThemeTitle: ThemeType = storageMMKV.getString(
			"themeTitle"
		) as ThemeType;

		setAppTheme(updatedThemeTitle);
	};

	useEffect(() => {
		if (appTheme !== "light") {
			widthSun.value = withTiming(40);
			widthMoon.value = withTiming(0);
		} else {
			widthMoon.value = withTiming(40);
			widthSun.value = withTiming(0);
		}
	}, [appTheme]);

	const drawerButtonsData: IButtonDrawer[] = [
		{
			title: "My profile",
			icon: (
				<FontAwesome
					name="user-circle-o"
					size={24}
					color={theme.colors.main[200]}
				/>
			),
			onPress: () => {
				props.navigation.jumpTo("Profile", { owner: user });
				props.navigation.closeDrawer();
			},
		},
		{
			title: "Chats",
			icon: (
				<Ionicons
					name="chatbubble-ellipses-outline"
					size={24}
					color={theme.colors.main[200]}
				/>
			),
			onPress: () => {
				props.navigation.closeDrawer();
				props.navigation.jumpTo("Chats");
			},
		},
		{
			title: "Settings",
			icon: (
				<SimpleLineIcons
					name="settings"
					size={24}
					color={theme.colors.main[200]}
				/>
			),
			onPress: () => {
				props.navigation.closeDrawer();
				props.navigation.jumpTo("ChatSettings");
			},
		},
		{
			title: "Log Out",
			icon: (
				<MaterialCommunityIcons
					name="logout"
					size={24}
					color={theme.colors.main[200]}
				/>
			),
			onPress: () => {
				props.navigation.closeDrawer();
				connectionState?.disconnect();
				setConnectionState(null);
				handleLogountButton();
			},
		},
	];

	return (
		<SafeAreaView // Container for Drawer
			style={{
				flex: 1,
				backgroundColor: theme.colors.main[300],
			}}
		>
			<View // Container for Drawer header
				style={{
					flexDirection: "column",
					alignItems: "center",
					gap: theme.spacing(2),
					backgroundColor: theme.colors.main[300],
					padding: theme.spacing(3),
					paddingTop: theme.spacing(10),
				}}
			>
				<View // Outer container for user avatar
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						width: "100%",
					}}
				>
					<TouchableOpacity // Inner container for user avatar
						onPress={() => {
							props.navigation.closeDrawer();
							props.navigation.jumpTo("Profile", { owner: user });
						}}
					>
						{user?.avatars.length ? (
							<Avatar.Image
								size={64}
								source={{
									uri: `${SERVER_URL_MAIN}:${SERVER_PORT_MAIN}/${
										user.avatars[user.avatars.length - 1]
									}`,
								}}
							></Avatar.Image>
						) : (
							<LinearGradient
								colors={user.backgroundColors}
								style={{
									justifyContent: "center",
									alignItems: "center",
									width: 64,
									height: 64,
									borderRadius: 50,
								}}
							>
								<TextWithFont
									styleProps={{
										fontSize: theme?.fontSize(5),
									}}
								>
									{user?.firstName![0] + user?.lastName![0]}
								</TextWithFont>
							</LinearGradient>
						)}
					</TouchableOpacity>
					<View // Container for change theme icon
						style={{
							width: 40,
						}}
					>
						<TouchableOpacity
							onPress={handleChangeTheme}
							style={{
								flexDirection: "row",
							}}
						>
							<Animated.View
								style={{
									width: widthMoon,
								}}
							>
								<Entypo name="moon" size={24} color={theme.colors.main[100]} />
							</Animated.View>

							<Animated.View
								style={{
									width: widthSun,
								}}
							>
								<Feather
									name="sun"
									size={24}
									color={theme.colors.main[100]}
									style={{}}
								/>
							</Animated.View>
						</TouchableOpacity>
					</View>
				</View>
				<View // Container for user name and email
					style={{
						flexDirection: "column",
						width: "100%",
					}}
				>
					<TextWithFont
						styleProps={{
							color: theme.colors.main[100],
							fontSize: theme.fontSize(4),
						}}
					>
						{user.firstName + " " + user.lastName}
					</TextWithFont>
					<TextWithFont
						styleProps={{
							color: theme.colors.main[200],
							fontSize: theme.fontSize(3),
						}}
					>
						{user.email}
					</TextWithFont>
				</View>
			</View>
			<View // Container for Drawer buttons
				style={{
					flex: 1,
					flexDirection: "column",
					backgroundColor: theme.colors.main[400],
					width: "100%",
					minHeight: "100%",
					padding: theme.spacing(2),
				}}
			>
				{drawerButtonsData.map((buttonData: IButtonDrawer) => (
					<TouchableOpacity // Container for drawer button
						key={buttonData.title + "-containerDrawerButton"}
						onPress={buttonData.onPress}
						style={{
							flexDirection: "row",
							alignItems: "center",
							gap: theme.spacing(4),
							width: "100%",
							paddingHorizontal: theme.spacing(2),
							paddingVertical: theme.spacing(3),
						}}
					>
						{buttonData.icon}
						<TextWithFont
							styleProps={{
								fontSize: theme.fontSize(4),
							}}
						>
							{buttonData.title}
						</TextWithFont>
					</TouchableOpacity>
				))}
			</View>
		</SafeAreaView>
	);
}

export default DrawerContent;
