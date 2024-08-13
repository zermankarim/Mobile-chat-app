import { FC, useCallback, useEffect, useState } from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
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
import { IMessage, IMessagePopulated, IUserState } from "../types";
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
		connectionState,
		selectedMessages,
		setSelectedMessages,
		setReplyMessageId,
		chatLoading,
	} = useGlobalContext();

	// Redux states and dispatch
	const currentChat = useSelector((state: RootState) => state.currentChat);
	const user = useSelector((state: RootState) => state.user);
	const messages = useSelector((state: RootState) => state.messages);
	const dispatch = useDispatch();

	// States
	const [oneRecipient, setOneRecipient] = useState<IUserState | null>(null);

	// Theme
	const theme = createTheme(appTheme);

	// Animated
	const userInfoOpacity = useSharedValue(40);
	const headerButtonOpacity = useSharedValue(0);

	// Functions
	const handleReplyMessage = (
		selectedFromMenu?: IMessage | IMessagePopulated
	) => {
		if (!selectedFromMenu) {
			setReplyMessageId(selectedMessages[0]);
		} else {
			setReplyMessageId(selectedFromMenu._id);
		}
		setForwardMessages(null);
		setSelectedMessages([]);
	};

	const handleForwardMessages = () => {
		const forwardMessages = messages.filter((msg) => {
			if (selectedMessages.some((selMsgId) => selMsgId === msg._id)) {
				return msg;
			}
		});
 
		setForwardMessages(forwardMessages);
		setReplyMessageId(null);
		navigation.navigate("Chats");
	};

	const handleDeleteMessages = (selectedFromMenu?: IMessagePopulated) => {
		const participantsIds: string[] = Object.values(
			currentChat.participants
		).map((participant) => participant._id!);
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
				[selectedFromMenu._id],
				participantsIds
			);
		}
		setSelectedMessages([]);
	};

	// Effects
	useEffect(() => {
		if (selectedMessages.length === 1) {
			userInfoOpacity.value = withTiming(0, { duration: 300 });
			headerButtonOpacity.value = withTiming(1, { duration: 300 });
		}
		if (selectedMessages.length === 0) {
			userInfoOpacity.value = withTiming(40, { duration: 300 });
			headerButtonOpacity.value = withTiming(0, { duration: 300 });
		}
	}, [selectedMessages]);

	useFocusEffect(
		useCallback(() => {
			if (currentChat) {
				if (
					currentChat._id &&
					Object.keys(currentChat.participants).length === 2
				) {
					const oneRecipientData: IUserState = Object.values(
						currentChat.participants
					).find((participant) => participant._id !== user._id)!;
					if (oneRecipientData) {
						setOneRecipient(oneRecipientData);
					}
				} else {
					setOneRecipient(null);
				}
			}
		}, [currentChat!])
	);

	return (
		<View
			style={{
				flexDirection: "row",
				gap: theme.spacing(4),
				width: "100%",
				paddingVertical: theme.spacing(2),
				minHeight: 40,
				backgroundColor: theme.colors.main[400],
			}}
		>
			{selectedMessages.length ? (
				<Animated.View
					style={{
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "space-between",
						width: "100%",
						gap: theme.spacing(3),
						paddingHorizontal: theme.spacing(2),
						opacity: headerButtonOpacity,
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
								handleForwardMessages();
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
			) : chatLoading ? (
				<ActivityIndicator
					size={32}
					color={theme.colors.main[100]}
					style={{
						flex: 1,
						backgroundColor: theme.colors.main[400],
					}}
				></ActivityIndicator>
			) : oneRecipient ? (
				<Animated.View
					style={{ flexDirection: "row", opacity: userInfoOpacity }}
				>
					<Button
						style={{
							minWidth: 0,
						}}
						onPress={() => {
							setForwardMessages(null);
							setReplyMessageId(null);
							navigation.navigate("Chats");
						}}
					>
						<Ionicons
							name="arrow-back-outline"
							size={24}
							color={theme.colors.main[200]}
						/>
					</Button>
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
						{Object.values(currentChat.participants)
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
