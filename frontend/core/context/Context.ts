import { createContext, Dispatch, SetStateAction, useContext } from "react";
import { Socket } from "socket.io-client";
import { ISocketEmitEvent, ISocketOnEvent } from "../../shared/types";
export type GlobalStates = {
  chatsLoading: boolean;
  setChatsLoading: (newState: boolean) => void;
  connectionState: Socket<ISocketOnEvent, ISocketEmitEvent> | null;
  setConnectionState: Dispatch<
    SetStateAction<Socket<ISocketOnEvent, ISocketEmitEvent> | null>
  >;
};
export const GlobalContext = createContext<GlobalStates>({
  chatsLoading: false, // set a default value
  setChatsLoading: () => {},
  connectionState: null,
  setConnectionState: () => {},
});
export const useGlobalContext = () => useContext(GlobalContext);
