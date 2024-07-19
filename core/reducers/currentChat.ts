import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IChatClient, IMessage } from "../../shared/types";

const initialState: IChatClient = {
  id: "",
  createdAt: "",
  messages: [],
  participants: [],
  createdBy: "",
};

const currentChatSlice = createSlice({
  name: "currentChat",
  initialState,
  reducers: {
    setCurrentChat: (state, action: PayloadAction<IChatClient>) => {
      const { id, createdAt, createdBy, messages, participants } =
        action.payload;
      state.id = id;
      state.createdAt = createdAt;
      state.createdBy = createdBy;
      state.messages = messages;
      state.participants = participants;
    },
  },
});

export const { setCurrentChat } = currentChatSlice.actions;

export default currentChatSlice.reducer;
