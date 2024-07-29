import { FC, RefObject, useCallback, useEffect, useRef, useState } from "react";
import { theme } from "../shared/theme";
import {
  Image,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  View,
} from "react-native";
import { ActivityIndicator, Avatar, Button } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../core/store/store";
import uuid from "react-native-uuid";
import TextWithFont from "../shared/components/TextWithFont";
import { ChatRouteProps, IMessagePopulated, IUserState } from "../shared/types";
import { formatMessageDate, scrollToBottom } from "../shared/functions";
import { useGlobalContext } from "../core/context/Context";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { setCurrentChat } from "../core/reducers/currentChat";
import { Ionicons } from "@expo/vector-icons";
import { SERVER_PORT_MAIN, SERVER_URL_MAIN } from "../config";
import InputMessage from "../shared/components/InputMessage";
import { Entypo } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Chat: FC<ChatRouteProps> = ({ navigation }) => {
  // Global context states
  const { connectionState, chatLoading, setChatLoading } = useGlobalContext();

  // Redux states and dispatch
  const currentChat = useSelector((state: RootState) => state.currentChat);
  const user = useSelector((state: RootState) => state.user);
  const messages = useSelector((state: RootState) => state.messages);
  const dispatch = useDispatch();

  // Ref
  const scrollViewRef: RefObject<ScrollView> = useRef<ScrollView>(null);

  // States
  const [selectedMessages, setSelectedMessages] = useState<IMessagePopulated[]>(
    []
  );
  const [oneRecipient, setOneRecipient] = useState<IUserState | null>(null);

  // Functions
  const handleSelectMessage = (message: IMessagePopulated) => {
    const selectedMessageIdx = selectedMessages.findIndex(
      (selMsg) => selMsg._id === message._id
    );
    if (selectedMessageIdx === -1) {
      setSelectedMessages([...selectedMessages, message]);
    } else {
      const selectedMessagesCopy = selectedMessages.slice();
      selectedMessagesCopy.splice(selectedMessageIdx, 1);
      setSelectedMessages(selectedMessagesCopy);
    }
  };

  const handleDeleteMessages = () => {
    const participantsIds: string[] = currentChat.participants.map(
      (participant: IUserState) => participant._id!
    );
    connectionState?.emit(
      "deleteMessages",
      currentChat._id,
      selectedMessages,
      participantsIds
    );
    setSelectedMessages([]);
  };

  // Effects
  useEffect(() => {
    setChatLoading(true);
  }, []);

  useEffect(() => {
    scrollToBottom(scrollViewRef);
  }, [messages]);

  useFocusEffect(
    useCallback(() => {
      connectionState?.emit("getChatById", currentChat._id);
      connectionState?.emit("getChatsByUserId", user._id!);
      scrollToBottom(scrollViewRef);
    }, [currentChat])
  );

  useFocusEffect(
    useCallback(() => {
      setSelectedMessages([]);
    }, [])
  );

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
      {/* {Header container} */}
      <View
        style={{
          position: "absolute",
          flexDirection: "row",
          gap: theme.spacing(4),
          width: "100%",
          paddingVertical: theme.spacing(2),
          paddingTop: StatusBar?.currentHeight
            ? StatusBar.currentHeight + theme.spacing(2)
            : 0,
          backgroundColor: theme.colors.main[400],
          zIndex: 1,
        }}
      >
        {selectedMessages.length ? (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              height: 40,
              width: "100%",
              gap: theme.spacing(3),
              paddingHorizontal: theme.spacing(2),
            }}
          >
            <TouchableOpacity
              onPress={() => setSelectedMessages([])}
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: theme.spacing(2),
                padding: theme.spacing(2),
              }}
            >
              <Entypo
                name="cross"
                size={theme.fontSize(5)}
                color={theme.colors.main[100]}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              />
              <TextWithFont
                styleProps={{
                  fontSize: theme.fontSize(4),
                }}
              >
                {selectedMessages.length}
              </TextWithFont>
            </TouchableOpacity>

            <View
              style={{
                flexDirection: "row",
                gap: theme.spacing(2),
              }}
            >
              <Button
                onPress={() => navigation.navigate("Chats")}
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 8,
                }}
              >
                <Entypo
                  name="forward"
                  size={theme.fontSize(5)}
                  color={theme.colors.main[100]}
                />
              </Button>
              <Button
                onPress={handleDeleteMessages}
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 8,
                }}
              >
                <MaterialCommunityIcons
                  name="delete-outline"
                  size={theme.fontSize(5)}
                  color={theme.colors.main[100]}
                />
              </Button>
            </View>
          </View>
        ) : oneRecipient ? (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Profile", { owner: oneRecipient })
            }
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: theme.spacing(3),
            }}
          >
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
            {oneRecipient.avatars.length ? (
              <Avatar.Image
                size={36}
                source={{
                  uri: `${SERVER_URL_MAIN}:${SERVER_PORT_MAIN}/${
                    oneRecipient.avatars[oneRecipient.avatars.length - 1]
                  }`,
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
      {/* {Header container} */}
      {messages.length ? (
        <ScrollView // Container for messages
          ref={scrollViewRef}
          style={{
            position: "relative",
            flexDirection: "column",
          }}
          contentContainerStyle={{
            justifyContent: "flex-end",
            minHeight: "100%",
            paddingVertical: theme.spacing(3),
            backgroundColor: theme.colors.main[500],
          }}
        >
          {messages.map((message) => (
            <TouchableOpacity // Container for message row
              key={uuid.v4() + "-containerRowMessage"}
              onPress={() => {
                if (selectedMessages.length) {
                  handleSelectMessage(message);
                }
              }}
              onLongPress={() => handleSelectMessage(message)}
              style={{
                position: "relative",
                flexDirection: "row",
                justifyContent:
                  message.sender._id === user._id ? "flex-end" : "flex-start",
                width: "100%",
                backgroundColor: selectedMessages.includes(message)
                  ? theme.colors.main[400]
                  : "transparent",
                paddingHorizontal: theme.spacing(3),
                paddingVertical: theme.spacing(1.5),
              }}
            >
              <TouchableOpacity // Container for message
                onLongPress={() => handleSelectMessage(message)}
                onPress={() => {
                  if (selectedMessages.length) {
                    handleSelectMessage(message);
                  }
                }}
                style={{
                  flexDirection: "column",
                  gap: theme.spacing(1),
                  backgroundColor:
                    message.sender._id === user._id
                      ? selectedMessages.includes(message)
                        ? theme.colors.blue[500]
                        : theme.colors.blue[200]
                      : selectedMessages.includes(message)
                      ? theme.colors.main[300]
                      : theme.colors.main[400],
                  paddingVertical: theme.spacing(2),
                  paddingHorizontal: theme.spacing(3),
                  borderTopLeftRadius: theme.borderRadius(2),
                  borderTopRightRadius: theme.borderRadius(2),
                  borderBottomLeftRadius:
                    message.sender._id === user._id ? theme.borderRadius(2) : 0,
                  borderBottomRightRadius:
                    message.sender._id === user._id ? 0 : theme.borderRadius(2),
                  minWidth: 72,
                  maxWidth: "80%",
                }}
              >
                {message.image && (
                  <View
                    style={{
                      width: "100%",
                    }}
                  >
                    <Image
                      source={{
                        uri: `${SERVER_URL_MAIN}:${SERVER_PORT_MAIN}/${message.image}`,
                      }}
                      style={{
                        width: "100%",
                        height: undefined,
                        aspectRatio: 1.5,
                        objectFit: "cover",
                      }}
                    ></Image>
                  </View>
                )}
                {message.text && (
                  <TextWithFont
                    styleProps={{
                      width: "100%",
                      textAlign: "left",
                      maxWidth: "100%",
                    }}
                  >
                    {message.text}
                  </TextWithFont>
                )}
                <TextWithFont
                  styleProps={{
                    textAlign: "right",
                    width: "100%",
                    fontSize: theme.fontSize(3),
                    color:
                      message.sender._id === user._id
                        ? theme.colors.main[100]
                        : theme.colors.main[200],
                  }}
                >
                  {formatMessageDate(message.createdAt)}
                </TextWithFont>
              </TouchableOpacity>
            </TouchableOpacity>
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
      <InputMessage></InputMessage>
    </View>
  );
};

export default Chat;
