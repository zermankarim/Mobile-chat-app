import { FC, useEffect, useRef, useState } from "react";
import { theme } from "../shared/theme";
import {
  NativeSyntheticEvent,
  TextInputChangeEventData,
  TouchableOpacity,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { ActivityIndicator, Button, Text, TextInput } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../core/store/store";
import uuid from "react-native-uuid";
import TextWithFont from "../shared/components/TextWithFont";
import { format, isThisWeek, isToday, parseISO } from "date-fns";
import { IChatDB, IMessage } from "../shared/types";
import {
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { database } from "../core/firebase/firebase";
import { setCurrentChat } from "../core/reducers/currentChat";
import { setMessages } from "../core/reducers/messages";

const Chat: FC = () => {
  // Redux states and dispatch
  const currentChat = useSelector((state: RootState) => state.currentChat);
  const user = useSelector((state: RootState) => state.user);
  const messages = useSelector((state: RootState) => state.messages);
  const dispatch = useDispatch();

  // Ref
  const scrollViewRef = useRef<ScrollView>(null);

  // States
  const [messageText, setMessageText] = useState<string | undefined>("");
  const [chatLoading, setChatLoading] = useState<boolean>(true);
  const [disabledSendButton, setDisabledSendButton] = useState<boolean>(true);

  // Functions
  const formatMessageDate = (isoString: string): string => {
    const date = parseISO(isoString);

    if (isToday(date)) {
      return format(date, "HH:mm");
    } else if (isThisWeek(date)) {
      return format(date, "EEE");
    } else {
      return format(date, "dd MMM");
    }
  };

  const handleLongPressMessage = (message: IMessage) => {};

  // Scroll when user send a new message
  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  const handleChangeMessageText = (text: string) => {
    const regExp = /^\s*$/;
    setMessageText(text);
    if (!regExp.test(text)) {
      setDisabledSendButton(false);
    } else {
      setDisabledSendButton(true);
    }
  };

  const onSend = async () => {
    const newMessage: IMessage = {
      createdAt: new Date().toISOString(),
      sender: user.uid!,
      text: messageText!,
    };
    setMessageText("");

    try {
      // Updating document (add a new message)
      const chatDocRef = doc(database, "chats", currentChat.id);
      await updateDoc(chatDocRef, {
        messages: [...currentChat.messages, newMessage],
      });

      scrollToBottom();
      dispatch(setMessages([...currentChat.messages, newMessage]));
      setDisabledSendButton(true);
    } catch (error) {
      console.error("Error updating document:", error);
      setDisabledSendButton(true);
    }
  };

  // Effects
  useEffect(() => {
    scrollToBottom();
    if (currentChat) {
      const q = query(
        collection(database, "chats"),
        where("id", "==", currentChat.id)
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        try {
          if (!querySnapshot.empty) {
            const document = querySnapshot.docs[0];
            const updatedChat: IChatDB = document.data() as IChatDB;
            dispatch(
              setCurrentChat({
                ...currentChat,
                messages: updatedChat.messages,
              })
            );
          }
          setChatLoading(false);
        } catch (error) {
          console.error("Error on chat snapshot: ", error);
          setChatLoading(false);
        }
      });

      return () => unsubscribe();
    }
  }, []);

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

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.main[500],
      }}
    >
      {messages.length ? (
        <ScrollView // Container for messages
          ref={scrollViewRef}
          style={{
            flexDirection: "column",
          }}
          contentContainerStyle={{
            justifyContent: "flex-end",
            minHeight: "100%",
            padding: theme.spacing(3),
            gap: theme.spacing(3),
          }}
        >
          {messages.map((message) => (
            <View // Container for message row
              key={uuid.v4() + "-containerRowMessage"}
              style={{
                flexDirection: "row",
                justifyContent:
                  message.sender === user.uid ? "flex-end" : "flex-start",
                width: "100%",
              }}
            >
              <TouchableOpacity // Container for message
                onLongPress={() => handleLongPressMessage(message)}
                style={{
                  backgroundColor:
                    message.sender === user.uid
                      ? theme.colors.blue[100]
                      : theme.colors.main[300],
                  paddingVertical: theme.spacing(2),
                  paddingHorizontal: theme.spacing(3),
                  borderTopLeftRadius: theme.borderRadius(2),
                  borderTopRightRadius: theme.borderRadius(2),
                  borderBottomLeftRadius:
                    message.sender === user.uid ? theme.borderRadius(2) : 0,
                  borderBottomRightRadius:
                    message.sender === user.uid ? 0 : theme.borderRadius(2),
                  minWidth: 72,
                  maxWidth: "80%",
                }}
              >
                <TextWithFont
                  styleProps={{
                    width: "100%",
                    textAlign: "left",
                    maxWidth: "100%",
                  }}
                >
                  {message.text}
                </TextWithFont>
                <TextWithFont
                  styleProps={{
                    textAlign: "right",
                    width: "100%",
                    fontSize: theme.fontSize(3),
                    color:
                      message.sender === user.uid
                        ? theme.colors.main[100]
                        : theme.colors.main[200],
                  }}
                >
                  {formatMessageDate(message.createdAt)}
                </TextWithFont>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextWithFont
            styleProps={{
              color: theme.colors.main[200],
            }}
          >
            Enter Your first message!
          </TextWithFont>
        </View>
      )}
      <View // Container for input message and send message button
        style={{
          flexDirection: "row",
          alignItems: "flex-end",
          width: "100%",
          backgroundColor: theme.colors.main[400],
        }}
      >
        <TextInput
          placeholder="Message"
          multiline
          // numberOfLines={4}
          value={messageText}
          placeholderTextColor={theme.colors.main[200]}
          onChange={(e: NativeSyntheticEvent<TextInputChangeEventData>) => {
            handleChangeMessageText(e.nativeEvent.text);
          }}
          textColor={theme.colors.main[100]}
          style={{
            flex: 1,
            maxHeight: 128,
            backgroundColor: theme.colors.main[400],
          }}
        ></TextInput>
        {!disabledSendButton ? (
          <Button
            onPress={onSend}
            style={{
              justifyContent: "center",
              alignItems: "center",
              height: 48,
            }}
          >
            <MaterialIcons
              name="send"
              size={24}
              color={theme.colors.blue[100]}
            />
          </Button>
        ) : null}
      </View>
    </View>
  );
};

export default Chat;
