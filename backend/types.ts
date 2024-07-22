import { Schema } from "mongoose";

export type getDocQueries = {
  collectionName: "users" | "chats";
  condition: {
    field: string;
    conditionType: "==" | "array-contains";
    value: "string" | Array<string>;
  };
};

export interface IUserSchema {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  avatars: string[];
  friends: Schema.Types.ObjectId[] | IUserSchema[];
  backgroundColors: string[];
}

export interface IChatSchema {
  createdAt: string;
  createdBy: Schema.Types.ObjectId | IUserSchema;
  messages: [
    {
      createdAt: string;
      text: string;
      sender: Schema.Types.ObjectId | IUserSchema;
    }
  ];
  participants: Schema.Types.ObjectId[] | IUserSchema[];
}
