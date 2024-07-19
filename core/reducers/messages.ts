import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IMessage } from "../../shared/types";

const initialState: IMessage[] = [];

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setMessages: (state, action: PayloadAction<IMessage[]>) => {
      return action.payload;
    },
    addMessage: (state, action: PayloadAction<IMessage>) => {
      state.push(action.payload);
    },
  },
});

export const { setMessages, addMessage } = messagesSlice.actions;

export default messagesSlice.reducer;
