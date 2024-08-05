import { FC, useCallback, useEffect } from "react";
import { Dimensions, TouchableOpacity, View } from "react-native";
import TextWithFont from "../shared/components/TextWithFont";
import { CreateChatRouteProps, IUserState } from "../shared/types";
import { ActivityIndicator, Avatar } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import uuid from "react-native-uuid";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../core/store/store";
import { LinearGradient } from "expo-linear-gradient";
import { useGlobalContext } from "../core/context/Context";
import { useFocusEffect } from "@react-navigation/native";
import { SERVER_PORT_MAIN, SERVER_URL_MAIN } from "../config";
import { createTheme } from "../shared/theme";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";
import { logoutUserIfTokenHasProblems } from "../fetches/http";

const CreateChat: FC<CreateChatRouteProps> = ({ navigation }) => {
	// Global context states
	const {
		usersForChat,
		setUsersForChat,
		connectionState,
		createChatLoading,
		setCreateChatLoading,
		setChatLoading,
		appTheme,
	} = useGlobalContext();
	const theme = createTheme(appTheme);

	// Redux states and dispatch
	const user = useSelector((state: RootState) => state.user);
	const dispatch = useDispatch();

	// Functions
	const handleOpenChatWithUser = async (userForChat: IUserState) => {
		setChatLoading(true);
		setCreateChatLoading(true);
		connectionState?.emit("openChatWithUser", user._id!, userForChat._id!);
	};

	// Effects
	useEffect(() => {
		logoutUserIfTokenHasProblems(dispatch, navigation);

		setCreateChatLoading(true);
	}, []);

	useFocusEffect(
		useCallback(() => {
			connectionState?.emit("getUsersForCreateChat", user._id!);
		}, [])
	);

	if (createChatLoading) {
		return (
			<ActivityIndicator
				size={"large"}
				color={theme.colors.main[200]}
				style={{
					flex: 1,
					backgroundColor: theme.colors.main[400],
				}}
			></ActivityIndicator>
		);
	}
	return (
		<Animated.View // Container for "Create chat" page
			style={{
				flex: 1,
				backgroundColor: theme.colors.main[400],
			}}
		>
			<ScrollView // Container for users for creating the chat
				style={{
					flexDirection: "column",
					padding: theme.spacing(2),
					minHeight: "100%",
				}}
			>
				{usersForChat.length ? (
					usersForChat
						.sort((a, b) => a.firstName!.localeCompare(b.firstName!))
						.map((userForChat) => (
							<TouchableOpacity // Container for one user for creating the chat
								key={uuid.v4() + "-userForChat-container"}
								onPress={() => handleOpenChatWithUser(userForChat)}
								style={{
									flexDirection: "row",
									alignItems: "center",
									gap: theme.spacing(2),
									padding: theme.spacing(2),
								}}
							>
								{userForChat.avatars.length ? (
									<Avatar.Image
										size={48}
										source={{
											uri: `${SERVER_URL_MAIN}:${SERVER_PORT_MAIN}/${
												userForChat.avatars[userForChat.avatars.length - 1]
											}`,
										}}
									></Avatar.Image>
								) : (
									<LinearGradient
										colors={userForChat.backgroundColors}
										style={{
											justifyContent: "center",
											alignItems: "center",
											width: 48,
											height: 48,
											borderRadius: 50,
										}}
									>
										<TextWithFont>
											{userForChat?.firstName![0] + userForChat?.lastName![0]}
										</TextWithFont>
									</LinearGradient>
								)}
								<View // Container for user names and email
									style={{
										flexDirection: "column",
									}}
								>
									<TextWithFont>
										{userForChat.firstName + " " + userForChat.lastName}
									</TextWithFont>
									<TextWithFont
										styleProps={{
											color: theme.colors.main[200],
											fontSize: theme.fontSize(3),
										}}
									>
										{userForChat.email}
									</TextWithFont>
								</View>
							</TouchableOpacity>
						))
				) : (
					<View
						style={{
							flex: 1,
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<TextWithFont
							styleProps={{
								color: theme.colors.main[200],
							}}
						>
							Users for creating chat not found
						</TextWithFont>
					</View>
				)}
			</ScrollView>
		</Animated.View>
	);
};

export default CreateChat;
