import { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createDrawerNavigator,
  DrawerToggleButton,
} from "@react-navigation/drawer";
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
  IUserState,
  ProfileScreenNavigationProp,
  RootStackParamList,
} from "./shared/types";
import Chat from "./static/Chat";
import { Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Button } from "react-native-paper";
import SignUp from "./static/SignUp";
import CreateChat from "./static/CreateChat";
import { setCurrentChat } from "./core/reducers/currentChat";
import { connectToSocket } from "./shared/functions";
import { useGlobalContext } from "./core/context/Context";
import { setMessages } from "./core/reducers/messages";
import { setChats } from "./core/reducers/chats";
import ChatSettings from "./static/ChatSettings";

const Drawer = createDrawerNavigator<RootStackParamList>();

const RootNavigator: FC = () => {
  // Global context states
  const {
    connectionState,
    loading,
    setLoading,
    setUsersForChat,
    setChatsLoading,
    setCreateChatLoading,
    setChatLoading,
    forwardMessages,
  } = useGlobalContext();

  // Navigation
  const navigation = useNavigation<ChatScreenNavigationProp>();

  // Redux states and dispatch
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const chats = useSelector((state: RootState) => state.chats);
  const currentChat = useSelector((state: RootState) => state.currentChat);

  // States

  //Effects

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
          setChatsLoading(false);
          return;
        }
        const { chatsData } = data;

        // Sorting chats by last message date
        const sortedChatsData = chatsData!.sort((a, b) => {
          const aHasMessages = a.messages.length > 0;
          const bHasMessages = b.messages.length > 0;

          if (aHasMessages && bHasMessages) {
            const dateA = new Date(
              a.messages[a.messages.length - 1].createdAt
            ).getTime();
            const dateB = new Date(
              b.messages[b.messages.length - 1].createdAt
            ).getTime();
            return dateB - dateA; // Sort by date of last message
          } else if (aHasMessages) {
            return -1; // Chats with messages above
          } else if (bHasMessages) {
            return 1; // Chat without messages below
          } else {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return dateB - dateA; // Two chats haven't messages, sort by create date
          }
        });
        dispatch(setChats(sortedChatsData as IChatPopulated[]));
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
        setChatLoading(false);
      }
      function onGetUsersForCreateChat(data: {
        success: boolean;
        message?: string;
        usersData?: IUserState[];
      }) {
        if (data) {
          setLoading(false);
          const { success } = data;
          if (!success) {
            const { message } = data;
            console.error(message);
            setCreateChatLoading(false);
          }
          const { usersData } = data;
          setUsersForChat(usersData!);
          setCreateChatLoading(false);
        }
        setCreateChatLoading(false);
      }
      function onOpenChatWithUser(data: {
        success: boolean;
        message?: string;
        chat?: IChatPopulated;
      }) {
        if (data) {
          const { success } = data;
          if (!success) {
            const { message } = data;
            console.error(message);
            setChatsLoading(false);
            return;
          }
          const { chat } = data;

          dispatch(setMessages(chat?.messages!));
          dispatch(setCurrentChat(chat!));
          setCreateChatLoading(false);
          setChatsLoading(false);
          setChatLoading(false);
          navigation.navigate("Chat");
        }
        setChatsLoading(false);
      }

      connectionState?.on("getChatsByUserId", onGetChatsByUserId);
      connectionState?.on("getChatById", onGetChatById);
      connectionState?.on("getUsersForCreateChat", onGetUsersForCreateChat);
      connectionState?.on("openChatWithUser", onOpenChatWithUser);

      return () => {
        connectionState?.off("getChatsByUserId", onGetChatsByUserId);
        connectionState?.off("getChatById", onGetChatById);
        connectionState?.off("getUsersForCreateChat", onGetUsersForCreateChat);
        connectionState?.off("openChatWithUser", onOpenChatWithUser);
      };
    }
  }, [connectionState]);

  useEffect(() => {
    if (user._id && !connectionState) {
      connectToSocket(user._id);
    }
  }, []);

  if (loading) {
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
        headerTitle: forwardMessages
          ? "Forward..."
          : () => (
              <SearchBarComponent searchType={"Chats"}></SearchBarComponent>
            ),
        headerLeft: () =>
          forwardMessages ? (
            <Button
              style={{
                minWidth: 0,
              }}
            >
              <Ionicons
                name="arrow-back-outline"
                size={24}
                color={theme.colors.main[200]}
                onPress={() => navigation.navigate("Chat")}
              />
            </Button>
          ) : (
            <DrawerToggleButton
              tintColor={theme.colors.main[200]}
            ></DrawerToggleButton>
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
          headerTitle: () => (
            <SearchBarComponent
              searchType={"UsersForCreateChat"}
            ></SearchBarComponent>
          ),
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={Profile}
        options={{
          swipeEdgeWidth: Dimensions.get("window").width * 0.4,
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
          headerShown: false,
          headerStyle: {
            backgroundColor: theme.colors.main[400],
          },
        }}
      />
      <Drawer.Screen
        name="ChatSettings"
        component={ChatSettings}
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
                onPress={() => navigation.navigate("Profile", { owner: user })}
              />
            </Button>
          ),
          headerTitle: undefined,
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
