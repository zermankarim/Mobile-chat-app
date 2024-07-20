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
import { setCurrentChat } from "../core/reducers/currentChat";

const CreateChat: FC<CreateChatRouteProps> = ({ navigation }) => {
  // Redux states and dispatch
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  // States
  const [usersForChat, setUsersForChat] = useState<IUserState[]>([]);
  const [usersLoading, setUsersLoading] = useState<boolean>(true);

  // Functions
  const handleCreateChatWithUser = async (userForChat: IUserState) => {
    setUsersLoading(true);
    try {
      const newChatForDB: IChatDB = {
        id: uuid.v4().toLocaleString(),
        createdAt: new Date().toISOString(),
        messages: [],
        createdBy: user.uid!,
        participants: [user.uid!, userForChat.uid!],
      };
      const newChatForClient: IChatClient = {
        id: uuid.v4().toLocaleString(),
        createdAt: new Date().toISOString(),
        messages: [],
        createdBy: user.uid!,
        participants: [user, userForChat],
      };
      await setDoc(doc(database, "chats", newChatForDB.id), newChatForDB);

      dispatch(setCurrentChat(newChatForClient));
      navigation.navigate("Chat");
      setUsersLoading(false);

      console.log("Chat was created!");
    } catch (e: any) {
      console.error("Error during creating chat: ", e.message);
      Alert.alert("Error during creating chat: ", e.message);
      setUsersLoading(false);
    }
  };

  // Effects
  useEffect(() => {
    setUsersLoading(true);
    try {
      // Query users for searching
      const usersQ = query(
        collection(database, "users"),
        where("uid", "!=", user.uid)
      );
      const unsubscribe = onSnapshot(usersQ, async (snaphot) => {
        if (!snaphot.empty) {
          const usersData: IUserState[] = [];
          for (const doc of snaphot.docs) {
            const userForChatData: IUserState = doc.data() as IUserState;

            // Create chat query for each user
            const chatsQ = query(
              collection(database, "chats"),
              where("participants", "array-contains", userForChatData.uid)
            );

            const querySnapshot = await getDocs(chatsQ);
            // If chats with this user not found - add to array
            if (!querySnapshot.docs.length) {
              usersData.push(userForChatData);
            }
            // Else search in all chats which have more than 2 participants
            else {
              querySnapshot.docs.forEach((doc) => {
                const chatData: IChatDB = doc.data() as IChatDB;
                if (chatData.participants.length > 2) {
                  usersData.push(userForChatData);
                }
              });
            }
          }
          setUsersForChat(usersData);
          setUsersLoading(false);
        }
      });
      return unsubscribe;
    } catch (e: any) {
      console.error(e.message);
      setUsersLoading(false);
    }
  }, []);

  if (usersLoading) {
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
                    <Avatar.Text
                      size={48}
                      label={
                        userForChat?.firstName![0] + userForChat?.lastName![0]
                      }
                      style={{
                        backgroundColor: theme.colors.main[200],
                      }}
                    />
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
