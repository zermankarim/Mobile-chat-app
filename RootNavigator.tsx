import { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { RootState } from "./core/store/store";
import DrawerContent from "./shared/components/Drawer";
import { theme } from "./shared/theme";
import Chats from "./static/Chats";
import Profile from "./static/Profile";
import Login from "./static/Login";
import SearchBarComponent from "./shared/components/SearchBar";
import {
  ChatScreenNavigationProp,
  IUserState,
  RootStackParamList,
} from "./shared/types";
import Chat from "./static/Chat";
import { Dimensions, Image, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Avatar, Button } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import TextWithFont from "./shared/components/TextWithFont";
import { TouchableOpacity } from "react-native-gesture-handler";
import SignUp from "./static/SignUp";
import CreateChat from "./static/CreateChat";

const Drawer = createDrawerNavigator<RootStackParamList>();

const RootNavigator: FC = () => {
  // Navigation
  const navigation = useNavigation<ChatScreenNavigationProp>();
  // Redux states and dispatch
  const user = useSelector((state: RootState) => state.user);
  const currentChat = useSelector((state: RootState) => state.currentChat);

  // States
  const [oneRecipient, setOneRecipient] = useState<IUserState | null>(null);

  const HeaderUserInfo = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          gap: theme.spacing(4),
        }}
      >
        {oneRecipient ? (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Profile", { owner: oneRecipient })
            }
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: theme.spacing(4),
            }}
          >
            {oneRecipient.avatars.length ? (
              <Avatar.Image
                size={36}
                source={{
                  uri: oneRecipient.avatars[oneRecipient.avatars.length - 1],
                }}
              ></Avatar.Image>
            ) : (
              <Avatar.Text
                size={36}
                label={oneRecipient?.firstName![0] + oneRecipient?.lastName![0]}
                style={{
                  backgroundColor: theme.colors.main[200],
                }}
              />
            )}
            <TextWithFont
              styleProps={{
                fontSize: theme.fontSize(5),
              }}
            >
              {oneRecipient.firstName + " " + oneRecipient.lastName}
            </TextWithFont>
          </TouchableOpacity>
        ) : (
          <MaterialIcons
            name="groups"
            size={64}
            color={theme.colors.main[200]}
          />
        )}
      </View>
    );
  };

  //Effects
  useEffect(() => {
    if (currentChat.id && currentChat.participants.length === 2) {
      const oneRecipientData: IUserState | undefined =
        currentChat.participants.find(
          (participant) => participant.uid !== user.uid
        );
      if (oneRecipientData) {
        setOneRecipient(oneRecipientData);
      }
    }
  }, [currentChat]);

  return user.uid ? (
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
        headerTitle: () => <SearchBarComponent></SearchBarComponent>,
      }}
    >
      <Drawer.Screen name="Chats" component={Chats} />
      <Drawer.Screen
        name="CreateChat"
        component={CreateChat}
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
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={Profile}
        options={{
          swipeEdgeWidth: Dimensions.get("window").width * 0.3,
          headerTitle: undefined,
          headerTransparent: true,
          headerStyle: {
            backgroundColor: theme.colors.main[400],
          },
        }}
      />
      <Drawer.Screen
        name="Chat"
        component={Chat}
        options={{
          headerStyle: {
            backgroundColor: theme.colors.main[400],
          },
          headerTitle: HeaderUserInfo,
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
        }}
      />
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
