import { Entypo } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";
import TextWithFont from "./TextWithFont";
import { FC } from "react";
import { useGlobalContext } from "../../core/context/Context";
import { createTheme } from "../theme";
import { useSelector } from "react-redux";
import { RootState } from "../../core/store/store";

const ForwardMessages: FC = () => {
	// Global context states
	const {
		forwardMessages,
		setForwardMessages,
		appTheme,
		forwardMsgOwnersList,
		setForwardMsgOwnersList,
	} = useGlobalContext();
	const theme = createTheme(appTheme);

	// Redux states and dispatch
	const currentChat = useSelector((state: RootState) => state.currentChat);

	return (
		<View // Container for replied message
			style={{
				flexDirection: "row",
				alignItems: "center",
				gap: theme.spacing(2),
				backgroundColor: theme.colors.main[400],
				width: "100%",
				height: 60,
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
						Forward {forwardMessages?.length} messages
					</TextWithFont>

					<TextWithFont
						numberOfLines={1}
						styleProps={{
							color: theme.colors.main[200],
						}}
					>
						From{" "}
						{/* {forwardMessages
              ?.map((fwdMsg) => fwdMsg.sender.firstName)
              .join(",")} */}
						{[
							...new Set(
								forwardMsgOwnersList?.map(
									(forwardMsgOwner) => forwardMsgOwner.firstName
								)
							),
						].join(", ")}
					</TextWithFont>
				</View>
			</View>
			<TouchableOpacity
				onPress={() => {
					setForwardMessages(null);
					setForwardMsgOwnersList(null);
				}}
			>
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
		</View>
	);
};

export default ForwardMessages;
