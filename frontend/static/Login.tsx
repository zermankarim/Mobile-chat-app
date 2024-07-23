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
// import { doc, getDoc } from "firebase/firestore";
import TextWithFont from "../shared/components/TextWithFont";
import {
  sendPasswordResetEmail,
  // signInWithEmailAndPassword,
} from "firebase/auth";
import { MaterialIcons } from "@expo/vector-icons";
import { Button, TextInput } from "react-native-paper";
import { theme } from "../shared/theme";
import { signInWithEmailAndPassword } from "../fetches/http";
import { useGlobalContext } from "../core/context/Context";
import { connectToSocket } from "../shared/functions";

const Login: FC<LoginRouteProps> = ({ navigation }) => {
  // Global context
  const { setConnectionState } = useGlobalContext();

  // Redux states and dispatch
  const dispatch = useDispatch();

  // States
  const [isVisibleOverlay, setIsVisibleOverlay] = useState<boolean>(false);
  const [isDisabledButton, setIsDisabledButton] = useState<boolean>(false);

  const [loadingLogin, setLoadingLogin] = useState<boolean>(false);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // Functions
  const handleEmailChange = (
    e: NativeSyntheticEvent<TextInputChangeEventData>
  ) => {
    setEmail(e.nativeEvent.text);
  };

  const handlePasswordChange = (
    e: NativeSyntheticEvent<TextInputChangeEventData>
  ) => {
    setPassword(e.nativeEvent.text);
  };

  const onHandleLogin = async () => {
    setIsDisabledButton(true);
    if (!email || !password) {
      Alert.alert("All fields must be filled in");
      setLoadingLogin(false);
      setIsDisabledButton(false);
      return;
    }
    try {
      setLoadingLogin(true);
      const response = await signInWithEmailAndPassword(email, password);
      if (response) {
        const { success } = response;

        if (!success) {
          const { message } = response;
          console.error(message);
          setLoadingLogin(false);
          setIsDisabledButton(false);
          Alert.alert(message!);
          return;
        }

        const { data: userData } = response;
        dispatch(setUser(userData!));
        console.log(userData);
        setLoadingLogin(false);
        setIsDisabledButton(false);
        const socket = connectToSocket(userData!._id!);
        setConnectionState(socket);
      } else {
        setLoadingLogin(false);
        setIsDisabledButton(false);
        Alert.alert("Error on logging in");
        throw new Error("No response");
      }
    } catch (e: any) {
      setLoadingLogin(false);
      setIsDisabledButton(false);
      Alert.alert("Error on logging in: ", e.message);
      throw new Error(e.message);
    }
  };

  // This function isn't working now.
  const handleResetPassword = async (email: string | null) => {
    setIsDisabledButton(true);
    if (email) {
      sendPasswordResetEmail(auth, email)
        .then(() => {
          // Password reset email sent!
          setEmail("");
          setIsDisabledButton(false);
          setIsVisibleOverlay(false);
          Alert.alert("Password reset information sent successfully!");
        })
        .catch((error) => {
          setIsDisabledButton(false);
          setEmail("");
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
          gap: theme.spacing(3),
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
        <View // Container for inputs
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: theme.spacing(5),
            gap: theme.spacing(3),
            width: "100%",
          }}
        >
          <TextInput
            placeholder="Email"
            placeholderTextColor={theme.colors.main[200]}
            textColor={theme.colors.main[100]}
            style={{
              color: theme.colors.main[100],
              backgroundColor: theme.colors.main[500],
            }}
            onChange={handleEmailChange}
            value={email || undefined}
          ></TextInput>
          <TextInput
            placeholder="Password"
            placeholderTextColor={theme.colors.main[200]}
            textColor={theme.colors.main[100]}
            style={{
              color: theme.colors.main[100],
              backgroundColor: theme.colors.main[500],
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
