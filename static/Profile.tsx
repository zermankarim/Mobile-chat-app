import { StyleSheet, View } from "react-native";
import { FC } from "react";
import TextWithFont from "../shared/components/TextWithFont";
import { theme } from "../shared/theme";

const Profile: FC = () => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.main[400],
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <TextWithFont
        styleProps={{
          color: theme.colors.main[100],
        }}
      >
        Chats page!
      </TextWithFont>
    </View>
  );
};

export default Profile;
