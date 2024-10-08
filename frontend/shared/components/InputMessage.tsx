import { FC, useCallback, useState } from "react";
import {
	Alert,
	Image,
	NativeSyntheticEvent,
	Platform,
	TextInputChangeEventData,
	View,
} from "react-native";

import { Button, Modal, TextInput } from "react-native-paper";
import { IMessage } from "../types";
import uuid from "react-native-uuid";
import { MaterialIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../core/store/store";
import { useGlobalContext } from "../../core/context/Context";
import { Entypo } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { uploadNewImage } from "../../fetches/http";
import { useFocusEffect } from "@react-navigation/native";
import { createTheme } from "../theme";

type InputMessageProps = {
	replyMessageId: string | null;
	setReplyMessageId: (newState: string | null) => void;
};

const InputMessage: FC<InputMessageProps> = ({
	replyMessageId,
	setReplyMessageId,
}) => {
	// Global context states
	const {
		connectionState,
		forwardMessages,
		setForwardMessages,
		appTheme,
		forwardMsgOwnersList,
	} = useGlobalContext();
	const theme = createTheme(appTheme);

	// Redux states and dispatch
	const currentChat = useSelector((state: RootState) => state.currentChat);
	const user = useSelector((state: RootState) => state.user);
	const messages = useSelector((state: RootState) => state.messages);
	const dispatch = useDispatch();

	// States
	const [disabledSendButton, setDisabledSendButton] = useState<boolean>(true);
	const [messageText, setMessageText] = useState<string | undefined>("");
	const [imageForMessageURI, setImageForMessageURI] = useState<string | null>(
		null
	);
	const [visibleModal, setVisibleModal] = useState(false);

	// Functions
	const handleChangeMessageText = (text: string) => {
		const regExp = /^\s*$/;
		setMessageText(text);
		if (!regExp.test(text)) {
			setDisabledSendButton(false);
		} else {
			setDisabledSendButton(true);
		}
	};

	const handlePickImage = async () => {
		// If user doesn't get permission for camera and gallery
		if (Platform.OS !== "web") {
			const permissionResult =
				await ImagePicker.requestCameraPermissionsAsync();
			if (permissionResult.granted === false) {
				Alert.alert(
					"Sorry, we need camera roll permissions to make this work!"
				);
				return;
			}
		}

		// else
		try {
			let result = await ImagePicker.launchImageLibraryAsync({
				allowsEditing: true,
				quality: 1,
				// aspect: [1, 1],
				// allowsMultipleSelection: true,
			});

			if (!result.canceled) {
				const imageURI = result.assets[0].uri;
				// uploadImage(imageURI);
				setImageForMessageURI(imageURI);
				setVisibleModal(true);
			}
		} catch (e: any) {
			console.error(e.message);
		}
	};

	const uploadImage = async () => {
		try {
			const response = await fetch(imageForMessageURI!);
			const blob: Blob = await response.blob();
			const data = await uploadNewImage(blob, {
				type: "message",
				chatId: currentChat._id,
			});
			if (data) {
				const { success } = data;
				if (!success) {
					const { message } = data;
					console.error("Error during uploading image: ", message);
					setImageForMessageURI(null);
					setVisibleModal(false);
					setDisabledSendButton(true);
					Alert.alert("Error during uploading image: ", message);
					return;
				}
				const { relativePath } = data;
				return relativePath;
			}
		} catch (e: any) {
			console.error("Error during uploading image: ", e.message);
			setImageForMessageURI(null);
			setVisibleModal(false);
			setDisabledSendButton(true);
			return;
		}
	};

	const onSend = async () => {
		const newMessagesArr: IMessage[] = [];

		if (messageText || imageForMessageURI) {
			const newMessage: IMessage = {
				_id: uuid.v4().toString(),
				createdAt: new Date().toISOString(),
				sender: user._id!,
				type: "default",
				status: "sending",
				read: false,
			};

			if (messageText) {
				newMessage.text = messageText;
				setMessageText("");
			}
			if (imageForMessageURI) {
				const relativePath = await uploadImage();
				newMessage.image = relativePath;
			}

			if (replyMessageId) {
				newMessage.replyMessage = replyMessageId;
			}

			newMessagesArr.push(newMessage);
		}

		if (forwardMessages) {
			const updForwardMessages: IMessage[] = forwardMessages.map((frwdMsg) => ({
				...frwdMsg,
				_id: uuid.v4().toString(),
				createdAt: new Date().toISOString(),
				forwarder: user._id!,
				type: "forward",
			}));
			newMessagesArr.push(...updForwardMessages);
		}

		const participantsIds: string[] = Object.values(
			currentChat.participants
		).map((participant) => participant._id!);
		connectionState?.emit(
			"sendMessage",
			currentChat._id,
			newMessagesArr,
			participantsIds
		);

		setImageForMessageURI(null);
		setVisibleModal(false);
		setDisabledSendButton(true);
		setForwardMessages(null);
		setReplyMessageId(null);
	};

	// Effects
	useFocusEffect(
		useCallback(() => {
			return () => {
				setImageForMessageURI(null);
				setVisibleModal(false);
			};
		}, [])
	);

	return !imageForMessageURI ? (
		<View // Container for input message and send message button
			style={{
				flexDirection: "row",
				alignItems: "flex-end",
				width: "100%",
				backgroundColor: theme.colors.main[400],
			}}
		>
			<TextInput
				placeholder="Message"
				multiline
				// numberOfLines={4}
				value={messageText}
				placeholderTextColor={theme.colors.main[200]}
				onChange={(e: NativeSyntheticEvent<TextInputChangeEventData>) => {
					handleChangeMessageText(e.nativeEvent.text);
				}}
				textColor={theme.colors.main[100]}
				style={{
					width: "70%",
					maxHeight: 128,
					backgroundColor: theme.colors.main[400],
				}}
			></TextInput>
			<View
				style={{
					flex: 1,
					flexDirection: "row",
					justifyContent: "flex-end",
					paddingVertical: 12,
				}}
			>
				{!forwardMessages && (
					<Button
						onPress={handlePickImage}
						style={{
							justifyContent: "center",
							alignItems: "center",
							minWidth: 0,
						}}
					>
						<Entypo
							name="attachment"
							size={20}
							color={theme.colors.contrast[400]}
						/>
					</Button>
				)}
				{!disabledSendButton || forwardMessages ? (
					<Button
						onPress={onSend}
						style={{
							justifyContent: "center",
							alignItems: "center",
							minWidth: 0,
						}}
					>
						<MaterialIcons
							name="send"
							size={24}
							color={theme.colors.contrast[400]}
						/>
					</Button>
				) : null}
			</View>
		</View>
	) : (
		<Modal // Modal image, input message and send message button
			visible={visibleModal}
			onDismiss={() => {
				setVisibleModal(false);
				setImageForMessageURI(null);
			}}
			contentContainerStyle={{
				justifyContent: "space-between",
				gap: 12,
				width: "100%",
				height: "100%",
				backgroundColor: "#000000a2",
			}}
		>
			<View // Container for modal image
				style={{
					flexDirection: "column",
					justifyContent: "space-between",
					flex: 1,
				}}
			>
				<Image
					source={{ uri: imageForMessageURI }}
					style={{
						width: "100%",
						height: "100%",
						objectFit: "contain",
					}}
				></Image>
			</View>

			<View // Container for input message and send message button
				style={{
					flexDirection: "row",
					alignItems: "flex-end",
					width: "100%",
					backgroundColor: theme.colors.main[400],
				}}
			>
				<TextInput
					placeholder="Message"
					multiline
					// numberOfLines={4}
					outlineColor="red"
					activeOutlineColor="red"
					value={messageText}
					placeholderTextColor={theme.colors.main[200]}
					onChange={(e: NativeSyntheticEvent<TextInputChangeEventData>) => {
						handleChangeMessageText(e.nativeEvent.text);
					}}
					textColor={theme.colors.main[100]}
					style={{
						width: "80%",
						maxHeight: 128,
						backgroundColor: theme.colors.main[400],
					}}
				></TextInput>
				<View
					style={{
						flex: 1,
						flexDirection: "row",
						paddingVertical: 12,
					}}
				>
					<Button
						onPress={onSend}
						style={{
							justifyContent: "center",
							alignItems: "center",
							minWidth: 0,
							width: "100%",
						}}
					>
						<MaterialIcons
							name="send"
							size={24}
							color={theme.colors.contrast[400]}
						/>
					</Button>
				</View>
			</View>
		</Modal>
	);
};

export default InputMessage;
