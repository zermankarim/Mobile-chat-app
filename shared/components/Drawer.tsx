import React from "react";
import { Text, View } from "react-native";
import { theme } from "../theme";
import TextWithFont from "./TextWithFont";
function DrawerContent() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        backgroundColor: theme.colors.main[400],
        padding: theme.spacing(2),
      }}
    >
      <TextWithFont
        styleProps={{
          color: theme.colors.main[100],
        }}
      >
        Drawer content
      </TextWithFont>
    </View>
  );
}

export default DrawerContent;
