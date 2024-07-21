import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  uid: String,
  firstName: String,
  lastName: String,
  dateOfBirth: String,
  email: String,
  avatars: [String],
  friends: [String],
  backgroundColors: [String],
});

const chatSchema = new Schema({
  createdAt: String,
  createdBy: String,
  messages: [],
  participants: [userSchema],
});

const User = mongoose.model("users", userSchema);
const Chat = mongoose.model("chats", chatSchema);

module.exports = { User, Chat };
