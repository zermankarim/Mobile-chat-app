import * as React from "react";
import { AppRegistry } from "react-native";
import * as appJSON from "./app.json";
import App from "./App";
import { store } from "./core/store/store";
import { MD2DarkTheme, PaperProvider, useTheme } from "react-native-paper";
import { theme } from "./shared/theme";
import "react-native-gesture-handler";

export type AppTheme = typeof theme;

export const useAppTheme = () => useTheme<AppTheme>();

const Main: React.FC = () => {
  return (
    <PaperProvider theme={theme}>
      <App />
    </PaperProvider>
  );
};

AppRegistry.registerComponent(appJSON.expo.name, () => Main);

export default Main;
