import { createContext, Dispatch, SetStateAction, useContext } from "react";
import { Socket } from "socket.io-client";
import {
	IBase64Wallpaper,
	IMessage,
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

	forwardMessages: IMessage[] | null;
	setForwardMessages: (newState: IMessage[] | null) => void;
	selectedMessages: string[];
	setSelectedMessages: (newState: string[]) => void;
	replyMessageId: string | null;
	setReplyMessageId: (newState: string | null) => void;

	connectionState: Socket<ISocketOnEvent, ISocketEmitEvent> | null;
	setConnectionState: Dispatch<
		SetStateAction<Socket<ISocketOnEvent, ISocketEmitEvent> | null>
	>;
	usersForChat: IUserState[];
	setUsersForChat: (newState: IUserState[]) => void;

	appTheme: ThemeType;
	setAppTheme: (newState: ThemeType) => void;
	wallpaper: IBase64Wallpaper | IWallpaperGradient | null;
	setWallpaper: (
		newState: IBase64Wallpaper | IWallpaperGradient | null
	) => void;
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
	replyMessageId: null,
	setReplyMessageId: () => {},

	appTheme: "default",
	setAppTheme: () => {},
	wallpaper: null,
	setWallpaper: () => {},
});
export const useGlobalContext = () => useContext(GlobalContext);
