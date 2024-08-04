import { FC, RefObject, useCallback, useEffect, useRef, useState } from "react";
import {
	Dimensions,
	Image,
	ScrollView,
	StatusBar,
	TouchableOpacity,
	View,
} from "react-native";
import {
	ActivityIndicator,
	Avatar,
	Button,
	PaperProvider,
} from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../core/store/store";
import uuid from "react-native-uuid";
import TextWithFont from "../shared/components/TextWithFont";
import { ChatRouteProps, IMessagePopulated, IUserState } from "../shared/types";
import { scrollToBottom } from "../shared/functions";
import { useGlobalContext } from "../core/context/Context";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { setCurrentChat } from "../core/reducers/currentChat";
import { Ionicons } from "@expo/vector-icons";
import { SERVER_PORT_MAIN, SERVER_URL_MAIN } from "../config";
import InputMessage from "../shared/components/InputMessage";
import { Entypo } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ReplyMessage from "../shared/components/ReplyMessage";
import ForwardMessages from "../shared/components/ForwardMessages";
import Message from "../shared/components/Message";
import { createTheme } from "../shared/theme";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";

const Chat: FC<ChatRouteProps> = ({ navigation }) => {
	// Global context states
	const {
		connectionState,
		chatLoading,
		setChatLoading,
		forwardMessages,
		setForwardMessages,
		appTheme,
		wallpapers,
	} = useGlobalContext();
	const theme = createTheme(appTheme);

	// Redux states and dispatch
	const currentChat = useSelector((state: RootState) => state.currentChat);
	const user = useSelector((state: RootState) => state.user);
	const messages = useSelector((state: RootState) => state.messages);
	const dispatch = useDispatch();

	// Ref
	const scrollViewRef: RefObject<ScrollView> = useRef<ScrollView>(null);

	// States
	const [selectedMessages, setSelectedMessages] = useState<IMessagePopulated[]>(
		[]
	);
	const [oneRecipient, setOneRecipient] = useState<IUserState | null>(null);
	const [replyMessage, setReplyMessage] = useState<IMessagePopulated | null>(
		null
	);

	// Animated
	const userInfoHeight = useSharedValue(40);
	const headerButtonsHeight = useSharedValue(0);

	// Functions
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

	const handleReplyMessage = (selectedFromMenu?: IMessagePopulated) => {
		if (!selectedFromMenu) {
			setReplyMessage(selectedMessages[0]);
		} else {
			setReplyMessage(selectedFromMenu);
		}
		setForwardMessages(null);
		setSelectedMessages([]);
	};

	// Effects
	useEffect(() => {
		scrollToBottom(scrollViewRef);
	}, [messages]);

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
			scrollToBottom(scrollViewRef);
			setChatLoading(false);
		}, [currentChat])
	);

	useFocusEffect(
		useCallback(() => {
			setSelectedMessages([]);
		}, [])
	);

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

	if (chatLoading) {
		return (
			<ActivityIndicator
				size={"large"}
				color={theme.colors.main[100]}
				style={{
					flex: 1,
					backgroundColor: theme.colors.main[500],
				}}
			></ActivityIndicator>
		);
	}

	return (
		<PaperProvider>
			<View
				style={{
					flex: 1,
					backgroundColor: theme.colors.main[500],
				}}
			>
				{/* {Header container} */}
				<View
					style={{
						position: "absolute",
						flexDirection: "row",
						gap: theme.spacing(4),
						width: "100%",
						paddingVertical: theme.spacing(2),
						paddingTop: StatusBar?.currentHeight
							? StatusBar.currentHeight + theme.spacing(2)
							: 0,
						backgroundColor: theme.colors.main[400],
						zIndex: 1,
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
				{/* {Header container} */}
				<Image
					source={
						wallpapers.length
							? { uri: wallpapers.find((wllp) => wllp.selected == true)?.uri }
							: require("../assets/chat-background-items.png")
					}
					style={{
						position: "absolute",
						width: Dimensions.get("window").width,
						height: Dimensions.get("window").height,
						tintColor: wallpapers.length ? "none" : theme.colors.contrast[100],
						opacity: 0.7,
					}}
				></Image>
				{messages.length ? (
					<ScrollView // Container for messages
						ref={scrollViewRef}
						style={{
							position: "relative",
							flexDirection: "column",
							marginTop: 60,
						}}
						contentContainerStyle={{
							justifyContent: "flex-end",
							minHeight: "100%",
							paddingVertical: theme.spacing(3),
						}}
					>
						{messages.map((message) => (
							<Message
								key={uuid.v4() + "-messageComponent"}
								navigation={navigation}
								message={message}
								selectedMessages={selectedMessages}
								setSelectedMessages={setSelectedMessages}
								handleDeleteMessages={handleDeleteMessages}
								handleReplyMessage={handleReplyMessage}
								setReplyMessage={setReplyMessage}
							></Message>
						))}
					</ScrollView>
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
							Enter Your first message!
						</TextWithFont>
					</View>
				)}
				{replyMessage && (
					<ReplyMessage
						replyMessage={replyMessage}
						setReplyMessage={setReplyMessage}
					></ReplyMessage>
				)}
				{forwardMessages && <ForwardMessages></ForwardMessages>}
				<InputMessage
					replyMessage={replyMessage}
					setReplyMessage={setReplyMessage}
				></InputMessage>
			</View>
		</PaperProvider>
	);
};

export default Chat;
