import mongoose, { Schema } from "mongoose";

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
  _id: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  avatars: string[];
  friends: IUser[];
  backgroundColors: string[];
  password?: string;
}

export interface IMessage {
  createdAt: string;
  text: string;
  sender: IUser;
}

export interface IChatClient {
  _id: string;
  createdAt: string;
  createdBy: string;
  messages: IMessage[];
  participants: IUser[];
}

// Socket.IO client to server Interface
export interface ISocketEmitEvent {
  getChatsByUserId: (userId: string) => void;
}

// Socket.IO server to client Interface
export interface ISocketOnEvent {
  getChatsByUserId: (chatsData: IChatClient[]) => void;
}
