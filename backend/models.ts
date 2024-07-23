import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dateOfBirth: { type: String },
  email: { type: String, required: true },
  avatars: [String],
  friends: [String],
  backgroundColors: [String],
  password: { type: String, required: true },
});

const chatSchema = new Schema({
  createdAt: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "users" },
  messages: [
    {
      createdAt: { type: String, required: true },
      text: { type: String },
      sender: { type: Schema.Types.ObjectId, ref: "users" },
    },
  ],
  participants: [{ type: Schema.Types.ObjectId, ref: "users" }],
});

const User = mongoose.model("users", userSchema);
const Chat = mongoose.model("chats", chatSchema);

module.exports = { User, Chat };
