import { FC, useCallback, useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import TextWithFont from "./TextWithFont";
import {
	Entypo,
	Ionicons,
	MaterialCommunityIcons,
	MaterialIcons,
} from "@expo/vector-icons";
import { createTheme } from "../theme";
import { useGlobalContext } from "../../core/context/Context";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";
import { IMessagePopulated, IUserState } from "../types";
import { Avatar, Button } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../core/store/store";
import { setCurrentChat } from "../../core/reducers/currentChat";
import { ParamListBase, useFocusEffect } from "@react-navigation/native";
import { scrollToBottom } from "../functions";
import { SERVER_PORT_MAIN, SERVER_URL_MAIN } from "../../config";
import { DrawerNavigationProp } from "@react-navigation/drawer";

type HeaderForChatProps = {
	navigation: DrawerNavigationProp<ParamListBase, string, undefined>;
};

const HeaderForChat: FC<HeaderForChatProps> = ({ navigation }) => {
	// Global context states
	const {
		appTheme,
		setForwardMessages,
		setChatLoading,
		connectionState,
		selectedMessages,
		setSelectedMessages,
		replyMessage,
		setReplyMessage,
	} = useGlobalContext();

	// Redux states and dispatch
	const currentChat = useSelector((state: RootState) => state.currentChat);
	const user = useSelector((state: RootState) => state.user);
	const dispatch = useDispatch();

	// States
	const [oneRecipient, setOneRecipient] = useState<IUserState | null>(null);

	// Theme
	const theme = createTheme(appTheme);

	// Animated
	const userInfoHeight = useSharedValue(40);
	const headerButtonsHeight = useSharedValue(0);

	// Functions
	const handleReplyMessage = (selectedFromMenu?: IMessagePopulated) => {
		if (!selectedFromMenu) {
			setReplyMessage(selectedMessages[0]);
		} else {
			setReplyMessage(selectedFromMenu);
		}
		setForwardMessages(null);
		setSelectedMessages([]);
	};

	const handleDeleteMessages = (selectedFromMenu?: IMessagePopulated) => {
		const participantsIds: string[] = currentChat.participants.map(
			(participant: IUserState) => participant._id!
		);
		if (selectedMessages) {
			connectionState?.emit(
				"deleteMessages",
				currentChat._id,
				selectedMessages,
				participantsIds
			);
		}
		if (selectedFromMenu) {
			connectionState?.emit(
				"deleteMessages",
				currentChat._id,
				[selectedFromMenu],
				participantsIds
			);
		}
		setSelectedMessages([]);
	};

	// Effects
	useEffect(() => {
		if (selectedMessages.length === 1) {
			userInfoHeight.value = withTiming(0, { duration: 100 });
			headerButtonsHeight.value = withTiming(40, { duration: 100 });
		}
		if (selectedMessages.length === 0) {
			userInfoHeight.value = withTiming(40, { duration: 100 });
			headerButtonsHeight.value = withTiming(0, { duration: 100 });
		}
	}, [selectedMessages]);

	useFocusEffect(
		useCallback(() => {
			setChatLoading(true);
			if (currentChat._id && currentChat.participants.length === 2) {
				const oneRecipientData: IUserState | undefined =
					currentChat.participants.find(
						(participant) => participant._id !== user._id
					);
				if (oneRecipientData) {
					setOneRecipient(oneRecipientData);
				}
			} else {
				setOneRecipient(null);
			}
			connectionState?.emit("getChatById", currentChat._id);
			// scrollToBottom(scrollViewRef);
			setChatLoading(false);
		}, [currentChat])
	);

	return (
		<View
			style={{
				flexDirection: "row",
				gap: theme.spacing(4),
				width: "100%",
				height: 40,
				// paddingVertical: theme.spacing(2),
				backgroundColor: theme.colors.main[400],
			}}
		>
			{selectedMessages.length ? (
				<Animated.View
					style={{
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "space-between",
						height: headerButtonsHeight,
						width: "100%",
						gap: theme.spacing(3),
						paddingHorizontal: theme.spacing(2),
					}}
				>
					<TouchableOpacity
						onPress={() => setSelectedMessages([])}
						style={{
							flexDirection: "row",
							justifyContent: "center",
							alignItems: "center",
							gap: theme.spacing(2),
							padding: theme.spacing(2),
						}}
					>
						<Entypo
							name="cross"
							size={theme.fontSize(5)}
							color={theme.colors.main[100]}
							style={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
							}}
						/>
						<TextWithFont
							styleProps={{
								fontSize: theme.fontSize(4),
							}}
						>
							{selectedMessages.length}
						</TextWithFont>
					</TouchableOpacity>

					<View
						style={{
							flexDirection: "row",
							gap: theme.spacing(6),
						}}
					>
						{selectedMessages.length === 1 && (
							<TouchableOpacity
								onPress={() => handleReplyMessage()}
								style={{
									justifyContent: "center",
									alignItems: "center",
									borderRadius: 8,
								}}
							>
								<Entypo
									name="reply"
									size={theme.fontSize(5)}
									color={theme.colors.main[100]}
								/>
							</TouchableOpacity>
						)}
						<TouchableOpacity
							onPress={() => {
								setForwardMessages(selectedMessages);
								setReplyMessage(null);
								navigation.navigate("Chats");
							}}
							style={{
								justifyContent: "center",
								alignItems: "center",
								borderRadius: 8,
							}}
						>
							<Entypo
								name="forward"
								size={theme.fontSize(5)}
								color={theme.colors.main[100]}
							/>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => handleDeleteMessages()}
							style={{
								justifyContent: "center",
								alignItems: "center",
								borderRadius: 8,
							}}
						>
							<MaterialCommunityIcons
								name="delete-outline"
								size={theme.fontSize(5)}
								color={theme.colors.main[100]}
							/>
						</TouchableOpacity>
					</View>
				</Animated.View>
			) : oneRecipient ? (
				<Animated.View style={{ height: userInfoHeight }}>
					<TouchableOpacity
						onPress={() => {
							navigation.navigate("Profile", { owner: oneRecipient });
						}}
						style={{
							flexDirection: "row",
							alignItems: "center",
							gap: theme.spacing(3),
						}}
					>
						<Button
							style={{
								minWidth: 0,
							}}
						>
							<Ionicons
								name="arrow-back-outline"
								size={24}
								color={theme.colors.main[200]}
								onPress={() => {
									setForwardMessages(null);
									setReplyMessage(null);
									dispatch(
										setCurrentChat({
											_id: "",
											createdAt: "",
											createdBy: {
												_id: "",
												firstName: "",
												lastName: "",
												email: "",
												dateOfBirth: "",
												backgroundColors: [],
												avatars: [],
												friends: [],
											},
											messages: [],
											participants: [],
										})
									);
									navigation.navigate("Chats");
								}}
							/>
						</Button>
						{oneRecipient.avatars.length ? (
							<Avatar.Image
								size={36}
								source={{
									uri: `${SERVER_URL_MAIN}:${SERVER_PORT_MAIN}/${
										oneRecipient.avatars[oneRecipient.avatars.length - 1]
									}`,
								}}
							></Avatar.Image>
						) : (
							<LinearGradient
								colors={oneRecipient.backgroundColors}
								style={{
									justifyContent: "center",
									alignItems: "center",
									height: 36,
									width: 36,
									borderRadius: 50,
								}}
							>
								<TextWithFont
									styleProps={{
										fontSize: theme.fontSize(3),
									}}
								>
									{oneRecipient?.firstName![0] + oneRecipient?.lastName![0]}
								</TextWithFont>
							</LinearGradient>
						)}
						<TextWithFont
							styleProps={{
								fontSize: theme.fontSize(5),
							}}
						>
							{oneRecipient.firstName + " " + oneRecipient.lastName}
						</TextWithFont>
					</TouchableOpacity>
				</Animated.View>
			) : (
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						gap: theme.spacing(2),
					}}
				>
					<MaterialIcons
						name="groups"
						size={48}
						color={theme.colors.main[200]}
					/>
					<TextWithFont>
						{currentChat.participants
							.filter(
								(participant, index) =>
									participant._id !== user._id && index < 3
							)
							.map(
								(participant) =>
									participant.firstName + " " + participant.lastName
							)
							.join(", ") + " and other.."}
					</TextWithFont>
				</View>
			)}
		</View>
	);
};

export default HeaderForChat;
