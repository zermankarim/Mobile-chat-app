import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

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
}

export interface IUploadImageData {
  success: boolean;
  message?: string;
  data?: IUserState;
  relativePath?: string;
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
  Chat: undefined;
  Chats: undefined;
  Login: undefined;
  SignUp: undefined;
  Profile: { owner: IUserState };
  CreateChat: undefined;
  ChatSettings: undefined;
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

export type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Login"
>;
export type ChatScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Chat"
>;
export type SignUpScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "SignUp"
>;
export type ChatsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Chats"
>;

export type CreateChatScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "CreateChat"
>;

export type ChatSettingsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ChatSettings"
>;

export type LoginRouteProps = {
  navigation: LoginScreenNavigationProp;
};

export type ChatsRouteProps = {
  navigation: ChatsScreenNavigationProp;
};

export type CreateChatRouteProps = {
  navigation: ChatsScreenNavigationProp;
};

export type ChatRouteProps = {
  navigation: ChatScreenNavigationProp;
};

export type ProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Profile"
>;

type ProfileRouteProp = RouteProp<RootStackParamList, "Profile">;

export type ProfileRouteProps = {
  route: ProfileRouteProp;
  navigation: ProfileScreenNavigationProp;
};
