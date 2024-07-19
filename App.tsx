import { useSelector } from "react-redux";
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

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const App: FC = () => {
  // States
  const [appIsReady, setAppIsReady] = useState(false);

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
      <NavigationContainer>
        <SafeAreaProvider onLayout={onLayoutRootView}>
          <RootNavigator></RootNavigator>
        </SafeAreaProvider>
      </NavigationContainer>
    </StoreProvider>
  );
};

export default App;
