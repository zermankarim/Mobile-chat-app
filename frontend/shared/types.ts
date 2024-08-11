import { DrawerNavigationProp } from "@react-navigation/drawer";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { MD2DarkTheme } from "react-native-paper";

export interface ILoginInputsState {
	login: string | null;
	password: string | null;
}

export interface IUserState {
	_id: string | null;
	firstName: string | null;
	lastName: string | null;
	dateOfBirth: string | null;
	email: string | null;
	avatars: string[];
	friends: IUserState[] | string[];
	backgroundColors: string[];
}

export interface IMessage {
	_id: string;
	createdAt: string;
	text?: string;
	image?: string;
	sender: string;
	replyMessage?: IMessage;
	type: "default" | "forward";
	forwarder?: string;
}

export interface IMessagePopulated {
	_id: string;
	createdAt: string;
	text?: string;
	image?: string;
	sender: IUserState;
	replyMessage?: IMessagePopulated;
	type: "default" | "forward";
	forwarder?: IUserState;
}

export interface IChatPopulated {
	_id: string;
	createdAt: string;
	createdBy: IUserState;
	messages: IMessagePopulated[];
	participants: IUserState[];
}

export interface IButtonDrawer {
	title: string;
	icon: React.ReactNode | null;
	onPress: () => void;
}

export interface IGetDocData {
	success: boolean;
	message?: string;
	data?: IUserState | IChatPopulated;
}

export interface IGetDocsData {
	success: boolean;
	message?: string;
	data?: IUserState[] | IChatPopulated[];
}

export interface IAuthData {
	success: boolean;
	message?: string;
	data?: IUserState;
	token?: string;
}

export interface IUploadImageData {
	success: boolean;
	message?: string;
	data?: IUserState;
	relativePath?: string;
}

export interface IBase64WallpaperWithoutImg {
	id: string;
	selected: boolean;
	type: "base64Wallpaper";
}

export interface IBase64Wallpaper {
	id: string;
	uri: string;
	selected: boolean;
	type: "base64Wallpaper";
}

export interface IWallpaperGradient {
	id: string;
	colors: string[];
	withImage: boolean;
	imageColor: string;
	selected: boolean;
	type: "wallpaperGradient";
}

export interface CustomTheme {
	myOwnProperty: boolean;
	colors: {
		main: {
			100: string;
			200: string;
			300: string;
			400: string;
			500: string;
		};
		contrast: {
			100: string;
			200: string;
			300: string;
			400: string;
			500: string;
		};
	};
	spacing: (space: number) => number;
	fontFamily: string;
	fontSize: (fSize: number) => number;
	borderRadius: (bRadius: number) => number;
}

// Socket.IO client to server Interface
export interface ISocketEmitEvent {
	getChatsByUserId: (userId: string, searchReq?: string) => void;
	getChatById: (chatId: string) => void;
	sendMessage: (
		chatId: string,
		newMessages: IMessage[],
		participantsIds: string[]
	) => void;
	getUsersByCondition: (field: string, condition: string | string[]) => void;
	getUsersForCreateChat: (userId: string, searchReq?: string) => void;
	openChatWithUser: (userId: string, userForChatId: string) => void;
	deleteMessages: (
		chatId: string,
		messagesForDeleting: IMessagePopulated[],
		participantsIds: string[]
	) => void;
	getUserById: (userId: string) => void;
}

// Socket.IO server to client Interface
export interface ISocketOnEvent {
	getChatsByUserId: (data: {
		success: boolean;
		message?: string;
		chatsData?: IChatPopulated[];
	}) => void;
	getChatById: (data: {
		success: boolean;
		message?: string;
		chatData?: IChatPopulated;
	}) => void;
	sendMessage: (data: {
		success: boolean;
		message?: string;
		updatedChat?: IChatPopulated;
	}) => void;
	getUsersByCondition: (data: {
		success: boolean;
		message?: string;
		usersData?: IUserState[];
	}) => void;
	getUsersForCreateChat: (data: {
		success: boolean;
		message?: string;
		usersData?: IUserState[];
	}) => void;
	openChatWithUser: (data: {
		success: boolean;
		message?: string;
		chat?: IChatPopulated;
	}) => void;
	getUserById: (data: {
		success: boolean;
		message?: string;
		usersData?: IUserState;
	}) => void;
}

// Routes props
export type RootStackParamList = {
	Chat: undefined | { chat: IChatPopulated };
	Chats: undefined;
	Login: undefined;
	SignUp: undefined;
	Profile: { owner: IUserState };
	CreateChat: undefined;
	ChatSettings: undefined;
	ChangeWallpaper: undefined;
	WallpaperGradient: undefined;
};

export type ThemeType =
	| "default"
	| "green"
	| "purple"
	| "yellow"
	| "light"
	| "darkBlue"
	| "black";
export interface ThemeColors {
	main: {
		100: string;
		200: string;
		300: string;
		400: string;
		500: string;
	};
	contrast: {
		100: string;
		200: string;
		300: string;
		400: string;
		500: string;
	};
}

export type ScreenNavigationProp<T extends keyof RootStackParamList> =
	DrawerNavigationProp<RootStackParamList, T>;

export type LoginRouteProps = {
	navigation: ScreenNavigationProp<"Login">;
};

export type ChatsRouteProps = {
	navigation: ScreenNavigationProp<"Chats">;
};

export type CreateChatRouteProps = {
	navigation: ScreenNavigationProp<"CreateChat">;
};

export type ChatSettingsRouteProps = {
	navigation: ScreenNavigationProp<"ChatSettings">;
};

export type ChangeWallpaperRouteProps = {
	navigation: ScreenNavigationProp<"ChangeWallpaper">;
};

export type WallpaperGradientRouteProps = {
	navigation: ScreenNavigationProp<"WallpaperGradient">;
};

type ProfileRouteProp = RouteProp<RootStackParamList, "Profile">;

export type ProfileRouteProps = {
	route: ProfileRouteProp;
	navigation: ScreenNavigationProp<"Profile">;
};

type ChatRouteProp = RouteProp<RootStackParamList, "Chat">;

export type ChatRouteProps = {
	navigation: ScreenNavigationProp<"Chat">;
	route: ChatRouteProp;
};
