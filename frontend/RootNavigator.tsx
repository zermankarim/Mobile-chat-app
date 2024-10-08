import { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	createDrawerNavigator,
	DrawerToggleButton,
} from "@react-navigation/drawer";
import { RootState } from "./core/store/store";
import DrawerContent from "./shared/components/Drawer";

import Chats from "./static/Chats";
import Profile from "./static/Profile";
import Login from "./static/Login";
import SearchBarComponent from "./shared/components/SearchBar";
import {
	ScreenNavigationProp,
	IChatPopulated,
	IUserState,
	RootStackParamList,
	ThemeType,
	IMessage,
	IChatFromDBPopulated,
} from "./shared/types";
import Chat from "./static/Chat";
import { Dimensions, SafeAreaView, StatusBar, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Button } from "react-native-paper";
import SignUp from "./static/SignUp";
import CreateChat from "./static/CreateChat";
import { setCurrentChat } from "./core/reducers/currentChat";
import { connectToSocket } from "./shared/functions";
import { useGlobalContext } from "./core/context/Context";
import { setMessages } from "./core/reducers/messages";
import { setChats } from "./core/reducers/chats";
import ChatSettings from "./static/ChatSettings";
import { setUser } from "./core/reducers/user";
import { createTheme } from "./shared/theme";
import AnimatedScreen from "./shared/components/AnimatedScreen";
import ChangeWallpaper from "./static/ChangeWallpaper";
import WallpaperGradient from "./static/WallpaperGradient";
import HeaderForChat from "./shared/components/HeaderForChat";
import { storageMMKV } from "./core/storage/storageMMKV";

const Drawer = createDrawerNavigator<RootStackParamList>();

const RootNavigator: FC = () => {
	// Global context states
	const {
		connectionState,
		loading,
		setLoading,
		setUsersForChat,
		setChatsLoading,
		setCreateChatLoading,
		setChatLoading,
		forwardMessages,
		appTheme,
		setAppTheme,
		forwardMsgOwnersList,
		setForwardMsgOwnersList,
	} = useGlobalContext();
	const theme = createTheme(appTheme);

	// Navigation
	const navigation = useNavigation<ScreenNavigationProp<"Chat">>();

	// Redux states and dispatch
	const dispatch = useDispatch();
	const user = useSelector((state: RootState) => state.user);
	const messages = useSelector((state: RootState) => state.messages);
	const chats = useSelector((state: RootState) => state.chats);
	const currentChat = useSelector((state: RootState) => state.currentChat);

	// States

	//Effects

	useEffect(() => {
		if (connectionState) {
			function onGetChatsByUserId(data: {
				success: boolean;
				message?: string;
				chatsData?: IChatFromDBPopulated[];
			}) {
				const { success } = data;
				if (!success) {
					const { message } = data;
					console.error("Error during receiving chats by user ID: ", message);
					setChatsLoading(false);
					return;
				}
				const { chatsData } = data;

				const chatsDataForClient: IChatPopulated[] = chatsData!.map((chat) => {
					const chatParticipantsForClient: { [id: string]: IUserState } = {};
					chat.participants.forEach((participant) => {
						const id = participant._id!;
						return (chatParticipantsForClient[id] = participant);
					});

					const chatForClient: IChatPopulated = {
						_id: chat!._id,
						createdAt: chat!.createdAt,
						createdBy: chat!.createdBy,
						messages: chat!.messages,
						participants: chatParticipantsForClient!,
						allParticipantsData: chatParticipantsForClient,
					};
					return chatForClient;
				});
				// Sorting chats by last message date
				const sortedChatsData = chatsDataForClient!.sort((a, b) => {
					const aHasMessages = a.messages.length > 0;
					const bHasMessages = b.messages.length > 0;

					if (aHasMessages && bHasMessages) {
						const dateA = new Date(
							a.messages[a.messages.length - 1].createdAt
						).getTime();
						const dateB = new Date(
							b.messages[b.messages.length - 1].createdAt
						).getTime();
						return dateB - dateA; // Sort by date of last message
					} else if (aHasMessages) {
						return -1; // Chats with messages above
					} else if (bHasMessages) {
						return 1; // Chat without messages below
					} else {
						const dateA = new Date(a.createdAt).getTime();
						const dateB = new Date(b.createdAt).getTime();
						return dateB - dateA; // Two chats haven't messages, sort by create date
					}
				});
				dispatch(setChats(sortedChatsData as IChatPopulated[]));
				setChatsLoading(false);
			}
			function onGetChatById(data: {
				success: boolean;
				message?: string;
				chatData?: IChatFromDBPopulated;
			}) {
				const { success } = data;
				if (!success) {
					const { message } = data;
					console.error("Error during receiving chat by ID: ", message);

					if (messages.length) {
						const updatedMessages: IMessage[] = messages.map((msg) => ({
							...msg,
							status: msg.status === "sending" ? "error" : "sent",
						}));
						dispatch(setMessages(updatedMessages));
					}

					setChatLoading(false);
					return;
				}
				const { chatData } = data;

				dispatch(setMessages(chatData!.messages));
				setChatLoading(false);
			}
			function onGetUsersForCreateChat(data: {
				success: boolean;
				message?: string;
				usersData?: IUserState[];
			}) {
				if (data) {
					setLoading(false);
					const { success } = data;
					if (!success) {
						const { message } = data;
						console.error(message);
						setCreateChatLoading(false);
					}
					const { usersData } = data;
					setUsersForChat(usersData!);
					setCreateChatLoading(false);
				}
				setCreateChatLoading(false);
			}
			function onOpenChatWithUser(data: {
				success: boolean;
				message?: string;
				chat?: IChatFromDBPopulated;
			}) {
				if (data) {
					const { success } = data;
					if (!success) {
						const { message } = data;
						console.error(message);
						setCreateChatLoading(false);
						setChatsLoading(false);
						setChatLoading(false);

						return;
					}
					const { chat } = data;

					const chatParticipantsForClient: { [id: string]: IUserState } = {};
					chat!.participants.forEach((participant) => {
						const id = participant._id!;
						return (chatParticipantsForClient[id] = participant);
					});

					const chatForClient: IChatPopulated = {
						_id: chat!._id,
						createdAt: chat!.createdAt,
						createdBy: chat!.createdBy,
						messages: chat!.messages,
						participants: chatParticipantsForClient,
						allParticipantsData: chatParticipantsForClient,
					};

					dispatch(setMessages(chatForClient?.messages!));
					dispatch(setCurrentChat(chatForClient));
					setCreateChatLoading(false);
					setChatsLoading(false);
					setChatLoading(false);
					navigation.navigate("Chat", { chat: chatForClient });
				}
				setChatsLoading(false);
			}

			function onGetUserById(data: {
				success: boolean;
				message?: string;
				userData?: IUserState;
			}) {
				if (data) {
					const { success } = data;
					if (!success) {
						const { message } = data;
						console.error(message);
						return;
					}
					const { userData } = data;
					dispatch(setUser(userData!));
				}
			}

			connectionState?.on("getChatsByUserId", onGetChatsByUserId);
			connectionState?.on("getChatById", onGetChatById);
			connectionState?.on("getUsersForCreateChat", onGetUsersForCreateChat);
			connectionState?.on("openChatWithUser", onOpenChatWithUser);
			connectionState?.on("getUserById", onGetUserById);

			return () => {
				connectionState?.off("getChatsByUserId", onGetChatsByUserId);
				connectionState?.off("getChatById", onGetChatById);
				connectionState?.off("getUsersForCreateChat", onGetUsersForCreateChat);
				connectionState?.off("openChatWithUser", onOpenChatWithUser);
				connectionState?.off("getUserById", onGetUserById);
			};
		}
	}, [connectionState]);

	useEffect(() => {
		if (user._id && !connectionState) {
			connectToSocket(user._id);
			const changeTheme = async () => {
				const themeTitle: ThemeType | undefined = storageMMKV.getString(
					"themeTitle"
				) as ThemeType;
				if (!themeTitle) {
					setAppTheme("default");
					return storageMMKV.set("themeTitle", "default");
				}
				setAppTheme(themeTitle);
			};
			changeTheme();
		}
	}, []);

	if (loading) {
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

	return user._id ? (
		<Drawer.Navigator
			initialRouteName="Chats"
			drawerContent={(props) => <DrawerContent {...props}></DrawerContent>}
			backBehavior="initialRoute"
			screenOptions={{
				swipeEdgeWidth: Dimensions.get("window").width,
				headerStyle: {
					backgroundColor: theme.colors.main[400],
				},
				headerTintColor: theme.colors.main[100],
				headerTitleStyle: {
					fontFamily: theme.fontFamily,
				},
				drawerType: "slide",
				headerShadowVisible: false,
				headerTitle: forwardMessages
					? "Forward..."
					: () => (
							<View
								style={{
									width: "100%",
									height: "100%",
									padding: 8,
								}}
							>
								<SearchBarComponent searchType={"Chats"}></SearchBarComponent>
							</View>
					  ),
				headerLeft: () =>
					forwardMessages ? (
						<Button
							style={{
								minWidth: 0,
							}}
						>
							<Ionicons
								name="arrow-back-outline"
								size={24}
								color={theme.colors.main[200]}
								onPress={() => navigation.navigate("Chat")}
							/>
						</Button>
					) : (
						<DrawerToggleButton
							tintColor={theme.colors.main[200]}
						></DrawerToggleButton>
					),
				sceneContainerStyle: {
					backgroundColor: theme.colors.main[500],
				},
			}}
		>
			<Drawer.Screen name="Chats">
				{(props) => (
					<AnimatedScreen
						styleProps={{
							flex: 1,
						}}
						navType="back"
					>
						<Chats navigation={props.navigation}></Chats>
					</AnimatedScreen>
				)}
			</Drawer.Screen>
			<Drawer.Screen
				name="CreateChat"
				options={{
					headerLeft: () => (
						<Button
							style={{
								minWidth: 0,
							}}
						>
							<Ionicons
								name="arrow-back-outline"
								size={24}
								color={theme.colors.main[200]}
								onPress={() => navigation.navigate("Chats")}
							/>
						</Button>
					),
					headerTitle: () => (
						<SearchBarComponent
							searchType={"UsersForCreateChat"}
						></SearchBarComponent>
					),
				}}
			>
				{(props) => (
					<AnimatedScreen
						styleProps={{
							flex: 1,
						}}
						navType="forward"
					>
						<CreateChat navigation={props.navigation}></CreateChat>
					</AnimatedScreen>
				)}
			</Drawer.Screen>
			<Drawer.Screen
				name="Profile"
				options={{
					swipeEdgeWidth: Dimensions.get("window").width * 0.4,
					headerTitle: undefined,
					headerTransparent: true,
					headerStyle: {
						backgroundColor: theme.colors.main[400],
					},
				}}
			>
				{(props) => (
					<AnimatedScreen
						styleProps={{
							flex: 1,
						}}
						navType="forward"
					>
						<Profile
							navigation={props.navigation}
							route={props.route}
						></Profile>
					</AnimatedScreen>
				)}
			</Drawer.Screen>
			<Drawer.Screen
				name="Chat"
				options={{
					headerStyle: {
						backgroundColor: theme.colors.main[400],
					},
					header: (props) => (
						<>
							<SafeAreaView
								style={{
									backgroundColor: theme.colors.main[400],
									height: StatusBar.currentHeight,
								}}
							></SafeAreaView>
							<HeaderForChat navigation={props.navigation}></HeaderForChat>
						</>
					),
				}}
			>
				{(props) => (
					<AnimatedScreen
						styleProps={{
							flex: 1,
						}}
						navType="forward"
					>
						<Chat navigation={props.navigation} route={props.route}></Chat>
					</AnimatedScreen>
				)}
			</Drawer.Screen>
			<Drawer.Screen
				name="ChatSettings"
				options={{
					headerLeft: () => (
						<Button
							style={{
								minWidth: 0,
							}}
						>
							<Ionicons
								name="arrow-back-outline"
								size={24}
								color={theme.colors.main[200]}
								onPress={() => navigation.navigate("Profile", { owner: user })}
							/>
						</Button>
					),
					headerTitle: undefined,
				}}
			>
				{(props) => (
					<AnimatedScreen
						styleProps={{
							flex: 1,
						}}
						navType="forward"
					>
						<ChatSettings navigation={props.navigation}></ChatSettings>
					</AnimatedScreen>
				)}
			</Drawer.Screen>
			<Drawer.Screen
				name="ChangeWallpaper"
				options={{
					headerLeft: () => (
						<Button
							style={{
								minWidth: 0,
							}}
						>
							<Ionicons
								name="arrow-back-outline"
								size={24}
								color={theme.colors.main[200]}
								onPress={() => navigation.navigate("ChatSettings")}
							/>
						</Button>
					),
					headerTitle: "Change wallpaper",
				}}
			>
				{(props) => (
					<AnimatedScreen
						styleProps={{
							flex: 1,
						}}
						navType="forward"
					>
						<ChangeWallpaper navigation={props.navigation}></ChangeWallpaper>
					</AnimatedScreen>
				)}
			</Drawer.Screen>
			<Drawer.Screen
				name="WallpaperGradient"
				options={{
					headerLeft: () => (
						<Button
							style={{
								minWidth: 0,
							}}
						>
							<Ionicons
								name="arrow-back-outline"
								size={24}
								color={theme.colors.main[200]}
								onPress={() => navigation.navigate("ChangeWallpaper")}
							/>
						</Button>
					),
					headerTitle: "Choose gradient wallpaper",
				}}
			>
				{(props) => (
					<AnimatedScreen
						styleProps={{
							flex: 1,
						}}
						navType="forward"
					>
						<WallpaperGradient
							navigation={props.navigation}
						></WallpaperGradient>
					</AnimatedScreen>
				)}
			</Drawer.Screen>
		</Drawer.Navigator>
	) : (
		<Drawer.Navigator
			initialRouteName="Login"
			screenOptions={{
				headerShown: false,
				headerStyle: {
					backgroundColor: theme.colors.main[400],
				},
				headerTintColor: theme.colors.main[100],
				headerTitleStyle: {
					fontFamily: theme.fontFamily,
				},
			}}
		>
			<Drawer.Screen name="Login" component={Login} />
			<Drawer.Screen name="SignUp" component={SignUp} />
		</Drawer.Navigator>
	);
};

export default RootNavigator;
