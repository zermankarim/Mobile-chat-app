import {
	ActivityIndicator,
	Alert,
	NativeSyntheticEvent,
	TextInputChangeEventData,
	View,
} from "react-native";
import { FC, useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../core/reducers/user";
import { LoginRouteProps, ThemeType } from "../shared/types";
import TextWithFont from "../shared/components/TextWithFont";
import { Button, TextInput } from "react-native-paper";
import { signInWithEmailAndPassword } from "../fetches/http";
import { useGlobalContext } from "../core/context/Context";
import { connectToSocket } from "../shared/functions";
import { createTheme } from "../shared/theme";
import storage from "../core/storage/storage";
import { uuid } from "expo-modules-core";

const Login: FC<LoginRouteProps> = ({ navigation }) => {
	// Global context
	const { setConnectionState, setAppTheme } = useGlobalContext();
	const theme = createTheme("default");

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
			const response = await signInWithEmailAndPassword(
				email.toLocaleLowerCase(),
				password
			);
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
				setLoadingLogin(false);
				setIsDisabledButton(false);
				const socket = connectToSocket(userData!._id!);
				setConnectionState(socket);
				const themeTitlesArr: ThemeType[] = await storage.getAllDataForKey(
					"themeTitle"
				);
				if (!themeTitlesArr.length) {
					setAppTheme("default");
					return storage.save({
						key: "themeTitle",
						id: uuid.v4().toString(),
						data: "default",
					});
				}
				setAppTheme(themeTitlesArr[0]);
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
								color: theme.colors.contrast[300],
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
			</View>
		</View>
	);
};

export default Login;
