import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  IChatPopulated,
  ISocketOnEvent,
  IUserState,
  RootStackParamList,
} from "./shared/types";
import Chat from "./static/Chat";
import { Dimensions, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Avatar, Button } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import TextWithFont from "./shared/components/TextWithFont";
import { TouchableOpacity } from "react-native-gesture-handler";
import SignUp from "./static/SignUp";
import CreateChat from "./static/CreateChat";
import { LinearGradient } from "expo-linear-gradient";
import { setCurrentChat } from "./core/reducers/currentChat";
import { connectToSocket } from "./shared/functions";
import { useGlobalContext } from "./core/context/Context";
import { setMessages } from "./core/reducers/messages";
import { setChats } from "./core/reducers/chats";

const Drawer = createDrawerNavigator<RootStackParamList>();

const RootNavigator: FC = () => {
  // Global context states
  const { connectionState, setChatLoading, chatLoading, setChatsLoading } =
    useGlobalContext();

  // Navigation
  const navigation = useNavigation<ChatScreenNavigationProp>();

  // Redux states and dispatch
  const dispatch = useDispatch();
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
              <LinearGradient
                colors={oneRecipient.backgroundColors}
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  height: 36,
                  width: 36,
                  borderRadius: 50,
                }}
              >
                <TextWithFont
                  styleProps={{
                    fontSize: theme.fontSize(3),
                  }}
                >
                  {oneRecipient?.firstName![0] + oneRecipient?.lastName![0]}
                </TextWithFont>
              </LinearGradient>
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
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: theme.spacing(2),
            }}
          >
            <MaterialIcons
              name="groups"
              size={48}
              color={theme.colors.main[200]}
            />
            <TextWithFont>
              {currentChat.participants
                .filter(
                  (participant, index) =>
                    participant._id !== user._id && index < 3
                )
                .map(
                  (participant) =>
                    participant.firstName + " " + participant.lastName
                )
                .join(", ") + " and other.."}
            </TextWithFont>
          </View>
        )}
      </View>
    );
  };

  //Effects
  useEffect(() => {
    setChatLoading(true);
    if (currentChat._id && currentChat.participants.length === 2) {
      const oneRecipientData: IUserState | undefined =
        currentChat.participants.find(
          (participant) => participant._id !== user._id
        );
      if (oneRecipientData) {
        setOneRecipient(oneRecipientData);
      }
    } else {
      setOneRecipient(null);
    }
    setChatLoading(false);
  }, [currentChat]);

  useEffect(() => {
    if (connectionState) {
      function onGetChatsByUserId(data: {
        success: boolean;
        message?: string;
        chatsData?: IChatPopulated[];
      }) {
        const { success } = data;
        if (!success) {
          const { message } = data;
          console.error("Error during receiving chats by user ID: ", message);
          return;
        }
        const { chatsData } = data;
        dispatch(setChats(chatsData as IChatPopulated[]));
        setChatsLoading(false);
      }
      function onGetChatById(data: {
        success: boolean;
        message?: string;
        chatData?: IChatPopulated;
      }) {
        const { success } = data;
        if (!success) {
          const { message } = data;
          console.error("Error during receiving chat by ID: ", message);
          setChatLoading(false);
          return;
        }
        const { chatData } = data;
        dispatch(setMessages(chatData!.messages));
      }

      connectionState?.on("getChatsByUserId", onGetChatsByUserId);
      connectionState?.on("getChatById", onGetChatById);

      return () => {
        connectionState.off("getChatsByUserId", onGetChatsByUserId);
        connectionState.off("getChatById", onGetChatById);
      };
    }
  }, [connectionState]);

  if (chatLoading) {
    return (
      <ActivityIndicator
        size={"large"}
        color={theme.colors.main[100]}
        style={{
          flex: 1,
          backgroundColor: theme.colors.main[500],
        }}
      ></ActivityIndicator>
    );
  }

  return user._id ? (
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
        headerTitle: () => (
          <SearchBarComponent searchType={"Chats"}></SearchBarComponent>
        ),
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
                onPress={() => {
                  dispatch(
                    setCurrentChat({
                      _id: "",
                      createdAt: "",
                      createdBy: {
                        _id: "",
                        firstName: "",
                        lastName: "",
                        email: "",
                        dateOfBirth: "",
                        backgroundColors: [],
                        avatars: [],
                        friends: [],
                      },
                      messages: [],
                      participants: [],
                    })
                  );
                  navigation.navigate("Chats");
                }}
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
