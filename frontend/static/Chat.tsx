import { FC, RefObject, useCallback, useRef } from "react";
import { Dimensions, Image, ScrollView, View } from "react-native";
import { ActivityIndicator, PaperProvider } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../core/store/store";
import TextWithFont from "../shared/components/TextWithFont";
import { ChatRouteProps, IMessagePopulated, IUserState } from "../shared/types";
import { scrollToBottom } from "../shared/functions";
import { useGlobalContext } from "../core/context/Context";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { setCurrentChat } from "../core/reducers/currentChat";
import InputMessage from "../shared/components/InputMessage";
import ReplyMessage from "../shared/components/ReplyMessage";
import ForwardMessages from "../shared/components/ForwardMessages";
import Message from "../shared/components/Message";
import { createTheme } from "../shared/theme";
import { logoutUserIfTokenHasProblems } from "../fetches/http";
import { setMessages } from "../core/reducers/messages";

const Chat: FC<ChatRouteProps> = ({ navigation, route }) => {
	// Global context states
	const {
		connectionState,
		chatLoading,
		forwardMessages,
		setForwardMessages,
		appTheme,
		wallpaper,
		selectedMessages,
		setSelectedMessages,
		replyMessage,
		setReplyMessage,
		setChatLoading,
	} = useGlobalContext();
	const theme = createTheme(appTheme);

	// Redux states and dispatch
	const currentChat = useSelector((state: RootState) => state.currentChat);
	const user = useSelector((state: RootState) => state.user);
	const messages = useSelector((state: RootState) => state.messages);
	const dispatch = useDispatch();

	// Ref
	const scrollViewRef: RefObject<ScrollView> = useRef<ScrollView>(null);

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

	useFocusEffect(
		useCallback(() => {
			const { params } = route;
			setChatLoading(true);
			setSelectedMessages([]);
			dispatch(setMessages(params?.chat.messages!));
			dispatch(setCurrentChat(params?.chat!));
			logoutUserIfTokenHasProblems(dispatch, navigation);
			setChatLoading(false);
		}, [route.params?.chat])
	);

	useFocusEffect(
		useCallback(() => {
			scrollToBottom(scrollViewRef);
		}, [messages])
	);

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
		user._id && (
			<PaperProvider>
				<View
					style={{
						flex: 1,
						backgroundColor: theme.colors.main[500],
					}}
				>
					{wallpaper?.type === "wallpaperGradient" ? (
						<>
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
									}}
									tintColor={wallpaper.imageColor}
								></Image>
							)}
						</>
					) : (
						<Image
							source={
								wallpaper
									? { uri: wallpaper.uri }
									: require("../assets/chat-background-items.png")
							}
							style={{
								position: "absolute",
								width: Dimensions.get("window").width,
								height: Dimensions.get("window").height,
								opacity: 0.7,
							}}
						></Image>
					)}
					{messages.length ? (
						<ScrollView // Container for messages
							ref={scrollViewRef}
							style={{
								position: "relative",
								flexDirection: "column",
							}}
							contentContainerStyle={{
								justifyContent: "flex-end",
								minHeight: "100%",
								paddingVertical: theme.spacing(3),
							}}
						>
							{!chatLoading &&
								messages.map((message) => (
									<Message
										key={message._id + "-messageComponent"}
										navigation={navigation}
										message={message}
										handleDeleteMessages={handleDeleteMessages}
										handleReplyMessage={handleReplyMessage}
										theme={theme}
										selected={selectedMessages.includes(message)}
										selectedMessagesIsEmpty={!selectedMessages.length}
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
		)
	);
};

export default Chat;
