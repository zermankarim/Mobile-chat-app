import { Document, ObjectId, PopulatedDoc, Types } from "mongoose";

export type getDocQueries = {
  collectionName: "users" | "chats";
  condition: {
    field: string;
    conditionType: "==" | "array-contains";
    value: "string" | Array<string>;
  };
  populateArr?: string[];
};

export interface IUserBeforeSignUp {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  avatars: string[];
  friends: string[];
  backgroundColors: string[];
  password: string;
}

export interface IUser {
  _id: Types.ObjectId | string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  avatars: string[];
  friends: IUser[] | Types.ObjectId[];
  backgroundColors: string[];
  password?: string;
}

export interface IMessage {
  createdAt: string;
  text?: string;
  sender: Types.ObjectId;
}

export interface IChat {
  _id: Types.ObjectId;
  createdAt: string;
  createdBy: Types.ObjectId;
  messages: IMessage[];
  participants: Types.ObjectId[];
}

// Socket.IO interfaces

// Socket.IO server to client Interface
export interface ISocketEmitEvent {
  getChatsByUserId: (data: {
    success: boolean;
    message?: string;
    chatsData?: IChat[];
  }) => void;
  getChatById: (data: {
    success: boolean;
    message?: string;
    chatData?: IChat;
  }) => void;
  getUsersForCreateChat: (data: {
    success: boolean;
    message?: string;
    usersData?: IUser[];
  }) => void;
  openChatWithUser: (data: {
    success: boolean;
    message?: string;
    chat?: IChat;
  }) => void;
}

// Socket.IO client to server Interface
export interface ISocketOnEvent {
  getChatsByUserId: (userId: string) => void;
  getChatById: (chatId: string) => void;
  sendMessage: (
    chatId: string,
    newMessage: IMessage,
    participantsIds: string[]
  ) => void;
  getUsersForCreateChat: (userId: string) => void;
  openChatWithUser: (userId: string, userForChatId: string) => void;
}

export interface IConnectedUser {
  userId: string;
  socketId: string;
}
