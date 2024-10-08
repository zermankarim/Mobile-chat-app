import { Dimensions, ScrollView, View } from "react-native";
import { FC, useCallback, useEffect, useState } from "react";
import TextWithFont from "../shared/components/TextWithFont";
import { ActivityIndicator } from "react-native-paper";
import { ChatsRouteProps, IChatPopulated } from "../shared/types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../core/store/store";
import ChatCard from "../shared/components/ChatCard";
import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useGlobalContext } from "../core/context/Context";
import { useFocusEffect } from "@react-navigation/native";
import { createTheme } from "../shared/theme";
import { logoutUserIfTokenHasProblems } from "../fetches/http";

const Chats: FC<ChatsRouteProps> = ({ navigation }) => {
	// Global context
	const { connectionState, chatsLoading, setChatsLoading, appTheme } =
		useGlobalContext();
	const theme = createTheme(appTheme);

	// Redux states and dispatch
	const chats: IChatPopulated[] = useSelector(
		(state: RootState) => state.chats
	);
	const user = useSelector((state: RootState) => state.user);
	const messages = useSelector((state: RootState) => state.messages);
	const dispatch = useDispatch();

	// States
	const [searchLoading, setSearchLoading] = useState<boolean>(false);
	const [selectedChats, setSelectedChats] = useState<IChatPopulated[]>([]);
	// Effects
	useEffect(() => {
		if (connectionState) {
			setChatsLoading(true);
		}
	}, [connectionState]);

	useFocusEffect(
		useCallback(() => {
			if (connectionState) {
				connectionState?.emit("getChatsByUserId", user._id!);
			}
		}, [messages, connectionState])
	);

	useFocusEffect(
		useCallback(() => {
			logoutUserIfTokenHasProblems(dispatch, navigation);
		}, [])
	);

	if (chatsLoading) {
		return (
			<ActivityIndicator
				size={"large"}
				color={theme.colors.main[200]}
				style={{
					flex: 1,
					backgroundColor: theme.colors.main[400],
				}}
			></ActivityIndicator>
		);
	}
	return (
		<View
			style={{
				position: "relative",
				flex: 1,
				backgroundColor: theme.colors.main[400],
				paddingVertical: theme.spacing(4),
			}}
		>
			{chats.length ? (
				<ScrollView // Container for chats
					style={{
						minHeight: "100%",
						width: "100%",
					}}
				>
					{searchLoading ? (
						<ActivityIndicator
							size={"large"}
							color={theme.colors.main[200]}
							style={{
								flex: 1,
								backgroundColor: theme.colors.main[400],
							}}
						></ActivityIndicator>
					) : (
						chats.map((chat) => {
							return (
								<ChatCard
									key={chat._id + "-chatCard"}
									chat={chat}
									isSelectedChat={selectedChats.includes(chat)}
									selectedChats={selectedChats}
									setSelectedChats={setSelectedChats}
								></ChatCard>
							);
						})
					)}
				</ScrollView>
			) : (
				<View
					style={{
						justifyContent: "center",
						alignItems: "center",
						flex: 1,
					}}
				>
					<TextWithFont
						styleProps={{
							color: theme.colors.main[200],
						}}
					>
						You haven't any chats.
					</TextWithFont>
				</View>
			)}

			<TouchableOpacity
				onPress={() => navigation.navigate("CreateChat")}
				containerStyle={{
					position: "absolute",
					bottom: Dimensions.get("window").height / 15,
					right: Dimensions.get("window").width / 15,
				}}
				style={{
					backgroundColor: theme.colors.contrast[500],
					padding: theme.spacing(4),
					borderRadius: 50,
				}}
			>
				<MaterialIcons name="create" size={24} color={theme.colors.main[100]} />
			</TouchableOpacity>
		</View>
	);
};

export default Chats;
