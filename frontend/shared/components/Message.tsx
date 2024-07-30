import { FC, useState } from "react";
import { IMessagePopulated } from "../types";
import { useSelector } from "react-redux";
import { RootState } from "../../core/store/store";
import uuid from "react-native-uuid";
import { Image, TouchableOpacity, View } from "react-native";
import { theme } from "../theme";
import TextWithFont from "./TextWithFont";
import { SERVER_PORT_MAIN, SERVER_URL_MAIN } from "../../config";
import { LinearGradient } from "expo-linear-gradient";
import { formatMessageDate } from "../functions";
import { Button, Divider, Menu } from "react-native-paper";

type MessageProps = {
  message: IMessagePopulated;
  selectedMessages: IMessagePopulated[];
  setSelectedMessages: (newState: IMessagePopulated[]) => void;
};

const Message: FC<MessageProps> = ({
  message,
  selectedMessages,
  setSelectedMessages,
}) => {
  // Redux states and dispatch
  const user = useSelector((state: RootState) => state.user);
  const messages = useSelector((state: RootState) => state.messages);

  //States
  const [visible, setVisible] = useState(false);

  // Functions
  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

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
  return (
    <View
      style={{
        flexDirection: "row",
        width: "100%",
      }}
    >
      <Menu
        theme={{ animation: { scale: 2 } }}
        visible={visible}
        onDismiss={closeMenu}
        anchorPosition="top"
        style={{
          position: "absolute",
          right:
            message.sender._id === user._id || message.type === "forward"
              ? "20%"
              : undefined,
          left:
            message.sender._id !== user._id &&
            message.forwarder?._id !== user._id
              ? "20%"
              : undefined,
          marginRight: 0,
        }}
        anchor={
          <TouchableOpacity // Container for message row
            key={uuid.v4() + "-containerRowMessage"}
            onPress={() => {
              if (selectedMessages.length) {
                handleSelectMessage(message);
              }
              openMenu();
            }}
            onLongPress={() => {
              handleSelectMessage(message);
            }}
            style={{
              position: "relative",
              flexDirection: "row",
              justifyContent:
                message.sender._id === user._id ||
                (message.type === "forward" &&
                  message.forwarder?._id === user._id)
                  ? "flex-end"
                  : "flex-start",
              width: "100%",
              backgroundColor: selectedMessages.includes(message)
                ? theme.colors.main[400]
                : "transparent",
              paddingHorizontal: theme.spacing(3),
              paddingVertical: theme.spacing(1.5),
            }}
          >
            <TouchableOpacity // Container for message
              onLongPress={() => {
                handleSelectMessage(message);
              }}
              onPress={() => {
                if (selectedMessages.length) {
                  handleSelectMessage(message);
                }
                openMenu();
              }}
              // If message forwarded, it will be rendered with sender styles
              style={{
                flexDirection: "column",
                gap: theme.spacing(1),
                backgroundColor:
                  message.sender._id === user._id ||
                  (message.type === "forward" &&
                    message.forwarder?._id === user._id)
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
                  message.sender._id === user._id ||
                  (message.type === "forward" &&
                    message.forwarder?._id === user._id)
                    ? theme.borderRadius(2)
                    : 0,
                borderBottomRightRadius:
                  message.sender._id === user._id ||
                  (message.type === "forward" &&
                    message.forwarder?._id === user._id)
                    ? 0
                    : theme.borderRadius(2),
                minWidth: 72,
                maxWidth: "80%",
              }}
            >
              {message.type === "forward" && (
                <View // Container for forward message info
                  style={{
                    flexDirection: "column",
                  }}
                >
                  <TextWithFont>Forwarded from</TextWithFont>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: theme.spacing(1),
                    }}
                  >
                    {/*If forward message sender has avatars - render last, else - render linear gradient*/}
                    {message.sender.avatars.length ? (
                      <Image
                        source={{
                          uri: `${SERVER_URL_MAIN}:${SERVER_PORT_MAIN}/${
                            message.sender.avatars[
                              message.sender.avatars.length - 1
                            ]
                          }`,
                        }}
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 40,
                        }}
                      ></Image>
                    ) : (
                      <LinearGradient
                        colors={message.sender.backgroundColors}
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                          width: 20,
                          height: 20,
                          borderRadius: 40,
                        }}
                      >
                        <TextWithFont
                          styleProps={{
                            fontSize: theme.fontSize(2),
                          }}
                        >
                          {message.sender.firstName![0] +
                            message.sender.lastName![0]}
                        </TextWithFont>
                      </LinearGradient>
                    )}
                    <TextWithFont
                      styleProps={{
                        fontWeight: 700,
                      }}
                    >
                      {message.sender.firstName}
                    </TextWithFont>
                  </View>
                </View>
              )}
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
              {message.replyMessage && (
                <View
                  style={{
                    flexDirection: "row",
                    width: "100%",
                    borderRadius: theme.spacing(2),
                    backgroundColor: theme.colors.blue[300],
                    padding: theme.spacing(1),
                    gap: theme.spacing(2),
                    borderLeftColor: theme.colors.main[100],
                    borderLeftWidth: 2,
                  }}
                >
                  {message.replyMessage.image && (
                    <Image
                      source={{
                        uri: `${SERVER_URL_MAIN}:${SERVER_PORT_MAIN}/${message.replyMessage.image}`,
                      }}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: theme.spacing(1),
                      }}
                    ></Image>
                  )}
                  <View // Container for replied message text
                    style={{
                      flexDirection: "column",
                    }}
                  >
                    <TextWithFont
                      styleProps={{
                        color: theme.colors.main[100],
                      }}
                    >
                      {message.replyMessage.sender.firstName}
                    </TextWithFont>

                    {message.replyMessage.text && (
                      <TextWithFont
                        styleProps={{
                          color: theme.colors.main[100],
                        }}
                      >
                        {message.replyMessage.text}
                      </TextWithFont>
                    )}
                  </View>
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
                    message.sender._id === user._id ||
                    message.type === "forward"
                      ? theme.colors.main[100]
                      : theme.colors.main[200],
                }}
              >
                {formatMessageDate(message.createdAt)}
              </TextWithFont>
            </TouchableOpacity>
          </TouchableOpacity>
        }
      >
        <Menu.Item onPress={() => {}} title="Item 1" />
        <Menu.Item onPress={() => {}} title="Item 2" />
        <Divider />
        <Menu.Item onPress={() => {}} title="Item 3" />
      </Menu>
    </View>
  );
};

export default Message;
