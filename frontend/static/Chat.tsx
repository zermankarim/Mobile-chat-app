import { FC, RefObject, useCallback, useEffect, useRef, useState } from "react";
import {
	Alert,
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
import { logoutUserIfTokenHasProblems, verifyJWTToken } from "../fetches/http";
import storage from "../core/storage/storage";
import { logoutUser } from "../core/reducers/user";

const Chat: FC<ChatRouteProps> = ({ navigation }) => {
	// Global context states
	const {
		connectionState,
		chatLoading,
		forwardMessages,
		setForwardMessages,
		appTheme,
		wallpaperPicture,
		wallpaperGradient,
		selectedMessages,
		setSelectedMessages,
		replyMessage,
		setReplyMessage,
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
			setSelectedMessages([]);
			logoutUserIfTokenHasProblems(dispatch, navigation);
			scrollToBottom(scrollViewRef);
		}, [])
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
								width: Dimensions.get("window").width,
								height: Dimensions.get("window").height,
								tintColor: wallpaperPicture
									? "none"
									: theme.colors.contrast[100],
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
							{messages.map((message) => (
								<Message
									key={uuid.v4() + "-messageComponent"}
									navigation={navigation}
									message={message}
									handleDeleteMessages={handleDeleteMessages}
									handleReplyMessage={handleReplyMessage}
									theme={theme}
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
