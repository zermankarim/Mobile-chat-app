import {
	Alert,
	Dimensions,
	Image,
	NativeScrollEvent,
	Platform,
	TouchableOpacity,
	View,
} from "react-native";
import { FC, useCallback, useState } from "react";
import TextWithFont from "../shared/components/TextWithFont";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../core/store/store";
import { ActivityIndicator } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";
import { IUserState, ProfileRouteProps } from "../shared/types";
import * as ImagePicker from "expo-image-picker";
import uuid from "react-native-uuid";
import { setUser } from "../core/reducers/user";
import { LinearGradient } from "expo-linear-gradient";
import { logoutUserIfTokenHasProblems, uploadNewImage } from "../fetches/http";
import { SERVER_PORT_MAIN, SERVER_URL_MAIN } from "../config";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { createTheme } from "../shared/theme";
import { useGlobalContext } from "../core/context/Context";

const Profile: FC<ProfileRouteProps> = ({ route, navigation }) => {
	// Global context
	const { appTheme } = useGlobalContext();
	const theme = createTheme(appTheme);

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

	const windowWidth = Dimensions.get("window").width;

	// Functions
	const uploadImage = async (uri: string) => {
		setAvatarUploading(true);
		try {
			const response = await fetch(uri);
			const blob: Blob = await response.blob();

			const data = await uploadNewImage(blob, {
				type: "avatar",
				userId: user._id!,
			});
			const { success } = data;
			if (!success) {
				const { message } = data;
				console.error(message);
				setAvatarUploading(false);
				return;
			}
			const { data: userData } = data;
			dispatch(setUser(userData!));
			setOwnerState(userData!);
			setActiveImage(userData?.avatars.length! - 1);
			setAvatarUploading(false);
		} catch (e: any) {
			console.error("Error during updating image: ", e.message);
			setAvatarUploading(false);
		}
	};
	const handleImagePicker = async () => {
		// If user doesn't get permission for camera and gallery
		if (Platform.OS !== "web") {
			const { status } =
				await ImagePicker.requestMediaLibraryPermissionsAsync();
			if (status !== "granted") {
				Alert.alert(
					"Sorry, we need camera roll permissions to make this work!"
				);
				return;
			}
		}

		// else
		try {
			let result = await ImagePicker.launchImageLibraryAsync({
				allowsEditing: true,
				quality: 1,
				aspect: [1, 1],
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
	useFocusEffect(
		useCallback(() => {
			setOwnerState(owner);
			setActiveImage(owner.avatars.length - 1);
		}, [owner])
	);

	useFocusEffect(
		useCallback(() => {
			logoutUserIfTokenHasProblems(dispatch, navigation);
		}, [owner, ownerState, activeImage])
	);

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
							top: 10,
							flexDirection: "row",
							alignSelf: "center",
							zIndex: 1,
							width: "100%",
						}}
					>
						{ownerState.avatars.length > 1 &&
							ownerState.avatars
								.map((avatar, index) => {
									return (
										<View
											key={index + "avatarsDots"}
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
								.map((avatarRelativePath, index) => (
									<Image
										key={avatarRelativePath + "-userAvatar"}
										source={{
											uri: `${SERVER_URL_MAIN}:${SERVER_PORT_MAIN}/${avatarRelativePath}`,
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
						<LinearGradient
							colors={ownerState.backgroundColors}
							style={{
								justifyContent: "center",
								alignItems: "center",
								height: "100%",
							}}
						>
							<TextWithFont
								styleProps={{
									fontSize: theme.fontSize(20),
								}}
							>
								{ownerState?.firstName![0] + ownerState?.lastName![0]}
							</TextWithFont>
						</LinearGradient>
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
					{owner._id === user._id && (
						<TouchableOpacity
							onPress={handleImagePicker}
							style={{
								position: "absolute",
								bottom: theme.spacing(-6),
								right: theme.spacing(4),
								backgroundColor: theme.colors.contrast[400],
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
			<View // Outer container for user info and settings
				style={{
					width: "100%",
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
			{owner._id === user._id && (
				<View // Container for settings
					style={{
						flexDirection: "column",
						marginTop: theme.spacing(4),
						width: "100%",
						paddingHorizontal: theme.spacing(4),
						paddingVertical: theme.spacing(2),
						backgroundColor: theme.colors.main[400],
					}}
				>
					<TextWithFont
						styleProps={{
							color: theme.colors.contrast[300],
						}}
					>
						Settings
					</TextWithFont>
					<TouchableOpacity
						onPress={() => navigation.navigate("ChatSettings")}
						style={{
							flexDirection: "row",
							gap: theme.spacing(3),
							paddingVertical: theme.spacing(3),
							borderBottomColor: theme.colors.main[500],
							borderBottomWidth: 0.5,
						}}
					>
						<Ionicons
							name="chatbubble-outline"
							size={24}
							color={theme.colors.main[200]}
						/>
						<TextWithFont>Chat settings</TextWithFont>
					</TouchableOpacity>
				</View>
			)}
		</ScrollView>
	);
};

export default Profile;
