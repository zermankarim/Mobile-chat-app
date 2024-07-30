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
  _id: string;
  createdAt: string;
  text?: string;
  image?: string;
  sender: Types.ObjectId;
  replyMessage?: IMessage;
  type: "default" | "forward";
  forwarder?: string;
}

export interface IChat {
  _id: Types.ObjectId;
  createdAt: string;
  createdBy: Types.ObjectId;
  messages: IMessage[];
  participants: Types.ObjectId[];
}

export interface IMessagePopulated {
  _id: string;
  createdAt: string;
  text?: string;
  sender: IUser;
  replyMessage?: IMessagePopulated;
  type: "default" | "forward";
  forwarder?: IUser;
}

export interface IChatPopulatedAll {
  _id: Types.ObjectId;
  createdAt: string;
  createdBy: IUser;
  messages: IMessagePopulated[];
  participants: IUser[];
}

// Socket.IO interfaces

// Socket.IO server to client Interface
export interface ISocketEmitEvent {
  getChatsByUserId: (data: {
    success: boolean;
    message?: string;
    chatsData?: IChat[] | IChatPopulatedAll[];
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
  getChatsByUserId: (userId: string, searchReq?: string) => void;
  getChatById: (chatId: string) => void;
  sendMessage: (
    chatId: string,
    newMessages: IMessage[],
    participantsIds: string[]
  ) => void;
  getUsersForCreateChat: (userId: string, searchReq?: string) => void;
  openChatWithUser: (userId: string, userForChatId: string) => void;
  deleteMessages: (
    chatId: string,
    messagesForDeleting: IMessage[],
    participantsIds: string[]
  ) => void;
}

export interface IConnectedUser {
  userId: string;
  socketId: string;
}
