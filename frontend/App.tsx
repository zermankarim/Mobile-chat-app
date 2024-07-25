import { useDispatch, useSelector } from "react-redux";
import { RootState, store } from "./core/store/store";
import { FC, useCallback, useEffect, useState } from "react";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Text } from "react-native-paper";
import RootNavigator from "./RootNavigator";
import { Provider as StoreProvider } from "react-redux";
import { GlobalContext } from "./core/context/Context";
import { connectToSocket } from "./shared/functions";
import { Socket } from "socket.io-client";
import { ISocketEmitEvent, ISocketOnEvent } from "./shared/types";
import { setMessages } from "./core/reducers/messages";

const App: FC = () => {
  // States
  const [appIsReady, setAppIsReady] = useState<boolean>(false);
  const [chatsLoading, setChatsLoading] = useState<boolean>(false);
  const [chatLoading, setChatLoading] = useState<boolean>(false);
  const [connectionState, setConnectionState] = useState<Socket<
    ISocketOnEvent,
    ISocketEmitEvent
  > | null>(null);

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
          chatsLoading,
          setChatsLoading,
          connectionState,
          setConnectionState,
          chatLoading,
          setChatLoading,
        }}
      >
        <NavigationContainer>
          <SafeAreaProvider onLayout={onLayoutRootView}>
            <RootNavigator></RootNavigator>
          </SafeAreaProvider>
        </NavigationContainer>
      </GlobalContext.Provider>
    </StoreProvider>
  );
};

export default App;
