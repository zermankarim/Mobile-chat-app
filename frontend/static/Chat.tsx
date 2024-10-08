import { FC, RefObject, useCallback, useRef } from "react";
import {
	Alert,
	Dimensions,
	FlatList,
	Image,
	ScrollView,
	View,
} from "react-native";
import { PaperProvider } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../core/store/store";
import TextWithFont from "../shared/components/TextWithFont";
import {
	ChatRouteProps,
	IUserState,
} from "../shared/types";
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
		replyMessageId,
		setReplyMessageId,
		setChatLoading,
		forwardMsgOwnersList,
		setForwardMsgOwnersList,
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
	const handleDeleteMessages = (selectedFromMenuId?: string) => {
		const participantsIds: string[] = Object.keys(currentChat.participants);
		if (selectedMessages.length) {
			const selectedMessagesIds = selectedMessages.map((selMsgId) => selMsgId);
			connectionState?.emit(
				"deleteMessages",
				currentChat._id,
				selectedMessagesIds,
				participantsIds
			);
		}
		if (selectedFromMenuId) {
			connectionState?.emit(
				"deleteMessages",
				currentChat._id,
				[selectedFromMenuId],
				participantsIds
			);
		}
		setSelectedMessages([]);
	};
	const handleReplyMessage = (selectedFromMenuId?: string) => {
		if (!selectedFromMenuId) {
			setReplyMessageId(selectedMessages[0]);
		} else {
			setReplyMessageId(selectedFromMenuId);
		}
		setForwardMessages(null);
		setSelectedMessages([]);
	};

	useFocusEffect(
		useCallback(() => {
			const { params } = route;
			setChatLoading(true);
			setSelectedMessages([]);
			logoutUserIfTokenHasProblems(dispatch, navigation);
			if (params?.chat) {
				dispatch(setMessages(params.chat.messages!));
			}

			setChatLoading(false);
		}, [route.params?.chat])
	);

	useFocusEffect(
		useCallback(() => {
			setChatLoading(true);
			const { params } = route;
			if (params && params.chat) {
				const allParticipantsIds = params.chat.messages.map(
					(msg) => msg.sender
				);
				const allParticipantsIdsUnique = allParticipantsIds.filter(
					(value, index) => allParticipantsIds.indexOf(value) === index
				);

				connectionState?.emit(
					"getAllParticipantsDataByIds",
					allParticipantsIdsUnique
				);
				connectionState?.on(
					"getAllParticipantsDataByIds",
					(data: {
						success: boolean;
						message?: string;
						allParticipantsData?: IUserState[];
					}) => {
						if (data) {
							const { success } = data;
							if (!success) {
								const { message } = data;
								console.error(message);
								Alert.alert(message!);
								setChatLoading(false);
								return;
							}
							const { allParticipantsData } = data;
							const newCurrChat = {
								...params.chat,
							};
							const newAllParticipantsData: { [id: string]: IUserState } = {};
							allParticipantsData?.forEach((participantData) => {
								const participantId: string = participantData._id!;
								newAllParticipantsData[participantId] = participantData;
							});
							newCurrChat.allParticipantsData = newAllParticipantsData;
							if (forwardMsgOwnersList?.length) {
								forwardMsgOwnersList.forEach((frwdMsgOwner) => {
									if (!newCurrChat.allParticipantsData[frwdMsgOwner._id!]) {
										newCurrChat.allParticipantsData[frwdMsgOwner._id!] =
											frwdMsgOwner;
									}
								});
							}
							dispatch(setCurrentChat(newCurrChat));
							setChatLoading(false);
							scrollToBottom(scrollViewRef);
						} else {
							console.error(
								"Error at getAllParticipantsDataByIds event: data is falsy"
							);
							setChatLoading(false);
						}
					}
				);
			} else {
				setChatLoading(false);
			}
			return () => {
				connectionState?.off("getAllParticipantsDataByIds");
			};
		}, [messages, route.params?.chat])
	);

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
						<FlatList // Container for messages
							// ref={scrollViewRef}
							style={{
								position: "relative",
								flexDirection: "column",
							}}
							contentContainerStyle={{
								justifyContent: "flex-end",
								minHeight: "100%",
								paddingVertical: theme.spacing(3),
							}}
							data={messages}
							keyExtractor={(item) => item._id.toString()}
							initialNumToRender={2}
							maxToRenderPerBatch={2}
							renderItem={({ item }) => (
								<Message
									navigation={navigation}
									message={item}
									handleDeleteMessages={handleDeleteMessages}
									handleReplyMessage={handleReplyMessage}
									theme={theme}
									replyMessage={messages.find(
										(msg) =>
											msg._id?.toString() === item.replyMessage?.toString()
									)}
									selected={
										!!selectedMessages.find((selMsgId) => selMsgId === item._id)
									}
									selectedMessagesIsEmpty={!selectedMessages.length}
								></Message>
							)}
						></FlatList>
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
					{replyMessageId && (
						<ReplyMessage
							replyMessageId={replyMessageId}
							setReplyMessageId={setReplyMessageId}
						></ReplyMessage>
					)}
					{forwardMessages && <ForwardMessages></ForwardMessages>}
					<InputMessage
						replyMessageId={replyMessageId}
						setReplyMessageId={setReplyMessageId}
					></InputMessage>
				</View>
			</PaperProvider>
		)
	);
};

export default Chat;
