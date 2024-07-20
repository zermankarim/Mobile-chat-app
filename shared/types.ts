import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

export interface IUserState {
  uid: string | null;
  firstName: string | null;
  lastName: string | null;
  dateOfBirth: string | null;
  email: string | null;
  avatars: string[];
  friends: string[];
}

export interface ILoginInputsState {
  login: string | null;
  password: string | null;
}

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

export interface IChatClient {
  id: string;
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
