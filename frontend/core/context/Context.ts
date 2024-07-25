import { createContext, Dispatch, SetStateAction, useContext } from "react";
import { Socket } from "socket.io-client";
import { ISocketEmitEvent, ISocketOnEvent } from "../../shared/types";
export type GlobalStates = {
  chatsLoading: boolean;
  setChatsLoading: (newState: boolean) => void;
  chatLoading: boolean;
  setChatLoading: (newState: boolean) => void;
  connectionState: Socket<ISocketOnEvent, ISocketEmitEvent> | null;
  setConnectionState: Dispatch<
    SetStateAction<Socket<ISocketOnEvent, ISocketEmitEvent> | null>
  >;
};
export const GlobalContext = createContext<GlobalStates>({
  chatsLoading: false,
  setChatsLoading: () => {},
  chatLoading: false,
  setChatLoading: () => {},
  connectionState: null,
  setConnectionState: () => {},
});
export const useGlobalContext = () => useContext(GlobalContext);
