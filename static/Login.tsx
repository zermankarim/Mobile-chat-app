import {
  ActivityIndicator,
  Alert,
  NativeSyntheticEvent,
  TextInputChangeEventData,
  View,
} from "react-native";
import { FC, SetStateAction, useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../core/reducers/user";
import { auth, database } from "../core/firebase/firebase";
import { IUserState, LoginRouteProps } from "../shared/types";
import { doc, getDoc } from "firebase/firestore";
import TextWithFont from "../shared/components/TextWithFont";
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { MaterialIcons } from "@expo/vector-icons";
import { Button } from "react-native-paper";
import { theme } from "../shared/theme";
import { TextInput } from "react-native-gesture-handler";

const Login: FC<LoginRouteProps> = ({ navigation }) => {
  // Redux states and dispatch
  const dispatch = useDispatch();

  // States
  const [isVisibleOverlay, setIsVisibleOverlay] = useState<boolean>(false);
  const [isDisabledButton, setIsDisabledButton] = useState<boolean>(false);

  const [loadingLogin, setLoadingLogin] = useState<boolean>(false);

  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);

  const [showEmailError, setShowEmailError] =
    useState<SetStateAction<boolean>>(false);
  const [showPasswordError, setShowPasswordError] =
    useState<SetStateAction<boolean>>(false);

  // Functions
  const handleEmailChange = (
    e: NativeSyntheticEvent<TextInputChangeEventData>
  ) => {
    if (!e.nativeEvent.text) {
      setShowEmailError(true);
    }
    if (e.nativeEvent.text) {
      setShowEmailError(false);
    }
    setEmail(e.nativeEvent.text);
  };

  const handlePasswordChange = (
    e: NativeSyntheticEvent<TextInputChangeEventData>
  ) => {
    if (!e.nativeEvent.text) {
      setShowPasswordError(true);
    }
    if (e.nativeEvent.text) {
      setShowPasswordError(false);
    }
    setPassword(e.nativeEvent.text);
  };

  const onHandleLogin = async () => {
    setIsDisabledButton(true);
    setLoadingLogin(true);
    if (!email || !password) {
      Alert.alert("All fields must be filled in");
      setLoadingLogin(false);
      setIsDisabledButton(false);
      return;
    }
    try {
      // Getting user from auth
      const { user: userFromAuth } = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      // Getting user data from firestore by user's from auth uid
      const userRef = doc(database, "users", userFromAuth.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData: IUserState = userSnap.data() as IUserState;
        dispatch(setUser(userData));
      } else {
        console.error("No such document!");
      }
      setLoadingLogin(false);
      setIsDisabledButton(false);
    } catch (e: any) {
      Alert.alert("Error during login user: ", e.message);
      setLoadingLogin(false);
      setIsDisabledButton(false);
    }
  };

  const handleResetPassword = async (email: string | null) => {
    setIsDisabledButton(true);
    if (email) {
      sendPasswordResetEmail(auth, email)
        .then(() => {
          // Password reset email sent!
          setEmail(null);
          setIsDisabledButton(false);
          setIsVisibleOverlay(false);
          Alert.alert("Password reset information sent successfully!");
        })
        .catch((error) => {
          setIsDisabledButton(false);
          setEmail(null);
          setIsVisibleOverlay(false);
          const errorMessage = error.message;

          Alert.alert("Eror during sending password reset info", errorMessage);
          console.error(
            "Eror during sending password reset info",
            errorMessage
          );
          // ..
        });
    }
  };
  if (loadingLogin) {
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
    <View // Outer container
      style={{
        flex: 1,
        justifyContent: "center",
        backgroundColor: theme.colors.main[500],
        padding: theme.spacing(2),
      }}
    >
      <View // Inner container
        style={{
          justifyContent: "center",
          alignItems: "center",
          gap: theme.spacing(2),
          padding: theme.spacing(3),
          backgroundColor: theme.colors.main[400],
          borderColor: theme.colors.main[300],
          borderWidth: 1,
          borderRadius: 12,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 6,
          },
          shadowOpacity: 0.23,
          shadowRadius: 8.3,
          elevation: 10,
        }}
      >
        <TextWithFont
          styleProps={{
            fontSize: theme.fontSize(8),
            color: "white",
          }}
        >
          Log In
        </TextWithFont>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: theme.spacing(5),
            gap: theme.spacing(2),
            width: "100%",
          }}
        >
          <TextInput
            placeholder="Email"
            placeholderTextColor={theme.colors.main[200]}
            style={{
              color: theme.colors.main[100],
            }}
            onChange={handleEmailChange}
            value={email || undefined}
          ></TextInput>
          <TextInput
            placeholder="Password"
            placeholderTextColor={theme.colors.main[200]}
            style={{
              color: theme.colors.main[100],
            }}
            onChange={handlePasswordChange}
            value={password || undefined}
            secureTextEntry={true}
          ></TextInput>
        </View>

        <Button
          onPress={onHandleLogin}
          loading={isDisabledButton}
          disabled={isDisabledButton}
          textColor={theme.colors.main[100]}
          style={{
            backgroundColor: theme.colors.main[200],
            borderRadius: 5,
            width: "100%",
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 6,
            },
            shadowOpacity: 0.23,
            shadowRadius: 8.3,
            elevation: 10,
          }}
          //   containerStyle={{
          //     marginHorizontal: 50,
          //     height: 50,
          //     marginVertical: 10,
          //     width: "100%",
          //   }}
        >
          Log In
        </Button>
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            gap: theme.spacing(1),
            width: "100%",
          }}
        >
          <TextWithFont
            styleProps={{
              color: "white",
            }}
          >
            Don't have an account?
          </TextWithFont>
          <Button
            onPress={() => navigation.navigate("SignUp")}
            style={{
              backgroundColor: "transparent",
            }}
          >
            <TextWithFont
              styleProps={{
                color: theme.colors.main[200],
              }}
            >
              Sign Up
            </TextWithFont>
          </Button>
        </View>
        <View
          style={{
            borderWidth: 0.5,
            borderColor: theme.colors.main[400],
            width: "100%",
          }}
        ></View>
        {/* <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            gap: theme.spacing(1),
            width: "100%",
          }}
        >
          <TextWithFont
            styleProps={{
              color: "white",
            }}
          >
            Forgot your password?
          </TextWithFont>
          <Button
            onPress={() => setIsVisibleOverlay(true)}
            style={{
              backgroundColor: "transparent",
            }}
          >
            <TextWithFont
              styleProps={{
                color: theme.colors.main[200],
              }}
            >
              Reset
            </TextWithFont>
          </Button>
        </View> */}
      </View>
      {/* <Overlay
          isVisible={isVisibleOverlay}
          onBackdropPress={() => {
            setIsVisibleOverlay(false);
            setEmail(null);
            setIsDisabledButton(false);
          }}
          overlayStyle={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            width: "90%",
            borderRadius: 12,
            backgroundColor: palette.dark[100],
            borderWidth: 1,
            borderColor: palette.light[100],
            padding: 12,
          }}
        >
          <MaterialIcons name="lock-reset" size={64} color={palette.light[700]} />
          <TextWithFont
            styleProps={{
              fontSize: 16,
              width: "100%",
              textAlign: "center",
              color: palette.light[1000],
            }}
          >
            We'll send your password reset info to the email address linked to you
            acconut.
          </TextWithFont>
          <Input
            placeholder="Email"
            onChange={handleEmailChange}
            errorStyle={{ color: "red" }}
            style={{
              color: "white",
            }}
            errorMessage={
              !password && showPasswordError ? "This field must be fill" : ""
            }
          ></Input>
          <Button
            title="Reset password"
            onPress={() => handleResetPassword(email)}
            loading={isDisabledButton}
            disabled={isDisabledButton}
            disabledStyle={{
              backgroundColor: palette.light[300],
            }}
            loadingProps={{ size: "small", color: "white" }}
            buttonStyle={{
              backgroundColor: palette.blue[200],
              borderRadius: 5,
              width: "100%",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 6,
              },
              shadowOpacity: 0.23,
              shadowRadius: 8.3,
              elevation: 4,
            }}
            titleStyle={{ fontWeight: "bold", fontSize: 16 }}
            containerStyle={{
              marginHorizontal: 50,
              height: 50,
              marginVertical: 10,
              width: "100%",
            }}
          />
        </Overlay> */}
    </View>
  );
};

export default Login;
