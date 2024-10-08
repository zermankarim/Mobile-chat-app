import axios from "axios";
import { SERVER_PORT_MAIN, SERVER_URL_MAIN } from "../config";
import {
	IGetDocData,
	IAuthData,
	IGetDocsData,
	IUploadImageData,
	ScreenNavigationProp,
} from "../shared/types";
import { blobToBase64 } from "../shared/functions";
import { Alert } from "react-native";
import { logoutUser } from "../core/reducers/user";
import { Dispatch } from "redux";
import { storageMMKV } from "../core/storage/storageMMKV";

export const getDoc = async (
	collectionName: "users" | "chats",
	condition: {
		field: string;
		conditionType: "==";
		value: string | Array<string>;
	}
): Promise<IGetDocData> => {
	try {
		const { data } = await axios.get(
			`${SERVER_URL_MAIN}:${SERVER_PORT_MAIN}/getData/getDoc`,
			{ params: { collectionName, condition } }
		);
		return data;
	} catch (e: any) {
		throw new Error(`Error at getDoc: ${e.message}`);
	}
};

export const getDocs = async (
	collectionName: "users" | "chats",
	condition: {
		field: string;
		conditionType: "==";
		value: string | Array<string>;
	},
	populateArr?: string[]
): Promise<IGetDocsData> => {
	try {
		const { data } = await axios.get(
			`${SERVER_URL_MAIN}:${SERVER_PORT_MAIN}/getData/getDocs`,
			{ params: { collectionName, condition, populateArr } }
		);
		return data;
	} catch (e: any) {
		throw new Error(`Error at getDocs: ${e.message}`);
	}
};

export const signInWithEmailAndPassword = async (
	email: string,
	password: string
): Promise<IAuthData> => {
	try {
		const { data } = await axios.post(
			`${SERVER_URL_MAIN}:${SERVER_PORT_MAIN}/auth/signInWithEmailAndPassword`,
			{ email, password }
		);
		return data;
	} catch (e: any) {
		throw new Error(e.message);
	}
};

export const createUserWithEmailPassAndNames = async (
	firstName: string,
	lastName: string,
	email: string,
	password: string
): Promise<IAuthData> => {
	try {
		const userData = { firstName, lastName, email, password };
		const { data } = await axios.post(
			`${SERVER_URL_MAIN}:${SERVER_PORT_MAIN}/auth/createUserWithEmailPassAndNames`,
			userData
		);
		return data;
	} catch (e: any) {
		throw new Error(e.message);
	}
};

export const uploadNewImage = async (
	blob: Blob,
	params: { userId?: string; chatId?: string; type: "avatar" | "message" }
): Promise<IUploadImageData> => {
	try {
		const { userId, chatId, type } = params;
		const base64Image = await blobToBase64(blob);
		const reqData: any = { image: base64Image, type };

		if (type === "avatar") {
			reqData.userId = userId;
		}

		if (type === "message") {
			reqData.chatId = chatId;
		}

		const { data } = await axios.post(
			`${SERVER_URL_MAIN}:${SERVER_PORT_MAIN}/upload/newAvatar`,
			JSON.stringify(reqData),
			{
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
		return data;
	} catch (e: any) {
		console.error(`Error during sending image: ${e.message}`);
		throw new Error(`Error during sending image: ${e.message}`);
	}
};

export const verifyJWTToken = async (token: string): Promise<boolean> => {
	try {
		const { data } = await axios.post(
			`${SERVER_URL_MAIN}:${SERVER_PORT_MAIN}/auth/verifyJWTToken`,
			{ token }
		);
		const { success, verifyed } = data;
		return success && verifyed;
	} catch (e: any) {
		console.error(`verifyJWTTokenError: ${e.message}`);
		return false;
	}
};

export const logoutUserIfTokenHasProblems = async (
	dispatch: Dispatch,
	navigation:
		| ScreenNavigationProp<"Login">
		| ScreenNavigationProp<"CreateChat">
		| ScreenNavigationProp<"Chats">
		| ScreenNavigationProp<"CreateChat">
		| ScreenNavigationProp<"Chat">
		| ScreenNavigationProp<"SignUp">
		| ScreenNavigationProp<"WallpaperGradient">
		| ScreenNavigationProp<"Profile">
		| ScreenNavigationProp<"ChangeWallpaper">
		| ScreenNavigationProp<"ChatSettings">
) => {
	const tokenDataFromStor: string | undefined = storageMMKV.getString(
		"token"
	) as string | undefined;
	if (!tokenDataFromStor) {
		Alert.alert("Token didn't found, please log in again.");
		dispatch(logoutUser());
		navigation.navigate("Login");
		return;
	}
	const isVerifyToken = await verifyJWTToken(tokenDataFromStor);
	if (!isVerifyToken) {
		Alert.alert("Token expired, please log in again.");
		storageMMKV.delete("token");
		dispatch(logoutUser());
		navigation.navigate("Login");
		return;
	}
};
