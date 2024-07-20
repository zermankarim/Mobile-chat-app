import {
  Dimensions,
  Image,
  NativeScrollEvent,
  Platform,
  TouchableOpacity,
  View,
} from "react-native";
import { FC, useEffect, useState } from "react";
import TextWithFont from "../shared/components/TextWithFont";
import { theme } from "../shared/theme";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../core/store/store";
import { ActivityIndicator, Avatar } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";
import { IUserState, ProfileRouteProps } from "../shared/types";
import * as ImagePicker from "expo-image-picker";
import { database, storage } from "../core/firebase/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import uuid from "react-native-uuid";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { setUser } from "../core/reducers/user";
import { doc, updateDoc } from "firebase/firestore";

const Profile: FC<ProfileRouteProps> = ({ route }) => {
  // Redux states and dispatch
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  // Distructuring
  const { params } = route;
  let { owner } = params;

  // States
  const [avatarUploading, setAvatarUploading] = useState<boolean>(false);
  const [ownerState, setOwnerState] = useState<IUserState>(owner);
  const [activeImage, setActiveImage] = useState<number>(
    owner.avatars.length - 1
  );

  console.log(owner.avatars.length - 1);

  const windowWidth = Dimensions.get("window").width;

  // Functions
  const uploadImage = async (uri: string) => {
    setAvatarUploading(true);
    try {
      const response = await fetch(uri);
      const blob = await response.blob();

      const avatarUid = uuid.v4();

      const storageAvatarRef = ref(
        storage,
        `avatars/${user.uid}/${avatarUid}.jpg`
      );
      await uploadBytes(storageAvatarRef, blob).then((snapshot) => {
        console.log("Uploaded a blob or file!");
      });

      const newAvatarPublicURL = await getDownloadURL(storageAvatarRef);

      const userRef = doc(database, "users", user.uid!);
      await updateDoc(userRef, {
        avatars: [...user.avatars, newAvatarPublicURL],
      });
      setAvatarUploading(false);
    } catch (e: any) {
      console.error("Error during uploading image: ", e.message);
      setAvatarUploading(false);
    }
  };
  const handleImagePicker = async () => {
    // If user doesn't get permission for camera and gallery
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
        return;
      }
    }

    // else
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        const imageURI = result.assets[0].uri;
        uploadImage(imageURI);
      }
    } catch (e: any) {
      console.error(e.message);
    }
  };

  const handleScrollAvatar = (nativeEvent: NativeScrollEvent) => {
    if (nativeEvent) {
      const slide = Math.floor(
        nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width
      );
      const correctedIndex = ownerState.avatars.length - 1 - slide;

      if (correctedIndex !== activeImage) {
        setActiveImage(correctedIndex);
      }
    }
  };

  // Effects
  useEffect(() => {
    setOwnerState(owner);
    setActiveImage(owner.avatars.length - 1);
  }, [owner]);
  useEffect(() => {
    if (!avatarUploading && owner.uid === user.uid) {
      try {
        const q = query(
          collection(database, "users"),
          where("uid", "==", user.uid)
        );
        const unsubscribe = onSnapshot(q, async (snapshot: any) => {
          if (!snapshot.empty) {
            const newUser: IUserState = snapshot.docs[0].data() as IUserState;
            dispatch(setUser(newUser));
            setOwnerState(newUser);
            setActiveImage(newUser.avatars.length - 1);
          }
        });

        return unsubscribe;
      } catch (e: any) {
        console.error("Error during update user at profile page: ", e.message);
      }
    }
  }, [avatarUploading]);

  return (
    <ScrollView
      style={{
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
        <View // Inner container for avatar
          style={{
            width: "100%",
            height: windowWidth,
          }}
        >
          <View
            style={{
              position: "absolute",
              display: "flex",
              top: 20,
              flexDirection: "row",
              alignSelf: "center",
              zIndex: 1,
              width: "100%",
            }}
          >
            {ownerState.avatars
              .map((avatar, index) => {
                console.log("ActiveImage: ", activeImage);
                console.log("Index: ", index);
                return (
                  <View
                    key={uuid.v4() + "avatarsDots"}
                    style={{
                      flex: 1,
                      height: 1,
                      backgroundColor:
                        activeImage === index
                          ? theme.colors.main[100]
                          : theme.colors.main[200],
                      margin: theme.spacing(1),
                    }}
                  />
                );
              })
              .reverse()}
          </View>
          {avatarUploading ? (
            <ActivityIndicator
              size={"large"}
              color={theme.colors.main[100]}
              style={{
                flex: 1,
                backgroundColor: theme.colors.main[500],
              }}
            ></ActivityIndicator>
          ) : ownerState.avatars.length ? (
            <ScrollView
              onScroll={({ nativeEvent }) => handleScrollAvatar(nativeEvent)}
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              horizontal
              style={{
                position: "relative",
                width: windowWidth,
                height: windowWidth,
              }}
            >
              {ownerState.avatars
                .map((avatar, index) => (
                  <Image
                    key={uuid.v4() + "-userAvatar"}
                    source={{
                      uri: avatar, // Используем avatar напрямую
                    }}
                    style={{
                      borderRadius: 0,
                      width: windowWidth,
                      height: windowWidth,
                      resizeMode: "cover",
                    }}
                  />
                ))
                .reverse()}
            </ScrollView>
          ) : (
            <Avatar.Text
              size={128}
              label={ownerState?.firstName![0] + ownerState?.lastName![0]}
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
            }}
          >
            {ownerState.firstName + " " + ownerState.lastName}
          </TextWithFont>
          {owner.uid === user.uid && (
            <TouchableOpacity
              onPress={handleImagePicker}
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
          )}
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
              {ownerState.email}
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
                color: owner.dateOfBirth
                  ? theme.colors.main[100]
                  : theme.colors.main[200],
              }}
            >
              {ownerState.dateOfBirth
                ? ownerState.dateOfBirth
                : "Not indicated"}
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
