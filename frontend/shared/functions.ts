import { format, isThisWeek, isToday, parseISO } from "date-fns";
import { Socket, io as socketIO } from "socket.io-client";
import { SERVER_PORT_SOCKET, SERVER_URL_SOCKET } from "../config";
import {
	IBase64Wallpaper,
	ISocketEmitEvent,
	ISocketOnEvent,
	IWallpaperGradient,
} from "./types";
import { Ref, RefObject } from "react";
import { ScrollView } from "react-native";
import storage from "../core/storage/storage";
import { useGlobalContext } from "../core/context/Context";

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

export const getWallpapersGradientsAndSetState = async (
	setWallpaperGradient: (newState: IWallpaperGradient | null) => void,
	setWallpapersGradientsPreview?: (newState: IWallpaperGradient[]) => void
) => {
	const wallpapersGradients: IWallpaperGradient[] =
		await storage.getAllDataForKey("wallpaperGradient");
	if (wallpapersGradients.length) {
		const foundSelectedWallpaperGradient = wallpapersGradients.find(
			(wlpGrd) => wlpGrd.selected === true
		);
		if (foundSelectedWallpaperGradient) {
			setWallpaperGradient(foundSelectedWallpaperGradient);
			setWallpapersGradientsPreview
				? setWallpapersGradientsPreview([...wallpapersGradients])
				: null;
		}
	} else {
		setWallpaperGradient(null);
		setWallpapersGradientsPreview && setWallpapersGradientsPreview([]);
	}
};

export const getWallpapersPicturesAndSetState = async (
	setWallpaperPicture: (newState: IBase64Wallpaper | null) => void,
	setWallpapersPreview?: (newState: IBase64Wallpaper[]) => void
) => {
	const base64Wallpapers: IBase64Wallpaper[] = await storage.getAllDataForKey(
		"base64Wallpapers"
	);
	if (base64Wallpapers.length) {
		const foundSelectedWallpaper = base64Wallpapers.find(
			(wallpaper) => wallpaper.selected === true
		);
		if (foundSelectedWallpaper) {
			setWallpaperPicture(foundSelectedWallpaper);
			setWallpapersPreview && setWallpapersPreview(base64Wallpapers);
		} else {
			setWallpaperPicture(null);
			setWallpapersPreview && setWallpapersPreview([]);
		}
	} else {
		setWallpaperPicture(null);
		setWallpapersPreview && setWallpapersPreview([]);
	}
};
