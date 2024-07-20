import { TouchableOpacity, View } from "react-native";
import { FC } from "react";
import TextWithFont from "../components/TextWithFont";
import { theme } from "../theme";
import { ChatScreenNavigationProp, IChatClient, IUserState } from "../types";
import { useNavigation } from "@react-navigation/native";
import { RootState } from "../../core/store/store";
import { useDispatch, useSelector } from "react-redux";
import { format, isThisWeek, isToday, parseISO } from "date-fns";
import { setMessages } from "../../core/reducers/messages";
import { setCurrentChat } from "../../core/reducers/currentChat";
import { Avatar, Badge } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";

interface IChatCartProps {
  chat: IChatClient;
  setSelectedChats?: React.Dispatch<React.SetStateAction<IChatClient[]>>;
  isSelectedChat?: boolean;
  selectedChats?: IChatClient[];
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
          (selectedChat) => selectedChat.id === chat.id
        );
        const selectedChatsSlice = selectedChats.slice();
        selectedChatsSlice.splice(selectedChatIdx, 1);
        setSelectedChats(selectedChatsSlice);
      }
    }
  };

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
            <Avatar.Text
              size={48}
              label={oneRecipient?.firstName![0] + oneRecipient?.lastName![0]}
              style={{
                backgroundColor: theme.colors.main[200],
              }}
            />
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
                (participant, index) =>
                  participant.uid !== user.uid && index < 3
              )
              .map(
                (participant) =>
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
              {messages[messages.length - 1].sender === user.uid && (
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
