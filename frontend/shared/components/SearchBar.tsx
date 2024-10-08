import React, { useState } from "react";
import { Alert, Dimensions, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../core/store/store";
import { Searchbar } from "react-native-paper";
import { IChatPopulated } from "../types";
import { setChats } from "../../core/reducers/chats";
import { useGlobalContext } from "../../core/context/Context";
import { createTheme } from "../theme";

type SearchBarComponentProps = {
	searchType: "Chats" | "UsersForCreateChat";
};

const SearchBarComponent: React.FunctionComponent<SearchBarComponentProps> = ({
	searchType,
}) => {
	// Global context
	const { connectionState, setCreateChatLoading, appTheme } =
		useGlobalContext();
	const theme = createTheme(appTheme);

	// Redux states
	const user = useSelector((state: RootState) => state.user);
	const chats = useSelector((state: RootState) => state.chats);
	const dispatch = useDispatch();

	// Context states
	const { setChatsLoading } = useGlobalContext();

	// States
	const [search, setSearch] = useState<string>("");

	// Functions
	const updateChats = (text: string) => {
		setChatsLoading(true);
		try {
			connectionState?.emit(
				"getChatsByUserId",
				user._id!,
				text.toLocaleLowerCase()
			);
		} catch (error: any) {
			Alert.alert("Error during updating chats: ", error.message);
			console.error("Error during finding chats: ", error.message);
		}
	};

	const updateUsersForCreateChat = (text: string) => {
		setCreateChatLoading(true);
		try {
			connectionState?.emit(
				"getUsersForCreateChat",
				user._id!,
				text.toLocaleLowerCase()
			);
		} catch (error: any) {
			Alert.alert("Error during updating chats: ", error.message);
			console.error("Error during finding chats: ", error.message);
		}
	};

	const handleUpdateSearch = async (text: string) => {
		setSearch(text);
		if (searchType === "Chats") {
			updateChats(text);
		}
		if (searchType === "UsersForCreateChat") {
			updateUsersForCreateChat(text);
		}
	};

	return (
		<View
			style={{
				flex: 1,
				justifyContent: "center",
				width: Dimensions.get("window").width * 0.5,
			}}
		>
			<Searchbar
				placeholder="Search"
				iconColor={theme.colors.main[200]}
				placeholderTextColor={theme.colors.main[200]}
				onChangeText={(text) => handleUpdateSearch(text)}
				value={search}
				style={{
					height: 38,
					backgroundColor: theme.colors.main[500],
					width: "100%",
				}}
				inputStyle={{
					minHeight: 0,
				}}
			/>
		</View>
	);
};

export default SearchBarComponent;
