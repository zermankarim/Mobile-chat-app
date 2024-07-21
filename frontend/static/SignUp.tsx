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
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, database } from "../core/firebase/firebase";
import { IUserState, LoginRouteProps } from "../shared/types";
import { doc, setDoc } from "firebase/firestore";
import TextWithFont from "../shared/components/TextWithFont";
import { theme } from "../shared/theme";
import { Button, TextInput } from "react-native-paper";
import { getRandomColor } from "../shared/functions";

const SignUp: FC<LoginRouteProps> = ({ navigation }) => {
  // Redux dispatch
  const dispatch = useDispatch();

  // States
  const [loadingSignUp, setLoadingSignUp] = useState<boolean>(false);

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);

  const [showEmailError, setShowEmailError] =
    useState<SetStateAction<boolean>>(false);
  const [showPasswordError, setShowPasswordError] =
    useState<SetStateAction<boolean>>(false);

  // Functions
  const handleInputChange = (
    e: NativeSyntheticEvent<TextInputChangeEventData>,
    setNewText: (text: string) => void
  ) => {
    setNewText(e.nativeEvent.text);
    setShowEmailError(!email);
    setShowPasswordError(!password);
  };

  const onHandleSignUp = async () => {
    setShowEmailError(!email);
    setShowPasswordError(!password);
    setLoadingSignUp(true);

    try {
      if (!email || !password || !firstName || !lastName) {
        Alert.alert("All fields must be filled in");
        setLoadingSignUp(false);
        return;
      }
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const newUserState: IUserState = {
        uid: user.uid,
        firstName,
        lastName,
        dateOfBirth: null,
        email: email.toLocaleLowerCase(),
        avatars: [],
        backgroundColors: [getRandomColor(), getRandomColor()],
        friends: [],
      };
      await setDoc(doc(database, "users", user.uid), newUserState);
      dispatch(setUser(newUserState));
      setLoadingSignUp(false);
    } catch (e: any) {
      Alert.alert("Error during create user: ", e.message);
      setLoadingSignUp(false);
    }
  };

  if (loadingSignUp) {
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
    <View // Outer container for SignUp page
      style={{
        flex: 1,
        justifyContent: "center",
        backgroundColor: theme.colors.main[500],
        padding: 12,
      }}
    >
      <View // Inner container
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: theme.spacing(3),
          gap: theme.spacing(3),
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
          Create an account
        </TextWithFont>
        <View // Container for all inputs
          style={{
            display: "flex",
            flexDirection: "column",
            gap: theme.spacing(3),
            marginTop: 20,
            width: "100%",
          }}
        >
          <View // Container for inputs names
            style={{
              display: "flex",
              flexDirection: "row",
              gap: theme.spacing(3),
              width: "100%",
            }}
          >
            <TextInput
              placeholder="First name*"
              textColor={theme.colors.main[100]}
              style={{
                flex: 1,
                color: "white",
                backgroundColor: theme.colors.main[500],
              }}
              onChange={(e: NativeSyntheticEvent<TextInputChangeEventData>) =>
                handleInputChange(e, setFirstName)
              }
            ></TextInput>
            <TextInput
              placeholder="Last name*"
              onChange={(e: NativeSyntheticEvent<TextInputChangeEventData>) =>
                handleInputChange(e, setLastName)
              }
              textColor={theme.colors.main[100]}
              style={{
                flex: 1,
                color: "white",
                backgroundColor: theme.colors.main[500],
              }}
            ></TextInput>
          </View>
          <TextInput
            placeholder="Email*"
            onChange={(e) => handleInputChange(e, setEmail)}
            textColor={theme.colors.main[100]}
            style={{
              color: "white",
              backgroundColor: theme.colors.main[500],
            }}
          ></TextInput>
          <TextInput
            placeholder="Password*"
            onChange={(e) => handleInputChange(e, setPassword)}
            textColor={theme.colors.main[100]}
            style={{
              color: "white",
              backgroundColor: theme.colors.main[500],
            }}
            secureTextEntry={true}
          ></TextInput>
        </View>
        <Button
          onPress={onHandleSignUp}
          loading={false}
          textColor={theme.colors.main[100]}
          style={{
            backgroundColor: theme.colors.main[200],
            borderRadius: 5,
            width: "100%",
          }}
        >
          Sign Up
        </Button>
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            gap: theme.spacing(2),
            width: "100%",
          }}
        >
          <TextWithFont
            styleProps={{
              color: "white",
            }}
          >
            Already have an account?
          </TextWithFont>
          <Button
            onPress={() => navigation.navigate("Login")}
            style={{
              backgroundColor: "transparent",
            }}
          >
            <TextWithFont
              styleProps={{
                color: theme.colors.main[200],
              }}
            >
              Log In
            </TextWithFont>
          </Button>
        </View>
      </View>
    </View>
  );
};

export default SignUp;
