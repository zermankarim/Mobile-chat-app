import { createContext, useContext } from "react";
export type GlobalStates = {
  chatsLoading: boolean;
  setChatsLoading: (newState: boolean) => void;
};
export const GlobalContext = createContext<GlobalStates>({
  chatsLoading: false, // set a default value
  setChatsLoading: () => {},
});
export const useGlobalContext = () => useContext(GlobalContext);
