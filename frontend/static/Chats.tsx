import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { FC, useEffect, useState } from "react";
import TextWithFont from "../shared/components/TextWithFont";
import { theme } from "../shared/theme";
import { setChats } from "../core/reducers/chats";
import { ActivityIndicator } from "react-native-paper";
import { ChatsRouteProps, IChatPopulated, IUserState } from "../shared/types";
// import {
//   collection,
//   getDocs,
//   onSnapshot,
//   query,
//   where,
// } from "firebase/firestore";
import { database } from "../core/firebase/firebase";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../core/store/store";
import ChatCard from "../shared/components/ChatCard";
import uuid from "react-native-uuid";
import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useGlobalContext } from "../core/context/Context";
import { getDocs } from "../fetches/http";
import { populate, where } from "../shared/functions";

const Chats: FC<ChatsRouteProps> = ({ navigation }) => {
  // Global context
  const { connectionState } = useGlobalContext();

  // Redux states and dispatch
  const chats: IChatPopulated[] = useSelector(
    (state: RootState) => state.chats
  );
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  // States
  const { chatsLoading, setChatsLoading } = useGlobalContext();
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [selectedChats, setSelectedChats] = useState<IChatPopulated[]>([]);

  // Effects
  useEffect(() => {
    setChatsLoading(true);

    connectionState?.emit("getChatsByUserId", user._id!);

    connectionState?.on("getChatsByUserId", (data) => {
      const { success } = data;
      if (!success) {
        const { message } = data;
        console.error("Error during receiving chats by user ID: ", message);
        return;
      }
      const { chatsData } = data;
      dispatch(setChats(chatsData as IChatPopulated[]));
      setChatsLoading(false);
      setSearchLoading(false);
    });
    return () => {
      connectionState?.off("getChatsByUserId");
    };
  }, [connectionState]);

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
      {chats.length ? (
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
                    (participant: IUserState) => participant._id !== user._id
                  )
                }
              ></ChatCard>
            ))
          )}
        </ScrollView>
      ) : (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
          }}
        >
          <TextWithFont
            styleProps={{
              color: theme.colors.main[200],
            }}
          >
            You haven't any chats.
          </TextWithFont>
        </View>
      )}

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
