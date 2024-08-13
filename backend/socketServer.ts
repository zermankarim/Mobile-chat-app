import { createServer } from "http";
import { Server } from "socket.io";
import {
	IChat,
	IChatPopulatedAll,
	IConnectedUser,
	IMessage,
	ISocketEmitEvent,
	ISocketOnEvent,
	IUser,
} from "./types";
import { User, Chat } from "./models";
import mongoose from "mongoose";

require("dotenv").config();

const httpServer = createServer();

const { SOCKET_SERVER_PORT } = process.env;

const io = new Server<ISocketOnEvent, ISocketEmitEvent>(httpServer, {
	// options
});

const CONNECTED_USERS: IConnectedUser[] = [];

io.on("connection", (socket) => {
	const userId = socket.handshake.query.userId as string;

	const foundConnUserIdx = CONNECTED_USERS.findIndex(
		(connUser) => connUser.userId === userId
	);

	if (foundConnUserIdx === -1) {
		CONNECTED_USERS.push({
			socketId: socket.id,
			userId,
		});
	} else {
		CONNECTED_USERS[foundConnUserIdx].socketId = socket.id;
	}
	console.log(`Connected: ${socket.id}`);

	// Request receiving chats by user ID
	socket.on("getChatsByUserId", async (userId, searchReq) => {
		if (!mongoose.isValidObjectId(userId)) {
			socket.emit("getChatsByUserId", {
				success: false,
				message: "getChatsByUserId: User ID is not valid.",
			});
		}
		let chatsData = await Chat.find({
			participants: userId,
		})
			.populate<Pick<IChatPopulatedAll, "participants">>("participants")
			.populate<Pick<IChatPopulatedAll, "createdBy">>("createdBy")
			// .populate<{ child: IUser }>("messages.forwarder");

		if (!searchReq) {
			socket.emit("getChatsByUserId", { success: true, chatsData });
		}
		// else {
		// 	const filteredChatsData = chatsData.filter((chat) =>
		// 		chat.participants.some(
		// 			(participant) =>
		// 				participant.firstName.toLocaleLowerCase().includes(searchReq) ||
		// 				participant.lastName.toLocaleLowerCase().includes(searchReq) ||
		// 				participant.email.toLocaleLowerCase().includes(searchReq)
		// 		)
		// 	);
		// 	socket.emit("getChatsByUserId", {
		// 		success: true,
		// 		chatsData: filteredChatsData,
		// 	});
		// }
	});

	// Request receiving chat by ID
	socket.on("getChatById", async (chatId) => {
		if (!mongoose.isValidObjectId(chatId)) {
			socket.emit("getChatById", {
				success: false,
				message: "getChatById: This chat ID is not valid.",
			});
		}
		const chatData: IChat = await Chat.findOne({
			_id: chatId,
		})
			.populate<{ child: IUser }>("participants")
			.populate<{ child: IUser }>("createdBy")
			.populate<{ child: IUser }>("messages.forwarder");

		socket.emit("getChatById", { success: true, chatData });
	});

	// New message
	socket.on("sendMessage", async (chatId, newMessages, participantsIds) => {
		try {
			const updNewMessages: IMessage[] = newMessages.map((newMsg) => ({
				...newMsg,
				status: "sent",
			}));

			const foundAndUpdatedChat = await Chat.findOneAndUpdate(
				{ _id: chatId },
				{
					$push: { messages: { $each: updNewMessages } },
				},
				{
					returnOriginal: false,
				}
			)
				.populate<{ child: IUser }>("participants")
				.populate<{ child: IUser }>("createdBy")

			if (!foundAndUpdatedChat) {
				socket.emit("getChatById", {
					success: false,
					message: "This chat ID is not valid.",
				});
			}

			const connectedRecipients = CONNECTED_USERS.filter((connUser) =>
				participantsIds.some(
					(participiantId) => participiantId === connUser.userId
				)
			);

			if (connectedRecipients.length > 1) {
				connectedRecipients.forEach((connRecipient) =>
					io.to(connRecipient.socketId).emit("getChatById", {
						success: true,
						chatData: foundAndUpdatedChat,
					})
				);
			} else {
				socket.emit("getChatById", {
					success: true,
					chatData: foundAndUpdatedChat,
				});
			}
		} catch (e: any) {
			console.error(
				"getChatById: Error during receiving updated chat: ",
				e.message
			);
			socket.emit("getChatById", {
				success: false,
				message: `getChatById: Error during receiving updated chat: ${e.message}`,
			});
		}
	});

	// Sending users for creating chat
	socket.on("getUsersForCreateChat", async (userId, searchReq) => {
		try {
			let usersData: IUser[];
			if (!searchReq) {
				usersData = await User.find({ _id: { $ne: userId } });
			} else {
				usersData = await User.find({
					_id: { $ne: userId },
					$or: [
						{ firstName: { $regex: searchReq, $options: "i" } },
						{ lastName: { $regex: searchReq, $options: "i" } },
						{ email: { $regex: searchReq, $options: "i" } },
					],
				});
			}

			socket.emit("getUsersForCreateChat", { success: true, usersData });
		} catch (e: any) {
			console.error(
				"getUsersForCreateChat: Error during receiving users data ad getUsersForCreateChat event: ",
				e.message
			);
			socket.emit("getUsersForCreateChat", {
				success: false,
				message: `getUsersForCreateChat: Error during receiving users data ad getUsersForCreateChat event: ${e.message}`,
			});
		}
	});

	// Handle opening chat with user
	socket.on("openChatWithUser", async (userId, userForChatId) => {
		try {
			let foundChat = await Chat.findOne({
				participants: { $all: [userId, userForChatId] },
			});
			if (!foundChat) {
				let newChat = await Chat.create({
					createdAt: new Date().toISOString(),
					createdBy: userId,
					messages: [],
					participants: [userId, userForChatId],
				});
				newChat = await newChat.populate(["createdBy", "participants"]);
				socket.emit("openChatWithUser", { success: true, chat: newChat });
				return;
			}
			foundChat = await foundChat.populate(["createdBy", "participants"]);
			socket.emit("openChatWithUser", { success: true, chat: foundChat });
		} catch (e: any) {
			console.error(
				`openChatWithUser: Error during opening chat with user: ${e.message}`
			);
			socket.emit("openChatWithUser", {
				success: false,
				message: `openChatWithUser: Error during opening chat with user: ${e.message}`,
			});
		}
	});

	// Handling deleting messages from chat
	socket.on(
		"deleteMessages",
		async (chatId, messagesForDeletingIds, participantsIds) => {
			try {
				const chat = await Chat.findOne({ _id: chatId })
					.populate<{ child: IUser }>("participants")
					// .populate<{ child: IUser }>("messages.sender")
					.populate<{ child: IUser }>("createdBy");
				// .populate<{ child: IUser }>("messages.replyMessage.sender")
				// .populate<{ child: IUser }>("messages.forwarder");

				if (!chat) {
					socket.emit("getChatById", {
						success: false,
						message: `deleteMessages: Error during deleting messages from chat: Chat not found`,
					});
				}
				const filteredMessages: IMessage[] = chat.messages.filter(
					(msg) =>
						!messagesForDeletingIds.some(
							(msgForDelId) => msgForDelId === msg._id
						)
				);

				chat.messages = filteredMessages;

				await chat.save();

				const connectedRecipients = CONNECTED_USERS.filter((connUser) =>
					participantsIds.some(
						(participiantId) => participiantId === connUser.userId
					)
				);

				if (connectedRecipients.length > 1) {
					connectedRecipients.forEach((connRecipient) =>
						io.to(connRecipient.socketId).emit("getChatById", {
							success: true,
							chatData: chat,
						})
					);
				} else {
					socket.emit("getChatById", {
						success: true,
						chatData: chat,
					});
				}
			} catch (e) {
				console.error(
					`deleteMessages: Error during deleting messages from chat: ${e.message}`
				);
				socket.emit("getChatById", {
					success: false,
					message: `deleteMessages: Error during deleting messages from chat: ${e.message}`,
				});
			}
		}
	);

	socket.on("getUserById", async (userId) => {
		try {
			const foundUser = await User.findOne({ _id: userId });

			if (!foundUser) {
				console.error("getUserById: User with this ID not found");
				return socket.emit("getUserById", {
					success: false,
					message: "getUserById: User with this ID not found",
				});
			}

			socket.emit("getUserById", { success: true, userData: foundUser });
		} catch (e: any) {
			console.error(
				`getUserById: Error during finding user in getUserById: ${e.message}`
			);
			socket.emit("getUserById", {
				success: false,
				message: `getUserById: Error during finding user in getUserById: ${e.message}`,
			});
		}
	});

	socket.on("disconnect", () => {
		const foundConnUserIdx = CONNECTED_USERS.findIndex(
			(connUser) => connUser.socketId === socket.id
		);
		if (foundConnUserIdx !== -1) {
			CONNECTED_USERS.splice(foundConnUserIdx, 1);
		}
		console.log(`Disconnected: ${socket.id}`);
	});
});

export const startSocketServer = () => {
	httpServer.listen(SOCKET_SERVER_PORT);
	console.log("Socket server started on port ", SOCKET_SERVER_PORT);
};
