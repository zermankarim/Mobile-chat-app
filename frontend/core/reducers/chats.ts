import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IChat, IChatPopulated } from "../../shared/types";

const initialState: IChatPopulated[] = [];

const chatsSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    setChats: (state, action: PayloadAction<IChatPopulated[]>) => {
      state.splice(0, state.length, ...action.payload);
    },
  },
});

export const { setChats } = chatsSlice.actions;

export default chatsSlice.reducer;
