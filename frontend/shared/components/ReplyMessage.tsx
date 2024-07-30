import { theme } from "../theme";
import { Entypo } from "@expo/vector-icons";
import { Image, TouchableOpacity, View } from "react-native";
import { SERVER_PORT_MAIN, SERVER_URL_MAIN } from "../../config";
import TextWithFont from "./TextWithFont";
import { IMessagePopulated } from "../types";
import { FC } from "react";

type ReplyMessageProps = {
  replyMessage: IMessagePopulated;
  setReplyMessage: (newState: IMessagePopulated | null) => void;
};

const ReplyMessage: FC<ReplyMessageProps> = ({
  replyMessage,
  setReplyMessage,
}) => {
  return (
    <View // Container for replied message
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: theme.spacing(2),
        backgroundColor: theme.colors.main[400],
        width: "100%",
        height: 60,
        borderBottomColor: theme.colors.main[500],
        borderBottomWidth: 1,
        padding: theme.spacing(3),
      }}
    >
      <Entypo
        name="reply"
        size={theme.fontSize(5)}
        color={theme.colors.blue[400]}
      />
      <View // Container for replied message image and text
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: theme.spacing(2),
          flex: 1,
        }}
      >
        {replyMessage.image && (
          <Image
            source={{
              uri: `${SERVER_URL_MAIN}:${SERVER_PORT_MAIN}/${replyMessage.image}`,
            }}
            style={{
              height: "100%",
              width: undefined,
              aspectRatio: 1,
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
              color: theme.colors.blue[300],
            }}
          >
            Reply to {replyMessage.sender.firstName}
          </TextWithFont>
          {replyMessage.image && !replyMessage.text && (
            <TextWithFont // Chat text field
              numberOfLines={1}
              styleProps={{
                color: theme.colors.blue[300],
              }}
            >
              Photo
            </TextWithFont>
          )}
          {replyMessage.text && (
            <TextWithFont
              numberOfLines={1}
              styleProps={{
                color: theme.colors.main[200],
              }}
            >
              {replyMessage.text}
            </TextWithFont>
          )}
        </View>
      </View>
      <TouchableOpacity onPress={() => setReplyMessage(null)}>
        <Entypo
          name="cross"
          size={theme.fontSize(5)}
          color={theme.colors.main[200]}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default ReplyMessage;