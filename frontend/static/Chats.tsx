import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { FC, useEffect, useState } from "react";
import TextWithFont from "../shared/components/TextWithFont";
import { theme } from "../shared/theme";
import { setChats } from "../core/reducers/chats";
import { ActivityIndicator } from "react-native-paper";
import {
  ChatsRouteProps,
  IChatClient,
  IChatDB,
  IUserState,
} from "../shared/types";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { database } from "../core/firebase/firebase";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../core/store/store";
import ChatCard from "../shared/components/ChatCard";
import uuid from "react-native-uuid";
import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useGlobalContext } from "../core/context/Context";

const Chats: FC<ChatsRouteProps> = ({ navigation }) => {
  // Redux states and dispatch
  const chats = useSelector((state: RootState) => state.chats);
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  // States
  const { chatsLoading, setChatsLoading } = useGlobalContext();
  const [searchLoading, setSearchLoading] = useState<boolean>(true);
  const [selectedChats, setSelectedChats] = useState<IChatClient[]>([]);

  // Effects
  useEffect(() => {
    // Get all chat and push to a state
    const updateChats = async () => {
      const q = query(
        collection(database, "chats"),
        where("participants", "array-contains", user.uid)
      );

      const unsubscribe = onSnapshot(q, async (snapshot) => {
        const newChats: IChatClient[] = [];
        for (const doc of snapshot.docs) {
          const chatDataFromDB: IChatDB = doc.data() as IChatDB;
          const { participants } = chatDataFromDB;
          const q = query(
            collection(database, "users"),
            where("uid", "in", participants)
          );
          const querySnapshot = await getDocs(q);
          const usersData: IUserState[] = querySnapshot.docs.map((doc) =>
            doc.data()
          ) as IUserState[];

          const chatForClient: IChatClient = {
            ...chatDataFromDB,
            participants: usersData,
          };
          newChats.push(chatForClient);
        }
        dispatch(setChats(newChats));
        setChatsLoading(false);
        setSearchLoading(false);
      });

      return unsubscribe;
    };
    try {
      updateChats();
    } catch (e) {
      console.error("Error during update chats on Home page: ", e);
    }
  }, []);

  if (chatsLoading) {
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
    <View
      style={{
        position: "relative",
        flex: 1,
        backgroundColor: theme.colors.main[400],
        paddingVertical: theme.spacing(4),
      }}
    >
      <ScrollView // Container for chats
        style={{
          minHeight: "100%",
          width: "100%",
        }}
      >
        {searchLoading ? (
          <ActivityIndicator
            size={"large"}
            color={theme.colors.main[200]}
            style={{
              flex: 1,
              backgroundColor: theme.colors.main[400],
            }}
          ></ActivityIndicator>
        ) : (
          chats.map((chat) => (
            <ChatCard
              key={uuid.v4() + "-chatCard"}
              chat={chat}
              isSelectedChat={selectedChats.includes(chat)}
              selectedChats={selectedChats}
              setSelectedChats={setSelectedChats}
              oneRecipient={
                chat.participants.length === 2 &&
                chat.participants.find(
                  (participant) => participant.uid !== user.uid
                )
              }
            ></ChatCard>
          ))
        )}
      </ScrollView>
      <TouchableOpacity
        onPress={() => navigation.navigate("CreateChat")}
        style={{
          position: "absolute",
          bottom: 12,
          right: 12,
          backgroundColor: theme.colors.blue[100],
          padding: theme.spacing(4),
          borderRadius: 50,
        }}
      >
        <MaterialIcons name="create" size={24} color={theme.colors.main[100]} />
      </TouchableOpacity>
    </View>
  );
};

export default Chats;
