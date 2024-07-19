import { Dimensions, Image, TouchableOpacity, View } from "react-native";
import { FC } from "react";
import TextWithFont from "../shared/components/TextWithFont";
import { theme } from "../shared/theme";
import { useSelector } from "react-redux";
import { RootState } from "../core/store/store";
import { Avatar } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";

const Profile: FC = () => {
  // Redux states and dispatch
  const user = useSelector((state: RootState) => state.user);

  const windowWidth = Dimensions.get("window").width;

  return (
    <ScrollView
      style={{
        flex: 1,
        flexDirection: "column",
        backgroundColor: theme.colors.main[500],
      }}
    >
      <View // Outer container for avatar
        style={{
          position: "relative",
          width: "100%",
          height: windowWidth + theme.spacing(6),
          backgroundColor: theme.colors.main[400],
        }}
      >
        <View // Innert container for avatar
          style={{
            position: "relative",
            width: "100%",
            height: windowWidth,
          }}
        >
          {user.avatar ? (
            <Image
              // size={64}
              source={{ uri: user.avatar }}
              style={{
                borderRadius: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            ></Image>
          ) : (
            <Avatar.Text
              size={128}
              label={user?.firstName![0] + user?.lastName![0]}
              style={{
                backgroundColor: theme.colors.main[200],
                borderRadius: 0,
                width: "100%",
                height: "100%",
              }}
            />
          )}
          <TextWithFont
            styleProps={{
              position: "absolute",
              bottom: theme.spacing(5),
              left: theme.spacing(5),
              fontSize: theme.fontSize(8),
              zIndex: 1,
            }}
          >
            {user.firstName + " " + user.lastName}
          </TextWithFont>
          <TouchableOpacity
            style={{
              position: "absolute",
              bottom: theme.spacing(-6),
              right: theme.spacing(4),
              backgroundColor: theme.colors.blue[100],
              borderRadius: 50,
              padding: theme.spacing(3),
            }}
          >
            <MaterialIcons
              name="add-a-photo"
              size={24}
              color={theme.colors.main[100]}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View // Outer container for user info
        style={{
          width: "100%",
          minHeight: "100%",
          paddingHorizontal: theme.spacing(4),
          backgroundColor: theme.colors.main[400],
        }}
      >
        <View
          style={{
            flexDirection: "column",
          }}
        >
          <TextWithFont
            styleProps={{
              width: "100%",
              color: theme.colors.main[200],
            }}
          >
            Account
          </TextWithFont>
          <View // Container for user email
            style={{
              borderBottomColor: theme.colors.main[500],
              borderBottomWidth: 0.5,
              paddingVertical: theme.spacing(2),
            }}
          >
            <TextWithFont
              styleProps={{
                fontSize: theme.fontSize(4),
              }}
            >
              {user.email}
            </TextWithFont>
            <TextWithFont
              styleProps={{
                fontSize: theme.fontSize(3),
                color: theme.colors.main[200],
              }}
            >
              User email
            </TextWithFont>
          </View>
          <View
            style={{
              borderBottomColor: theme.colors.main[500],
              borderBottomWidth: 0.5,
              paddingVertical: theme.spacing(2),
            }}
          >
            <TextWithFont // Container for user date of birth
              styleProps={{
                fontSize: theme.fontSize(4),
                color: user.dateOfBirth
                  ? theme.colors.main[100]
                  : theme.colors.main[200],
              }}
            >
              {user.dateOfBirth ? user.dateOfBirth : "Not indicated"}
            </TextWithFont>
            <TextWithFont
              styleProps={{
                fontSize: theme.fontSize(3),
                color: theme.colors.main[200],
              }}
            >
              Date of birth
            </TextWithFont>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Profile;
