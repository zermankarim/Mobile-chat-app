import { IChatPopulated } from "./../../shared/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: IChatPopulated = {
  _id: "",
  createdAt: "",
  messages: [],
  participants: {},
  createdBy: {
    _id: "",
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    avatars: [],
    backgroundColors: [],
    friends: [],
  },
};

const currentChatSlice = createSlice({
  name: "currentChat",
  initialState,
  reducers: {
    setCurrentChat: (state, action: PayloadAction<IChatPopulated>) => {
      const { _id, createdAt, createdBy, messages, participants } =
        action.payload;
      state._id = _id;
      state.createdAt = createdAt;
      state.createdBy = createdBy;
      state.messages = messages;
      state.participants = participants;
    },
  },
});

export const { setCurrentChat } = currentChatSlice.actions;

export default currentChatSlice.reducer;
