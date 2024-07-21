import { FC, useEffect, useState } from "react";
import { Alert, TouchableOpacity, View } from "react-native";
import { theme } from "../shared/theme";
import TextWithFont from "../shared/components/TextWithFont";
import {
  CreateChatRouteProps,
  IChatClient,
  IChatDB,
  IUserState,
} from "../shared/types";
import {
  addDoc,
  and,
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { database } from "../core/firebase/firebase";
import { ActivityIndicator, Avatar } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import uuid from "react-native-uuid";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../core/store/store";
import currentChat, { setCurrentChat } from "../core/reducers/currentChat";
import { setMessages } from "../core/reducers/messages";
import { LinearGradient } from "expo-linear-gradient";

const CreateChat: FC<CreateChatRouteProps> = ({ navigation }) => {
  // Redux states and dispatch
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  // States
  const [usersForChat, setUsersForChat] = useState<IUserState[]>([]);
  const [usersLoading, setUsersLoading] = useState<boolean>(true);
  const [chatLoading, setChatLoading] = useState<boolean>(false);

  // Functions
  const handleCreateChatWithUser = async (userForChat: IUserState) => {
    setChatLoading(true);
    setUsersLoading(true);
    try {
      const chatId = uuid.v4().toLocaleString();
      const newChatForDB: IChatDB = {
        id: chatId,
        createdAt: new Date().toISOString(),
        messages: [],
        createdBy: user.uid!,
        participants: [user.uid!, userForChat.uid!],
      };
      const newChatForClient: IChatClient = {
        id: chatId,
        createdAt: new Date().toISOString(),
        messages: [],
        createdBy: user.uid!,
        participants: [user, userForChat],
      };
      await setDoc(doc(database, "chats", newChatForDB.id), newChatForDB);

      dispatch(setCurrentChat(newChatForClient));
      dispatch(setMessages([]));
      navigation.navigate("Chat");
      setUsersLoading(false);
      setChatLoading(false);

      console.log("Chat was created!");
    } catch (e: any) {
      console.error("Error during creating chat: ", e.message);
      Alert.alert("Error during creating chat: ", e.message);
      setUsersLoading(false);
      setChatLoading(false);
    }
  };

  // Effects
  useEffect(() => {
    setUsersLoading(true);

    const updateUsersForChat = async () => {
      // Query users for searching
      const usersQ = query(
        collection(database, "users"),
        where("uid", "!=", user.uid)
      );

      const chatsQ = query(collection(database, "chats"));

      // Listener for chats DB for updating it state at Chat Page
      const unsubscribeChats = onSnapshot(chatsQ, async (chatsSnapshot) => {
        const usersData: IUserState[] = [];
        const usersSnapshot = await getDocs(usersQ);
        for (const doc of usersSnapshot.docs) {
          const userForChatData: IUserState = doc.data() as IUserState;

          const chatDocs = chatsSnapshot.docs.filter((doc) => {
            const chatData: IChatDB = doc.data() as IChatDB;
            return chatData.participants.includes(userForChatData.uid!);
          });

          if (
            !chatDocs.length ||
            chatDocs.some((doc) => doc.data().participants.length > 2)
          ) {
            usersData.push(userForChatData);
          }
        }
        setUsersForChat(usersData);
      });

      // Listener for users DB for updating it state at CreateChat Page
      const unsubscribeUsers = onSnapshot(usersQ, async (usersSnapshot) => {
        if (!usersSnapshot.empty) {
          const usersData: IUserState[] = [];
          for (const doc of usersSnapshot.docs) {
            const userForChatData: IUserState = doc.data() as IUserState;
            usersData.push(userForChatData);
          }
          setUsersForChat((prevUsers) =>
            prevUsers.filter((user) =>
              usersData.some((u) => u.uid === user.uid)
            )
          );
        }
      });

      return () => {
        unsubscribeChats();
        unsubscribeUsers();
      };
    };

    try {
      updateUsersForChat();
      setUsersLoading(false);
    } catch (e: any) {
      console.error(e.message);
      setUsersLoading(false);
    }
  }, [currentChat]);

  if (usersLoading || chatLoading) {
    return (
      <ActivityIndicator
        size={"large"}
        color={theme.colors.main[200]}
        style={{
          flex: 1,
          backgroundColor: theme.colors.main[400],
        }}
      ></ActivityIndicator>
    );
  }
  return (
    <View // Container for "Create chat" page
      style={{
        flex: 1,
        backgroundColor: theme.colors.main[400],
      }}
    >
      <ScrollView // Container for users for creating the chat
        style={{
          flexDirection: "column",
          padding: theme.spacing(2),
        }}
      >
        {usersForChat.length
          ? usersForChat
              .sort((a, b) => a.firstName!.localeCompare(b.firstName!))
              .map((userForChat) => (
                <TouchableOpacity // Container for one user for creating the chat
                  key={uuid.v4() + "-userForChat-container"}
                  onPress={() => handleCreateChatWithUser(userForChat)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: theme.spacing(2),
                    padding: theme.spacing(2),
                  }}
                >
                  {userForChat.avatars.length ? (
                    <Avatar.Image
                      size={48}
                      source={{
                        uri: userForChat.avatars[
                          userForChat.avatars.length - 1
                        ],
                      }}
                    ></Avatar.Image>
                  ) : (
                    <LinearGradient
                      colors={userForChat.backgroundColors}
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        width: 48,
                        height: 48,
                        borderRadius: 50,
                      }}
                    >
                      <TextWithFont>
                        {userForChat?.firstName![0] + userForChat?.lastName![0]}
                      </TextWithFont>
                    </LinearGradient>
                  )}
                  <View // Container for user names and email
                    style={{
                      flexDirection: "column",
                    }}
                  >
                    <TextWithFont>
                      {userForChat.firstName + " " + userForChat.lastName}
                    </TextWithFont>
                    <TextWithFont
                      styleProps={{
                        color: theme.colors.main[200],
                        fontSize: theme.fontSize(3),
                      }}
                    >
                      {userForChat.email}
                    </TextWithFont>
                  </View>
                </TouchableOpacity>
              ))
          : null}
      </ScrollView>
    </View>
  );
};

export default CreateChat;
