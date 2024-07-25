import { createContext, Dispatch, SetStateAction, useContext } from "react";
import { Socket } from "socket.io-client";
import {
  ISocketEmitEvent,
  ISocketOnEvent,
  IUserState,
} from "../../shared/types";
export type GlobalStates = {
  loading: boolean;
  setLoading: (newState: boolean) => void;
  chatsLoading: boolean;
  setChatsLoading: (newState: boolean) => void;
  chatLoading: boolean;
  setChatLoading: (newState: boolean) => void;
  createChatLoading: boolean;
  setCreateChatLoading: (newState: boolean) => void;

  connectionState: Socket<ISocketOnEvent, ISocketEmitEvent> | null;
  setConnectionState: Dispatch<
    SetStateAction<Socket<ISocketOnEvent, ISocketEmitEvent> | null>
  >;
  usersForChat: IUserState[];
  setUsersForChat: (newState: IUserState[]) => void;
};
export const GlobalContext = createContext<GlobalStates>({
  loading: false,
  setLoading: () => {},
  chatsLoading: false,
  setChatsLoading: () => {},
  chatLoading: false,
  setChatLoading: () => {},
  createChatLoading: false,
  setCreateChatLoading: () => {},

  connectionState: null,
  setConnectionState: () => {},
  usersForChat: [],
  setUsersForChat: () => {},
});
export const useGlobalContext = () => useContext(GlobalContext);
