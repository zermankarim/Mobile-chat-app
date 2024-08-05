import { createContext, Dispatch, SetStateAction, useContext } from "react";
import { Socket } from "socket.io-client";
import {
	IBase64Wallpaper,
	IMessagePopulated,
	ISocketEmitEvent,
	ISocketOnEvent,
	IUserState,
	IWallpaperGradient,
	ThemeType,
} from "../../shared/types";
export type GlobalStates = {
	loading: boolean;
	setLoading: (newState: boolean) => void;
	chatsLoading: boolean;
	setChatsLoading: (newState: boolean) => void;
	chatLoading: boolean;
	setChatLoading: (newState: boolean) => void;
	createChatLoading: boolean;
	setCreateChatLoading: (newState: boolean) => void;

	forwardMessages: IMessagePopulated[] | null;
	setForwardMessages: (newState: IMessagePopulated[] | null) => void;
	selectedMessages: IMessagePopulated[];
	setSelectedMessages: (newState: IMessagePopulated[]) => void;
	replyMessage: IMessagePopulated | null;
	setReplyMessage: (newState: IMessagePopulated | null) => void;

	connectionState: Socket<ISocketOnEvent, ISocketEmitEvent> | null;
	setConnectionState: Dispatch<
		SetStateAction<Socket<ISocketOnEvent, ISocketEmitEvent> | null>
	>;
	usersForChat: IUserState[];
	setUsersForChat: (newState: IUserState[]) => void;

	appTheme: ThemeType;
	setAppTheme: (newState: ThemeType) => void;
	wallpaperPicture: IBase64Wallpaper | null;
	setWallpaperPicture: (newState: IBase64Wallpaper | null) => void;
	wallpaperGradient: IWallpaperGradient | null;
	setWallpaperGradient: (newState: IWallpaperGradient | null) => void;
};
export const GlobalContext = createContext<GlobalStates>({
	loading: false,
	setLoading: () => {},
	chatsLoading: false,
	setChatsLoading: () => {},
	chatLoading: false,
	setChatLoading: () => {},
	createChatLoading: false,
	setCreateChatLoading: () => {},

	connectionState: null,
	setConnectionState: () => {},
	usersForChat: [],
	setUsersForChat: () => {},

	forwardMessages: null,
	setForwardMessages: () => {},
	selectedMessages: [],
	setSelectedMessages: () => {},
	replyMessage: null,
	setReplyMessage: () => {},

	appTheme: "default",
	setAppTheme: () => {},
	wallpaperPicture: null,
	setWallpaperPicture: () => {},
	wallpaperGradient: null,
	setWallpaperGradient: () => {},
});
export const useGlobalContext = () => useContext(GlobalContext);
