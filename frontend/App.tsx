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
	ISocketEmitEvent,
	ISocketOnEvent,
	IUserState,
	IWallpaperGradient,
	ThemeType,
} from "./shared/types";
import { StatusBar } from "react-native";

const App: FC = () => {
	// States
	const [appIsReady, setAppIsReady] = useState<boolean>(false);

	const [loading, setLoading] = useState<boolean>(false);
	const [chatLoading, setChatLoading] = useState<boolean>(false);
	const [chatsLoading, setChatsLoading] = useState<boolean>(false);
	const [createChatLoading, setCreateChatLoading] = useState<boolean>(false);

	const [forwardMessages, setForwardMessages] = useState<
		IMessagePopulated[] | null
	>(null);
	const [selectedMessages, setSelectedMessages] = useState<IMessagePopulated[]>(
		[]
	);
	const [replyMessage, setReplyMessage] = useState<IMessagePopulated | null>(
		null
	);

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
					replyMessage,
					setReplyMessage,
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
