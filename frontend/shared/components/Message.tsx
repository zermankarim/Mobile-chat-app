import { FC, useCallback, useState } from "react";
import {
	ScreenNavigationProp,
	CustomTheme,
	IMessage,
} from "../types";
import { useSelector } from "react-redux";
import { RootState } from "../../core/store/store";
import { Dimensions, Image, TouchableOpacity, View } from "react-native";

import TextWithFont from "./TextWithFont";
import { SERVER_PORT_MAIN, SERVER_URL_MAIN } from "../../config";
import { LinearGradient } from "expo-linear-gradient";
import { formatMessageDate } from "../functions";
import { Menu } from "react-native-paper";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import { useGlobalContext } from "../../core/context/Context";
import Animated from "react-native-reanimated";
import { useFocusEffect } from "@react-navigation/native";

type MessageProps = {
	navigation: ScreenNavigationProp<"Chat">;
	message: IMessage;
	handleDeleteMessages: (selectedMessageFromMenu?: string) => void;
	handleReplyMessage: (selectedFromMenu?: string) => void;
	theme: CustomTheme;
	selected: boolean;
	selectedMessagesIsEmpty: boolean;
	replyMessage?: IMessage | undefined;
};

const Message: FC<MessageProps> = ({
	navigation,
	message,
	handleDeleteMessages,
	handleReplyMessage,
	theme,
	selected,
	selectedMessagesIsEmpty,
	replyMessage,
}) => {
	// Global context
	const {
		setForwardMessages,
		selectedMessages,
		setSelectedMessages,
		setReplyMessageId,
		setForwardMsgOwnersList,
	} = useGlobalContext();

	// Redux states and dispatch
	const user = useSelector((state: RootState) => state.user);
	const currentChat = useSelector((state: RootState) => state.currentChat);

	//States
	const [visible, setVisible] = useState(false);

	// Functions
	const openMenu = () => setVisible(true);

	const closeMenu = () => setVisible(false);

	const handleSelectMessage = (messageId: string) => {
		const selectedMessageIdx = selectedMessages.findIndex(
			(selMsgId) => selMsgId === messageId
		);
		if (selectedMessageIdx === -1) {
			setSelectedMessages([...selectedMessages, message._id]);
		} else {
			const selectedMessagesCopy = selectedMessages.slice();
			selectedMessagesCopy.splice(selectedMessageIdx, 1);
			setSelectedMessages(selectedMessagesCopy);
		}
	};

	const handleForwardMessage = () => {
		const messageOwner = Object.values(currentChat.allParticipantsData).find(
			(participantData) => participantData._id === message.sender
		);

		if (messageOwner) {
			setForwardMsgOwnersList([messageOwner]);
			setForwardMessages([message]);
			setReplyMessageId(null);
			navigation.navigate("Chats");
		} else {
			console.error(
				"Error at message component at handleForwardMessage: messageOwner is undefined"
			);
		}
	};

	useFocusEffect(
		useCallback(() => {
			return closeMenu();
		}, [])
	);

	return (
		<View
			style={{
				flexDirection: "row",
				alignItems: "center",
				width: "100%",
			}}
		>
			{selectedMessagesIsEmpty ? null : (
				<Animated.View
					style={{
						position: "absolute",
						left: 8,
						width: 20,
						height: 20,
						borderRadius: 40,
						borderColor: "green",
						borderWidth: 1,
						padding: theme.spacing(1),
						zIndex: 1,
					}}
				>
					{selected && (
						<View
							style={{
								backgroundColor: "green",
								width: "100%",
								height: "100%",
								borderRadius: 50,
							}}
						></View>
					)}
				</Animated.View>
			)}
			<Menu
				theme={{ animation: { scale: 2 } }}
				visible={visible}
				onDismiss={closeMenu}
				anchorPosition="top"
				contentStyle={{
					backgroundColor: theme.colors.main[300],
					width: "100%",
				}}
				style={{
					position: "absolute",
					right:
						message.sender === user._id || message.type === "forward"
							? "20%"
							: undefined,
					left:
						message.sender !== user._id && message.forwarder !== user._id
							? "20%"
							: undefined,
					marginRight: 0,
				}}
				anchor={
					<TouchableOpacity // Container for message row
						onPress={() => {
							if (!selectedMessagesIsEmpty) {
								handleSelectMessage(message._id);
							}
						}}
						onLongPress={() => {
							handleSelectMessage(message._id);
						}}
						style={{
							position: "relative",
							flexDirection: "row",
							justifyContent:
								message.sender === user._id ||
								(message.type === "forward" && message.forwarder === user._id)
									? "flex-end"
									: "flex-start",
							width: Dimensions.get("window").width,
							backgroundColor: "transparent",
							paddingHorizontal: theme.spacing(3),
							paddingVertical: theme.spacing(1.5),
							paddingLeft: !selectedMessagesIsEmpty
								? theme.spacing(8)
								: theme.spacing(3),
						}}
					>
						<TouchableOpacity // Container for message
							onLongPress={() => {
								handleSelectMessage(message._id);
							}}
							onPress={() => {
								if (!selectedMessagesIsEmpty) {
									handleSelectMessage(message._id);
								}
								if (selectedMessagesIsEmpty) {
									openMenu();
								}
							}}
							// If message forwarded, it will be rendered with sender styles
							style={{
								flexDirection: "column",
								gap: theme.spacing(1),
								backgroundColor:
									message.sender === user._id ||
									(message.type === "forward" && message.forwarder === user._id)
										? selected
											? theme.colors.contrast[500]
											: theme.colors.contrast[200]
										: selected
										? theme.colors.main[300]
										: theme.colors.main[400],
								paddingVertical: theme.spacing(2),
								paddingHorizontal: theme.spacing(3),
								borderTopLeftRadius: theme.borderRadius(2),
								borderTopRightRadius: theme.borderRadius(2),
								borderBottomLeftRadius:
									message.sender === user._id ||
									(message.type === "forward" && message.forwarder === user._id)
										? theme.borderRadius(2)
										: 0,
								borderBottomRightRadius:
									message.sender === user._id ||
									(message.type === "forward" && message.forwarder === user._id)
										? 0
										: theme.borderRadius(2),
								minWidth: 72,
								maxWidth: "80%",
							}}
						>
							{message.type === "forward" && (
								<View // Container for forward message info
									style={{
										flexDirection: "column",
									}}
								>
									<TextWithFont>Forwarded from</TextWithFont>
									<View
										style={{
											flexDirection: "row",
											gap: theme.spacing(1),
										}}
									>
										{/*If forward message sender has avatars - render last, else - render linear gradient*/}
										{currentChat.allParticipantsData[message.sender]?.avatars
											.length ? (
											<Image
												source={{
													uri: `${SERVER_URL_MAIN}:${SERVER_PORT_MAIN}/${
														currentChat.allParticipantsData[message.sender]
															.avatars[
															currentChat.allParticipantsData[message.sender]
																.avatars.length - 1
														]
													}`,
												}}
												style={{
													width: 20,
													height: 20,
													borderRadius: 40,
												}}
											></Image>
										) : (
											<LinearGradient
												colors={
													currentChat.allParticipantsData[message.sender]
														?.backgroundColors || []
												}
												style={{
													justifyContent: "center",
													alignItems: "center",
													width: 20,
													height: 20,
													borderRadius: 40,
												}}
											>
												<TextWithFont
													styleProps={{
														fontSize: theme.fontSize(2),
													}}
												>
													{currentChat.allParticipantsData[message.sender]
														?.firstName![0] +
														currentChat.allParticipantsData[message.sender]
															?.lastName![0]}
												</TextWithFont>
											</LinearGradient>
										)}
										<TextWithFont
											styleProps={{
												fontWeight: 700,
											}}
										>
											{
												currentChat.allParticipantsData[message.sender]
													?.firstName
											}
										</TextWithFont>
									</View>
								</View>
							)}
							{replyMessage && (
								<View
									style={{
										flexDirection: "row",
										width: "100%",
										borderRadius: theme.spacing(2),
										backgroundColor:
											message.sender === user._id
												? theme.colors.contrast[300]
												: theme.colors.main[300],
										padding: theme.spacing(1),
										gap: theme.spacing(2),
										borderLeftColor: theme.colors.main[100],
										borderLeftWidth: 2,
									}}
								>
									{replyMessage.image && (
										<Image
											source={{
												uri: `${SERVER_URL_MAIN}:${SERVER_PORT_MAIN}/${replyMessage.image}`,
											}}
											style={{
												width: 40,
												height: 40,
												borderRadius: theme.spacing(1),
											}}
										></Image>
									)}
									<View // Container for replied message text
										style={{
											flexDirection: "column",
										}}
									>
										<TextWithFont
											styleProps={{
												color: theme.colors.main[100],
											}}
										>
											{
												currentChat.allParticipantsData[replyMessage.sender]
													?.firstName
											}
										</TextWithFont>

										{replyMessage.text && (
											<TextWithFont
												styleProps={{
													color: theme.colors.main[100],
												}}
											>
												{replyMessage.text}
											</TextWithFont>
										)}
										{replyMessage.image && !replyMessage.text && (
											<TextWithFont
												styleProps={{
													color: theme.colors.main[100],
												}}
											>
												Photo
											</TextWithFont>
										)}
									</View>
								</View>
							)}
							{message.image && (
								<Image
									source={{
										uri: `${SERVER_URL_MAIN}:${SERVER_PORT_MAIN}/${message.image}`,
									}}
									style={{
										width: "100%",
										height: "auto",
										maxHeight: Dimensions.get("window").height * 0.5,
										aspectRatio: 1,
										resizeMode: "cover",
									}}
								></Image>
							)}
							{message.text && (
								<TextWithFont
									styleProps={{
										width: "100%",
										textAlign: "left",
										maxWidth: "100%",
									}}
								>
									{message.text}
								</TextWithFont>
							)}
							<TextWithFont
								styleProps={{
									textAlign: "right",
									width: "100%",
									fontSize: theme.fontSize(3),
									color:
										message.sender === user._id || message.type === "forward"
											? theme.colors.main[100]
											: theme.colors.main[200],
								}}
							>
								{formatMessageDate(message?.createdAt)}
							</TextWithFont>
						</TouchableOpacity>
					</TouchableOpacity>
				}
			>
				<Menu.Item
					onPress={() => {
						closeMenu();
						handleReplyMessage(message._id);
					}}
					title="Reply"
					titleStyle={{
						color: theme.colors.main[100],
					}}
					leadingIcon={() => (
						<Entypo
							name="reply"
							size={theme.fontSize(5)}
							color={theme.colors.main[200]}
						/>
					)}
				/>
				<Menu.Item
					onPress={() => {
						handleForwardMessage();
					}}
					title="Forward"
					titleStyle={{
						color: theme.colors.main[100],
					}}
					leadingIcon={() => (
						<Entypo
							name="forward"
							size={theme.fontSize(5)}
							color={theme.colors.main[200]}
						/>
					)}
				/>
				<Menu.Item
					onPress={() => {
						closeMenu();
						handleDeleteMessages(message._id);
					}}
					title="Delete"
					titleStyle={{
						color: theme.colors.main[100],
					}}
					leadingIcon={() => (
						<MaterialCommunityIcons
							name="delete-outline"
							size={theme.fontSize(5)}
							color={theme.colors.main[200]}
						/>
					)}
				/>
			</Menu>
		</View>
	);
};

export default Message;
