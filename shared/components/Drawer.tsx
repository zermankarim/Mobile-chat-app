import React from "react";
import { Alert, View } from "react-native";
import { theme } from "../theme";
import TextWithFont from "./TextWithFont";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../core/store/store";
import { Avatar } from "react-native-paper";
import { FontAwesome } from "@expo/vector-icons";
import { DrawerNavigationState, ParamListBase } from "@react-navigation/native";
import {
  DrawerDescriptorMap,
  DrawerNavigationHelpers,
} from "@react-navigation/drawer/lib/typescript/src/types";
import uuid from "react-native-uuid";
import { IButtonDrawer } from "../types";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SimpleLineIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { signOut } from "firebase/auth";
import { auth } from "../../core/firebase/firebase";
import { logoutUser } from "../../core/reducers/user";

type DrawerProps = {
  state: DrawerNavigationState<ParamListBase>;
  navigation: DrawerNavigationHelpers;
  descriptors: DrawerDescriptorMap;
};

function DrawerContent({ ...props }) {
  // Redux states and dispatch
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const handleLogountButton = () => {
    signOut(auth)
      .then(() => {
        dispatch(logoutUser());
      })
      .catch((err) => Alert.alert("Error during log out: ", err.message));
  };

  const drawerButtonsData: IButtonDrawer[] = [
    {
      title: "My profile",
      icon: (
        <FontAwesome
          name="user-circle-o"
          size={24}
          color={theme.colors.main[200]}
        />
      ),
      onPress: () => {
        props.navigation.jumpTo("Profile");
        props.navigation.closeDrawer();
      },
    },
    {
      title: "Chats",
      icon: (
        <Ionicons
          name="chatbubble-ellipses-outline"
          size={24}
          color={theme.colors.main[200]}
        />
      ),
      onPress: () => {
        props.navigation.closeDrawer();
        props.navigation.jumpTo("Chats");
      },
    },
    {
      title: "Settings",
      icon: (
        <SimpleLineIcons
          name="settings"
          size={24}
          color={theme.colors.main[200]}
        />
      ),
      onPress: () => {
        props.navigation.closeDrawer();
        handleLogountButton();
      },
    },
    {
      title: "Log Out",
      icon: (
        <MaterialCommunityIcons
          name="logout"
          size={24}
          color={theme.colors.main[200]}
        />
      ),
      onPress: () => {
        props.navigation.closeDrawer();
      },
    },
  ];

  return (
    <View // Container for Drawer
      style={{
        flex: 1,
        backgroundColor: theme.colors.main[400],
      }}
    >
      <View // Container for Drawer header
        style={{
          flexDirection: "column",
          alignItems: "center",
          gap: theme.spacing(2),
          backgroundColor: theme.colors.main[300],
          padding: theme.spacing(2),
          paddingTop: theme.spacing(10),
        }}
      >
        <View // Outer container for user avatar
          style={{
            width: "100%",
          }}
        >
          <TouchableOpacity // Inner container for user avatar
            onPress={() => {
              props.navigation.closeDrawer();
              props.navigation.jumpTo("Profile");
            }}
          >
            {user.avatar ? (
              <Avatar.Image
                size={64}
                source={{ uri: user.avatar }}
              ></Avatar.Image>
            ) : (
              <Avatar.Text
                size={64}
                label={user?.firstName![0] + user?.lastName![0]}
                style={{
                  backgroundColor: theme.colors.main[200],
                }}
              />
            )}
          </TouchableOpacity>
        </View>
        <View // Container for user name and email
          style={{
            flexDirection: "column",
            width: "100%",
          }}
        >
          <TextWithFont
            styleProps={{
              color: theme.colors.main[100],
              fontSize: theme.fontSize(4),
            }}
          >
            {user.firstName + " " + user.lastName}
          </TextWithFont>
          <TextWithFont
            styleProps={{
              color: theme.colors.main[200],
              fontSize: theme.fontSize(3),
            }}
          >
            {user.email}
          </TextWithFont>
        </View>
      </View>
      <View // Container for Drawer buttons
        style={{
          flex: 1,
          flexDirection: "column",
          backgroundColor: theme.colors.main[400],
          width: "100%",
          padding: theme.spacing(2),
        }}
      >
        {drawerButtonsData.map((buttonData: IButtonDrawer) => (
          <TouchableOpacity // Container for drawer button
            key={uuid.v4() + "-containerDrawerButton"}
            onPress={buttonData.onPress}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: theme.spacing(4),
              width: "100%",
              padding: theme.spacing(2),
            }}
          >
            {buttonData.icon}
            <TextWithFont
              styleProps={{
                fontSize: theme.fontSize(4),
              }}
            >
              {buttonData.title}
            </TextWithFont>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

export default DrawerContent;
