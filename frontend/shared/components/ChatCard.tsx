import { TouchableOpacity, View } from "react-native";
import { FC } from "react";
import TextWithFont from "../components/TextWithFont";
import { theme } from "../theme";
import { ChatScreenNavigationProp, IChatPopulated, IUserState } from "../types";
import { useNavigation } from "@react-navigation/native";
import { RootState } from "../../core/store/store";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../../core/reducers/messages";
import { setCurrentChat } from "../../core/reducers/currentChat";
import { Avatar, Badge } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { formatMessageDate } from "../functions";
import { LinearGradient } from "expo-linear-gradient";

interface IChatCartProps {
  chat: IChatPopulated;
  setSelectedChats?: React.Dispatch<React.SetStateAction<IChatPopulated[]>>;
  isSelectedChat?: boolean;
  selectedChats?: IChatPopulated[];
  oneRecipient: IUserState | false | undefined;
}

const ChatCard: FC<IChatCartProps> = ({
  chat,
  setSelectedChats,
  selectedChats,
  isSelectedChat,
  oneRecipient,
}) => {
  const navigation = useNavigation<ChatScreenNavigationProp>();
  // Redux states and dispatch
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  // Distructuring
  const { messages } = chat;

  // Functions
  const handleSelectChat = () => {
    if (setSelectedChats && selectedChats) {
      if (!isSelectedChat) {
        setSelectedChats((prevState) => [...prevState, chat]);
      } else {
        const selectedChatIdx = selectedChats.findIndex(
          (selectedChat) => selectedChat._id === chat._id
        );
        const selectedChatsSlice = selectedChats.slice();
        selectedChatsSlice.splice(selectedChatIdx, 1);
        setSelectedChats(selectedChatsSlice);
      }
    }
  };

  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        gap: theme.spacing(3),
        width: "100%",
        paddingVertical: theme.spacing(2),
        borderColor: theme.colors.main[500],
        borderBottomWidth: 0.6,
        paddingHorizontal: theme.spacing(4),
      }}
      onPress={() => {
        if (selectedChats && selectedChats.length) {
          handleSelectChat();
        } else {
          dispatch(setMessages(chat.messages));
          dispatch(setCurrentChat(chat));
          navigation.navigate("Chat");
        }
      }}
      onLongPress={handleSelectChat}
    >
      <View // Container for avatar
        style={{
          position: "relative",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {oneRecipient ? (
          oneRecipient.avatars.length ? (
            <Avatar.Image
              size={48}
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
                width: 48,
                height: 48,
                borderRadius: 50,
              }}
            >
              <TextWithFont>
                {oneRecipient?.firstName![0] + oneRecipient?.lastName![0]}
              </TextWithFont>
            </LinearGradient>
          )
        ) : (
          <MaterialIcons
            name="groups"
            size={48}
            color={theme.colors.main[200]}
          />
        )}
        {isSelectedChat && (
          <Badge
            style={{
              position: "absolute",
              bottom: 0,
              backgroundColor: "lightgreen",
            }}
          ></Badge>
        )}
      </View>
      <View // Container for user name and text of message
        style={{
          flexDirection: "column",
          flex: 1,
          gap: theme.spacing(1),
        }}
      >
        {oneRecipient ? (
          <TextWithFont // Text field for name
            styleProps={{
              color: theme.colors.main[100],
              fontSize: theme.fontSize(4),
            }}
          >
            {oneRecipient.firstName + " " + oneRecipient.lastName}
          </TextWithFont>
        ) : (
          <TextWithFont // Text field for name
            numberOfLines={1}
            styleProps={{
              color: theme.colors.main[100],
              fontSize: theme.fontSize(4),
            }}
          >
            {chat.participants
              .filter(
                (participant: IUserState, index: number) =>
                  participant._id !== user._id && index < 3
              )
              .map(
                (participant: IUserState) =>
                  participant.firstName + " " + participant.lastName
              )
              .join(", ") + " and other.."}
          </TextWithFont>
        )}
        <View
          style={{
            flexDirection: "row",
            gap: theme.spacing(1),
          }}
        >
          {messages.length ? (
            <>
              {messages[messages.length - 1].sender._id === user._id && (
                <TextWithFont
                  numberOfLines={1}
                  styleProps={{
                    color: theme.colors.main[200],
                  }}
                >
                  You:
                </TextWithFont>
              )}
              <TextWithFont // Chat text field
                numberOfLines={1}
                styleProps={{
                  color: theme.colors.main[100],
                }}
              >
                {messages[messages.length - 1].text}
              </TextWithFont>
            </>
          ) : (
            <TextWithFont // Chat text field
              numberOfLines={1}
              styleProps={{
                color: theme.colors.main[200],
                flex: 1,
              }}
            >
              Enter first message!
            </TextWithFont>
          )}
        </View>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
        }}
      >
        <TextWithFont
          styleProps={{
            color: theme.colors.main[200],
            flex: 1,
          }}
        >
          {formatMessageDate(chat.createdAt)}
        </TextWithFont>
      </View>
    </TouchableOpacity>
  );
};

export default ChatCard;
