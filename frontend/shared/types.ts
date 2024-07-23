import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Socket } from "socket.io-client";

export interface IUserState {
  _id: string | null;
  firstName: string | null;
  lastName: string | null;
  dateOfBirth: string | null;
  email: string | null;
  avatars: string[];
  friends: string[];
  backgroundColors: string[];
}

export interface ILoginInputsState {
  login: string | null;
  password: string | null;
}

export interface IChatClient {
  _id: string;
  createdAt: string;
  createdBy: string;
  messages: IMessage[];
  participants: IUserState[];
}

export interface IChatDB {
  id: string;
  createdAt: string;
  createdBy: string;
  messages: IMessage[];
  participants: string[];
}

export interface IMessage {
  createdAt: string;
  text: string;
  sender: string;
}

export interface IButtonDrawer {
  title: string;
  icon: React.ReactNode | null;
  onPress: () => void;
}

export interface IGetDocData {
  success: boolean;
  message?: string;
  data?: IUserState | IChatClient;
}

export interface IGetDocsData {
  success: boolean;
  message?: string;
  data?: IUserState[] | IChatClient[];
}

export interface IAuthData {
  success: boolean;
  message?: string;
  data?: IUserState;
}

// Socket.IO client to server Interface
export interface ISocketEmitEvent {
  getChatsByUserId: (userId: string) => void;
}

// Socket.IO server to client Interface
export interface ISocketOnEvent {
  getChatsByUserId: (chatsData: IChatClient[]) => void;
}

// Routers props
export type RootStackParamList = {
  Chat: undefined;
  Chats: undefined;
  Login: undefined;
  SignUp: undefined;
  Profile: { owner: IUserState };
  CreateChat: undefined;
};

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

export type LoginRouteProps = {
  navigation: LoginScreenNavigationProp;
};

export type ChatsRouteProps = {
  navigation: ChatsScreenNavigationProp;
};

export type CreateChatRouteProps = {
  navigation: ChatsScreenNavigationProp;
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
