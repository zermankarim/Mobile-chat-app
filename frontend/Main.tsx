import * as React from "react";
import { AppRegistry } from "react-native";
import * as appJSON from "./app.json";
import App from "./App";
import { store } from "./core/store/store";
import { MD2DarkTheme, PaperProvider, useTheme } from "react-native-paper";

import "react-native-gesture-handler";

const Main: React.FC = () => {
  return (
    <PaperProvider>
      <App />
    </PaperProvider>
  );
};

AppRegistry.registerComponent(appJSON.expo.name, () => Main);

export default Main;
