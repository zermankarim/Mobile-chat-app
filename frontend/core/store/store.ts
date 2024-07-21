import { configureStore } from "@reduxjs/toolkit";
import user from "../reducers/user";
import messages from "../reducers/messages";
import chats from "../reducers/chats";
import currentChat from "../reducers/currentChat";

export const store = configureStore({
  reducer: {
    user: user,
    messages: messages,
    chats: chats,
    currentChat: currentChat,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
