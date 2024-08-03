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
import { LoginRouteProps } from "../shared/types";
import TextWithFont from "../shared/components/TextWithFont";
import { Button, TextInput } from "react-native-paper";
import { createUserWithEmailPassAndNames } from "../fetches/http";
import { connectToSocket } from "../shared/functions";
import { useGlobalContext } from "../core/context/Context";
import { createTheme } from "../shared/theme";
import storage from "../core/storage/storage";
import uuid from "react-native-uuid";

const SignUp: FC<LoginRouteProps> = ({ navigation }) => {
	// Global context
	const { setConnectionState } = useGlobalContext();
	const theme = createTheme("default");

	// Redux dispatch
	const dispatch = useDispatch();

	// States
	const [loadingSignUp, setLoadingSignUp] = useState<boolean>(false);

	const [firstName, setFirstName] = useState<string>("");
	const [lastName, setLastName] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");

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
			const response = await createUserWithEmailPassAndNames(
				firstName,
				lastName,
				email.toLocaleLowerCase(),
				password
			);
			if (response) {
				const { success } = response;
				if (!success) {
					const { message } = response;

					setLoadingSignUp(false);
					console.error(message);
					return Alert.alert(message!);
				}

				const { data: newUserState } = response;
				dispatch(setUser(newUserState!));
				setLoadingSignUp(false);
				const socket = connectToSocket(newUserState!._id!);
				setConnectionState(socket);
				storage.save({
					key: "themeTitle",
					id: uuid.v4().toString(),
					data: "default",
				});
			} else {
				throw new Error("Error during receiving response");
			}
		} catch (e: any) {
			console.error("Error during signing up: ", e.message);
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
								color: theme.colors.contrast[300],
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
