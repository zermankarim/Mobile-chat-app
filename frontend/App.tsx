import { store } from "./core/store/store";
import { FC, useCallback, useEffect, useState } from "react";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import { SafeAreaProvider } from "react-native-safe-area-context";
import RootNavigator from "./RootNavigator";
import { Provider as StoreProvider } from "react-redux";
import { GlobalContext } from "./core/context/Context";
import { Socket } from "socket.io-client";
import {
	IBase64Wallpaper,
	IMessagePopulated,
	IMessage,
	ISocketEmitEvent,
	ISocketOnEvent,
	IUserState,
	IWallpaperGradient,
	ThemeType,
} from "./shared/types";
import { StatusBar } from "react-native";
import { createWallpaperDirIfNeed } from "./shared/functions";

const App: FC = () => {
	// States
	const [appIsReady, setAppIsReady] = useState<boolean>(false);

	const [loading, setLoading] = useState<boolean>(false);
	const [chatLoading, setChatLoading] = useState<boolean>(false);
	const [chatsLoading, setChatsLoading] = useState<boolean>(false);
	const [createChatLoading, setCreateChatLoading] = useState<boolean>(false);

	const [forwardMessages, setForwardMessages] = useState<IMessage[] | null>(
		null
	);
	const [forwardMsgOwnersList, setForwardMsgOwnersList] = useState<
		IUserState[] | null
	>([]);
	const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
	const [replyMessageId, setReplyMessageId] = useState<string | null>(null);

	const [appTheme, setAppTheme] = useState<ThemeType>("default");
	const [wallpaper, setWallpaper] = useState<
		IBase64Wallpaper | IWallpaperGradient | null
	>(null);

	const [connectionState, setConnectionState] = useState<Socket<
		ISocketOnEvent,
		ISocketEmitEvent
	> | null>(null);
	const [usersForChat, setUsersForChat] = useState<IUserState[]>([]);

	// Effects
	useEffect(() => {
		async function prepare() {
			try {
				await Font.loadAsync({
					"cabin-regular": require("./assets/fonts/Cabin-Regular.ttf"),
				});
			} catch (e) {
				console.warn(e);
			} finally {
				// Tell the application to render
				setAppIsReady(true);
			}
		}

		prepare();
		createWallpaperDirIfNeed();
	}, []);

	const onLayoutRootView = useCallback(async () => {
		if (appIsReady) {
			await SplashScreen.hideAsync();
		}
	}, [appIsReady]);

	if (!appIsReady) {
		return null;
	}
	return (
		<StoreProvider store={store}>
			<GlobalContext.Provider
				value={{
					connectionState,
					setConnectionState,
					loading,
					setLoading,
					usersForChat,
					setUsersForChat,
					chatsLoading,
					setChatsLoading,
					chatLoading,
					setChatLoading,
					createChatLoading,
					setCreateChatLoading,
					forwardMessages,
					setForwardMessages,
					appTheme,
					setAppTheme,
					wallpaper,
					setWallpaper,
					selectedMessages,
					setSelectedMessages,
					replyMessageId,
					setReplyMessageId,
					forwardMsgOwnersList,
					setForwardMsgOwnersList,
				}}
			>
				<NavigationContainer>
					<SafeAreaProvider onLayout={onLayoutRootView}>
						<StatusBar translucent backgroundColor="transparent"></StatusBar>
						<RootNavigator></RootNavigator>
					</SafeAreaProvider>
				</NavigationContainer>
			</GlobalContext.Provider>
		</StoreProvider>
	);
};

export default App;
