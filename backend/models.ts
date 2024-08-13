import mongoose, { Schema } from "mongoose";
import { IChat, IUser } from "./types";

const userSchema = new Schema<IUser>({
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	dateOfBirth: { type: String },
	email: { type: String, required: true },
	avatars: { type: [String], required: true },
	friends: { type: [String], required: true },
	backgroundColors: { type: [String], required: true },
	password: { type: String, required: true },
});

const chatSchema = new Schema<IChat>({
	createdAt: { type: String, required: true },
	createdBy: { type: Schema.Types.ObjectId, ref: "users", required: true },
	messages: [
		{
			_id: { type: String, required: true },
			createdAt: { type: String, required: true },
			text: { type: String },
			image: { type: String },
			sender: { type: Schema.Types.ObjectId, ref: "users", required: true },
			type: { type: String, required: true },
			forwarder: { type: Schema.Types.ObjectId, ref: "users", required: false },
			replyMessage: {
				type: String,
				ref: "chats",
				required: false,
			},
		},
	],
	participants: [{ type: Schema.Types.ObjectId, ref: "users", required: true }],
});

export const User = mongoose.model<IUser>("users", userSchema);
export const Chat = mongoose.model<IChat>("chats", chatSchema);

module.exports = { User, Chat };
