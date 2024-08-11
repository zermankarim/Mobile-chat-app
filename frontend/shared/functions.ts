import { format, isThisWeek, isToday, parseISO } from "date-fns";
import { Socket, io as socketIO } from "socket.io-client";
import { SERVER_PORT_SOCKET, SERVER_URL_SOCKET } from "../config";
import {
	IBase64Wallpaper,
	ISocketEmitEvent,
	ISocketOnEvent,
	IWallpaperGradient,
} from "./types";
import { RefObject } from "react";
import { Platform, ScrollView } from "react-native";
import {
	DocumentDirectoryPath,
	exists,
	mkdir,
	readDir,
	writeFile,
} from "react-native-fs";

export const connectToSocket = (userId: string) => {
	const URL = `${SERVER_URL_SOCKET}:${SERVER_PORT_SOCKET}/?userId=${userId}`;
	const socket: Socket<ISocketEmitEvent, ISocketOnEvent> = socketIO(URL, {
		query: { userId },
	});
	return socket;
};

export const formatMessageDate = (isoString: string): string => {
	const date = parseISO(isoString);

	if (isToday(date)) {
		return format(date, "HH:mm");
	} else if (isThisWeek(date)) {
		return format(date, "EEE");
	} else {
		return format(date, "dd MMM");
	}
};

export const where = (
	field: string,
	conditionType: "==",
	value: string | Array<string>
) => {
	return { field, conditionType, value };
};

export const populate = (fields: string[]) => {
	return fields;
};

export const scrollToBottom = (scrollViewRef: RefObject<ScrollView>) => {
	if (scrollViewRef.current) {
		scrollViewRef.current.scrollToEnd({ animated: true });
	}
};

export const blobToBase64 = (blob: Blob): Promise<string> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onloadend = () => resolve(reader.result as string);
		reader.onerror = reject;
		reader.readAsDataURL(blob);
	});
};

export const getRandomColor = () => {
	const letters = "0123456789ABCDEF";
	let color = "#";
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
};

export const createWallpaperDirIfNeed = async () => {
	try {
		const wallpapersDirPath = DocumentDirectoryPath + "/wallpapers";
		const wallpaperDirIsExist = await exists(wallpapersDirPath);

		if (!wallpaperDirIsExist) {
			await mkdir(wallpapersDirPath);
		}
	} catch (e: any) {
		console.error(`Error in func: ${e.message}`);
	}
};

export const uploadWallpaperImageToDir = async (
	base64Image: string,
	pathForSaving: string
) => {
	const base64ImageWithoutPref = base64Image.replace(/^data:image\/jpeg;base64,/, '');
	await writeFile(pathForSaving, base64ImageWithoutPref, "base64");
};
