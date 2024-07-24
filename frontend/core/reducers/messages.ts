import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IMessagePopulated } from "../../shared/types";

const initialState: IMessagePopulated[] = [];

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setMessages: (state, action: PayloadAction<IMessagePopulated[]>) => {
      return action.payload;
    },
    addMessage: (state, action: PayloadAction<IMessagePopulated>) => {
      state.push(action.payload);
    },
  },
});

export const { setMessages, addMessage } = messagesSlice.actions;

export default messagesSlice.reducer;
