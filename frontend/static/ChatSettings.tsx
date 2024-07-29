import { Image, TouchableOpacity, View } from "react-native";
import TextWithFont from "../shared/components/TextWithFont";
import { theme } from "../shared/theme";
import { useState } from "react";

const ChatSettings = () => {
  // States
  const [bgContainerColor, setBgContainerColor] = useState<string>(
    theme.colors.main[500]
  );
  const [bgImageColor, setBgImageColor] = useState<string>(
    theme.colors.blue[100]
  );
  const [senderMsgBgColor, setSenderMsgBgColor] = useState<string>(
    theme.colors.blue[500]
  );
  const [recipientsMsgBgColor, setRecipientsMsgBgColor] = useState<string>(
    theme.colors.main[300]
  );

  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: bgContainerColor,
      }}
    >
      <View // Outer Container for chat example
      >
        <Image
          source={require("../assets/chat-background-items.png")}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            tintColor: bgImageColor,
          }}
        ></Image>
        <TouchableOpacity // Container for message row
          style={{
            position: "relative",
            flexDirection: "row",
            justifyContent: "flex-start",
            width: "100%",
            paddingHorizontal: theme.spacing(3),
            paddingVertical: theme.spacing(1.5),
          }}
        >
          <TouchableOpacity // Container for message
            style={{
              flexDirection: "column",
              gap: theme.spacing(1),
              backgroundColor: recipientsMsgBgColor,
              paddingVertical: theme.spacing(2),
              paddingHorizontal: theme.spacing(3),
              borderTopLeftRadius: theme.borderRadius(2),
              borderTopRightRadius: theme.borderRadius(2),
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: theme.borderRadius(2),
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
              {"Hello! How are you? :)"}
            </TextWithFont>
            <TextWithFont
              styleProps={{
                textAlign: "right",
                width: "100%",
                fontSize: theme.fontSize(3),
                color: theme.colors.main[200],
              }}
            >
              {"20:50"}
            </TextWithFont>
          </TouchableOpacity>
        </TouchableOpacity>

        <TouchableOpacity // Container for message row
          style={{
            position: "relative",
            flexDirection: "row",
            justifyContent: "flex-end",
            width: "100%",
            paddingHorizontal: theme.spacing(3),
            paddingVertical: theme.spacing(1.5),
          }}
        >
          <TouchableOpacity // Container for message
            style={{
              flexDirection: "column",
              gap: theme.spacing(1),
              backgroundColor: senderMsgBgColor,
              paddingVertical: theme.spacing(2),
              paddingHorizontal: theme.spacing(3),
              borderTopLeftRadius: theme.borderRadius(2),
              borderTopRightRadius: theme.borderRadius(2),
              borderBottomLeftRadius: theme.borderRadius(2),
              borderBottomRightRadius: 0,
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
              Some Text
            </TextWithFont>
            <TextWithFont
              styleProps={{
                textAlign: "right",
                width: "100%",
                fontSize: theme.fontSize(3),
                color: theme.colors.main[100],
              }}
            >
              {"20:50"}
            </TextWithFont>
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
      <View
        style={{
          width: "100%",
          minHeight: 50,
          backgroundColor: theme.colors.main[400],
        }}
      ></View>
    </View>
  );
};

export default ChatSettings;
