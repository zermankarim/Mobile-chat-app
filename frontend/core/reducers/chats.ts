import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IChatClient } from "../../shared/types";

const initialState: IChatClient[] = [];

const chatsSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    setChats: (state, action: PayloadAction<IChatClient[]>) => {
      state.splice(0, state.length, ...action.payload);
    },
  },
});

export const { setChats } = chatsSlice.actions;

export default chatsSlice.reducer;
