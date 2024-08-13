import { Entypo } from "@expo/vector-icons";
import { Image, TouchableOpacity, View } from "react-native";
import { SERVER_PORT_MAIN, SERVER_URL_MAIN } from "../../config";
import TextWithFont from "./TextWithFont";
import { IMessage, IMessagePopulated } from "../types";
import { FC, useEffect, useState } from "react";
import { createTheme } from "../theme";
import { useGlobalContext } from "../../core/context/Context";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";
import { useSelector } from "react-redux";
import { RootState } from "../../core/store/store";

type ReplyMessageProps = {
	replyMessageId: string;
	setReplyMessageId: (newState: string | null) => void;
};

const ReplyMessage: FC<ReplyMessageProps> = ({
	replyMessageId,
	setReplyMessageId,
}) => {
	// Global context
	const { appTheme } = useGlobalContext();
	const theme = createTheme(appTheme);

	// Redux states and dispatch
	const messages = useSelector((state: RootState) => state.messages);
	const currentChat = useSelector((state: RootState) => state.currentChat);

	const [replyMessage] = useState<IMessage | undefined>(
		messages.find((msg) => msg._id === replyMessageId)
	);

	// Animated styles
	const replyMsgHeight = useSharedValue(0);
	// Effects
	useEffect(() => {
		replyMsgHeight.value = withTiming(60);
	}, []);
	return (
		<Animated.View // Container for replied message
			style={{
				flexDirection: "row",
				alignItems: "center",
				gap: theme.spacing(2),
				backgroundColor: theme.colors.main[400],
				width: "100%",
				height: replyMsgHeight,
				borderBottomColor: theme.colors.main[500],
				borderBottomWidth: 1,
				padding: theme.spacing(3),
			}}
		>
			<Entypo
				name="reply"
				size={theme.fontSize(5)}
				color={theme.colors.contrast[400]}
			/>
			<View // Container for replied message image and text
				style={{
					flexDirection: "row",
					alignItems: "center",
					gap: theme.spacing(2),
					flex: 1,
				}}
			>
				{replyMessage?.image && (
					<Image
						source={{
							uri: `${SERVER_URL_MAIN}:${SERVER_PORT_MAIN}/${replyMessage.image}`,
						}}
						style={{
							height: "100%",
							width: undefined,
							aspectRatio: 1,
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
							color: theme.colors.contrast[300],
						}}
					>
						Reply to{" "}
						{currentChat.participants[replyMessage?.sender!].firstName}
					</TextWithFont>
					{replyMessage?.image && !replyMessage.text && (
						<TextWithFont // Chat text field
							numberOfLines={1}
							styleProps={{
								color: theme.colors.contrast[300],
							}}
						>
							Photo
						</TextWithFont>
					)}
					{replyMessage?.text && (
						<TextWithFont
							numberOfLines={1}
							styleProps={{
								color: theme.colors.main[200],
							}}
						>
							{replyMessage.text}
						</TextWithFont>
					)}
				</View>
			</View>
			<TouchableOpacity onPress={() => setReplyMessageId(null)}>
				<Entypo
					name="cross"
					size={theme.fontSize(5)}
					color={theme.colors.main[200]}
					style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
					}}
				/>
			</TouchableOpacity>
		</Animated.View>
	);
};

export default ReplyMessage;
